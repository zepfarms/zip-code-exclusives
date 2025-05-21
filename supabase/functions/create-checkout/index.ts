
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = {
  url: "https://api.stripe.com/v1/checkout/sessions",
  apiKey: Deno.env.get("STRIPE_SECRET_KEY") || "",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the current user from the request
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: req.headers.get("Authorization")! } },
        auth: { persistSession: false }
      }
    );

    const { data: { session } } = await supabaseClient.auth.getSession();

    if (!session) {
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract the zipCode from the request
    const { zipCode } = await req.json();
    
    if (!zipCode) {
      return new Response(
        JSON.stringify({ error: "Missing zipCode parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check zip code availability
    const { data: zipData, error: zipError } = await supabaseClient
      .from("zip_codes")
      .select("*")
      .eq("zip_code", zipCode)
      .single();
      
    if (zipError && zipError.code !== "PGRST116") {
      console.error("Error checking zip code:", zipError);
      return new Response(
        JSON.stringify({ error: "Error checking zip code availability" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!zipData || !zipData.available) {
      return new Response(
        JSON.stringify({ error: "Zip code is not available" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Check if user already has this territory
    const { data: existingTerritory, error: territoryError } = await supabaseClient
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
      return new Response(
        JSON.stringify({ error: "This territory is already taken" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a success URL with zip code parameter
    const successUrl = new URL(req.url);
    successUrl.pathname = "/payment-success";
    successUrl.searchParams.set("zip_code", zipCode);
    
    // Generate a cancel URL that goes back to payment page with zip code
    const cancelUrl = new URL(req.url);
    cancelUrl.pathname = "/payment";
    cancelUrl.searchParams.set("zip_code", zipCode);

    // Save checkout details for admin notification
    try {
      const adminServiceClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );
      
      await adminServiceClient.from("territory_requests").insert({
        user_id: session.user.id,
        user_email: session.user.email,
        zip_code: zipCode,
        status: 'pending',
        created_at: new Date().toISOString()
      });
      
      console.log("Territory request recorded for admin notification");
    } catch (error) {
      console.error("Error recording territory request:", error);
      // Continue with checkout even if recording fails
    }

    // For testing purposes - FREE checkout with redirect
    // This simulates a successful checkout without charging
    console.log("Creating FREE test checkout session for zip code:", zipCode);
    
    // Create a simulated checkout URL
    const checkoutUrl = new URL(successUrl);
    
    // Return the direct success URL instead of a Stripe checkout
    return new Response(
      JSON.stringify({ success: true, url: checkoutUrl.toString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in create-checkout function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
