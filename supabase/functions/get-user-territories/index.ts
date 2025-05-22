
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Helper for logging steps in the function execution
const logStep = (step: string, details?: any) => {
  console.log(`[GET-USER-TERRITORIES] ${step}${details ? `: ${JSON.stringify(details)}` : ''}`);
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, includeInactive } = await req.json();
    
    if (!userId) {
      throw new Error("userId is required");
    }

    logStep("Fetching territories for user", { userId, includeInactive });

    // Initialize Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      }
    });

    // Prepare query to get territories for the user
    let query = supabaseAdmin
      .from('territories')
      .select('*')
      .eq('user_id', userId);
      
    // Filter by active status if requested
    if (!includeInactive) {
      query = query.eq('active', true);
    }

    // Execute the query
    logStep("Executing territories query");
    const { data: territories, error } = await query;
    
    if (error) {
      logStep("Error fetching territories", error);
      throw error;
    }
    
    // Add additional logging about active vs. inactive territories
    const activeCount = territories.filter(t => t.active).length;
    const inactiveCount = territories.filter(t => !t.active).length;
    logStep(`Successfully fetched ${territories.length} territories (${activeCount} active, ${inactiveCount} inactive)`);

    return new Response(JSON.stringify({ 
      territories,
      fetchedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("Error in get-user-territories function", { message: error.message });
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
