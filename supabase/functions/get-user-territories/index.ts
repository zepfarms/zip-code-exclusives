
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
    const { userId, includeInactive, getAllForAdmin } = await req.json();
    
    if (!userId) {
      throw new Error("userId is required");
    }

    logStep("Fetching territories", { userId, includeInactive, getAllForAdmin });

    // Initialize Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      }
    });

    // Check if user is admin when getAllForAdmin is true
    if (getAllForAdmin) {
      logStep("Checking admin status for user requesting all territories");
      const { data: adminCheck, error: adminCheckError } = await supabaseAdmin
        .from('user_profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();
      
      if (adminCheckError) {
        logStep("Error checking admin status", adminCheckError);
        throw new Error("Failed to verify admin status");
      }
      
      if (!adminCheck?.is_admin) {
        logStep("Unauthorized: User is not an admin");
        return new Response(JSON.stringify({ 
          error: "You don't have permission to access all territories" 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403,
        });
      }
      
      logStep("Admin verified, fetching all territories");
      
      // Get all territories for admin
      let query = supabaseAdmin
        .from('territories')
        .select('*');
      
      // Filter by active status if requested
      if (!includeInactive) {
        query = query.eq('active', true);
      }
      
      // Execute the query
      const { data: territories, error } = await query;
      
      if (error) {
        logStep("Error fetching all territories", error);
        throw error;
      }
      
      logStep(`Successfully fetched ${territories.length} territories for admin`);
      
      return new Response(JSON.stringify({ 
        territories,
        fetchedAt: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Standard request - get territories for a specific user
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
    logStep("Executing territories query for user");
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
