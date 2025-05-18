
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CUSTOMER-PORTAL] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    logStep("Function started");
    
    if (!STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    
    // Initialize Stripe
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });
    
    // Initialize Supabase client with service role key to bypass RLS
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    });
    
    // Extract request body
    const { returnUrl } = await req.json();
    
    // Get user information from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header is missing");
    }
    
    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error("Authentication failed");
    }
    
    const userId = userData.user.id;
    const userEmail = userData.user.email;
    
    if (!userEmail) {
      throw new Error("User email is missing");
    }
    
    logStep("User authenticated", { userId, userEmail });
    
    // Get Stripe customer ID
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();
    
    if (profileError) {
      logStep("Error fetching profile", { error: profileError.message });
      throw new Error("Failed to retrieve user profile");
    }
    
    let customerId = profile?.stripe_customer_id;
    
    // If no customer ID exists, look up by email or create a new customer
    if (!customerId) {
      logStep("No Stripe customer ID found, searching by email");
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Found existing customer by email", { customerId });
        
        // Update user profile with Stripe customer ID
        await supabaseAdmin
          .from("user_profiles")
          .update({ stripe_customer_id: customerId })
          .eq("id", userId);
      } else {
        logStep("Creating new Stripe customer");
        const newCustomer = await stripe.customers.create({
          email: userEmail,
          metadata: { supabase_user_id: userId }
        });
        
        customerId = newCustomer.id;
        logStep("Created new customer", { customerId });
        
        // Update user profile with new Stripe customer ID
        await supabaseAdmin
          .from("user_profiles")
          .update({ stripe_customer_id: customerId })
          .eq("id", userId);
      }
    }
    
    // Create customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${SUPABASE_URL}`
    });
    
    logStep("Created customer portal session", { sessionUrl: session.url });
    
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});
