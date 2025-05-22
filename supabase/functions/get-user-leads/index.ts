
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
    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error("userId is required");
    }

    logStep("Fetching leads for user", userId);

    // Initialize Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      }
    });

    // Get leads for the user
    const { data: leads, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .eq('archived', false)
      .order('created_at', { ascending: false });
    
    if (error) {
      logStep("Error fetching leads", error);
      throw error;
    }
    
    logStep(`Successfully fetched ${leads.length} leads`);

    return new Response(JSON.stringify({ 
      leads,
      fetchedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("Error in get-user-leads function", { message: error.message });
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
