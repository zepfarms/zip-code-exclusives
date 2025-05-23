
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Helper for logging steps in the function execution
const logStep = (step: string, details?: any) => {
  console.log(`[GET-USER-LEADS] ${step}${details ? `: ${JSON.stringify(details)}` : ''}`);
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Add more robust request body parsing with error handling
    let userId;
    try {
      const body = await req.json();
      userId = body.userId;
      logStep("Request received", { userId });
    } catch (parseError) {
      logStep("Invalid JSON in request", { error: parseError.message });
      return new Response(JSON.stringify({ 
        error: "Invalid request format", 
        details: parseError.message 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    
    if (!userId) {
      logStep("Missing userId in request");
      return new Response(JSON.stringify({ 
        error: "userId is required" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    logStep("Fetching leads for user", userId);

    // Initialize Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      logStep("Missing environment variables", { 
        hasUrl: !!supabaseUrl, 
        hasKey: !!supabaseServiceRoleKey 
      });
      throw new Error("Missing required environment variables");
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      }
    });

    // Get leads for the user with detailed logging
    logStep("Executing database query", { 
      table: 'leads', 
      filter: { user_id: userId, archived: false },
      order: 'created_at DESC' 
    });
    
    const { data: leads, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .eq('archived', false)
      .order('created_at', { ascending: false });
    
    if (error) {
      logStep("Database error", { 
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    logStep(`Successfully fetched leads`, { count: leads?.length || 0 });
    
    // Return no leads found if null
    if (!leads) {
      logStep("No leads found");
      return new Response(JSON.stringify({ 
        leads: [],
        fetchedAt: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Log sample lead data for debugging (only first lead, limited fields)
    if (leads.length > 0) {
      const sampleLead = {
        id: leads[0].id,
        name: leads[0].name,
        user_id: leads[0].user_id,
        territory_zip_code: leads[0].territory_zip_code,
        status: leads[0].status
      };
      logStep("Sample lead data", sampleLead);
    }

    return new Response(JSON.stringify({ 
      leads,
      fetchedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("Error in get-user-leads function", { 
      message: error.message,
      stack: error.stack
    });
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
