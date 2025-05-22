
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const stripe = {
  client: new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
  }),
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("Create-checkout function called");
    
    // Create a client with the supabase-js library using service role key
    // This bypasses RLS and ensures the function works regardless of auth state
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Extract the authorization header from the request if it exists
    const authHeader = req.headers.get("Authorization");
    let userId = null;
    
    // If there's an auth header, try to get the user from it
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      console.log("Attempting to authenticate user with token");
      
      const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
      
      if (userError) {
        console.error("Error getting authenticated user:", userError);
      } else if (user) {
        userId = user.id;
        console.log("Authenticated user found:", userId);
      }
    } else {
      console.log("No Authorization header found in request");
    }
    
    // If we couldn't get a user ID, return unauthorized
    if (!userId) {
      console.error("No authenticated user found");
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract the zipCode from the request
    const requestData = await req.json();
    const { zipCode, leadType } = requestData;
    
    console.log("Request data:", JSON.stringify(requestData));
    
    if (!zipCode) {
      console.error("Missing zipCode parameter");
      return new Response(
        JSON.stringify({ error: "Missing zipCode parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check zip code availability
    console.log("Checking zip code availability for:", zipCode);
    const { data: zipData, error: zipError } = await supabaseAdmin
      .from("zip_codes")
      .select("*")
      .eq("zip_code", zipCode)
      .maybeSingle();
      
    if (zipError) {
      console.error("Error checking zip code:", zipError);
      return new Response(
        JSON.stringify({ error: "Error checking zip code availability" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!zipData) {
      console.log("Zip code not found in database, creating new record");
      const { error: insertError } = await supabaseAdmin
        .from("zip_codes")
        .insert({ zip_code: zipCode, available: true });
        
      if (insertError) {
        console.error("Failed to create zip code record:", insertError);
      }
    } else if (!zipData.available) {
      console.error("Zip code is not available:", zipCode);
      return new Response(
        JSON.stringify({ error: "Zip code is not available" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Check if user already has this territory
    console.log("Checking if user already has this territory");
    const { data: existingTerritory, error: territoryError } = await supabaseAdmin
      .from("territories")
      .select("*")
      .eq("zip_code", zipCode)
      .eq("active", true)
      .maybeSingle();
      
    if (territoryError && territoryError.code !== "PGRST116") {
      console.error("Error checking existing territory:", territoryError);
      return new Response(
        JSON.stringify({ error: "Error checking existing territory" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (existingTerritory) {
      console.error("Territory already taken:", zipCode);
      return new Response(
        JSON.stringify({ error: "This territory is already taken" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save the user's email to use for Stripe
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (userError) {
      console.error("Error getting user data:", userError);
      return new Response(
        JSON.stringify({ error: "Error getting user data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const userEmail = userData.user?.email || "unknown@example.com";
    
    // Generate success and cancel URLs
    const origin = req.headers.get("origin") || "https://ietvubimwsfugzkiycus.supabase.co";
    const successUrl = new URL("/payment-success", origin);
    successUrl.searchParams.set("zip_code", zipCode);
    
    // Normalize the lead type for success URL
    const normalizedLeadType = leadType === 'agent' ? 'agent' : 'investor';
    successUrl.searchParams.set("lead_type", normalizedLeadType);
    
    // Generate a cancel URL that goes back to payment page with zip code
    const cancelUrl = new URL("/payment", origin);
    cancelUrl.searchParams.set("zip_code", zipCode);

    // Save checkout details for admin notification
    try {
      await supabaseAdmin.from("territory_requests").insert({
        user_id: userId,
        user_email: userEmail,
        zip_code: zipCode,
        status: 'pending',
        created_at: new Date().toISOString()
      });
      
      console.log("Territory request recorded for admin notification");
    } catch (error) {
      console.error("Error recording territory request:", error);
      // Continue with checkout even if recording fails
    }

    // Check if this user already has a Stripe customer ID
    let customerId;
    const { data: customerData } = await supabaseAdmin
      .from("user_profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();
      
    if (customerData?.stripe_customer_id) {
      customerId = customerData.stripe_customer_id;
      console.log("Found existing Stripe customer:", customerId);
    } else {
      // Create a new customer in Stripe
      try {
        const customer = await stripe.client.customers.create({
          email: userEmail,
          metadata: {
            user_id: userId
          }
        });
        customerId = customer.id;
        
        // Save the customer ID to the user's profile
        await supabaseAdmin
          .from("user_profiles")
          .update({ stripe_customer_id: customerId })
          .eq("id", userId);
          
        console.log("Created new Stripe customer:", customerId);
      } catch (error) {
        console.error("Error creating Stripe customer:", error);
        return new Response(
          JSON.stringify({ error: "Failed to create Stripe customer" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Create a Stripe checkout session for a $1 payment
    try {
      console.log("Creating Stripe checkout session for zip code:", zipCode);
      const session = await stripe.client.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Exclusive Territory: ${zipCode}`,
                description: `Exclusive rights to receive leads in zip code ${zipCode}`
              },
              unit_amount: 100, // $1.00 in cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: successUrl.toString(),
        cancel_url: cancelUrl.toString(),
        metadata: {
          zip_code: zipCode,
          user_id: userId,
          lead_type: normalizedLeadType
        }
      });
      
      console.log("Generated Stripe checkout URL:", session.url);
      
      return new Response(
        JSON.stringify({ success: true, url: session.url }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
      return new Response(
        JSON.stringify({ error: "Failed to create checkout session" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error in create-checkout function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
