
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { zipCode, userId } = await req.json();
    
    if (!zipCode) {
      return new Response(
        JSON.stringify({ error: "Missing zip code" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[CHECK-TERRITORY] Checking availability for zip code ${zipCode} by user ${userId}`);

    // Initialize Supabase admin client to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify the user is an admin first
    if (userId) {
      const { data: userProfile, error: userError } = await supabaseAdmin
        .from('user_profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error("Error checking admin status:", userError);
        // Special case for some test accounts as a failsafe
        const { data: userInfo } = await supabaseAdmin.auth.admin.getUserById(userId);
        
        if (!userInfo?.user || (userInfo.user.email !== 'zepfarms@gmail.com')) {
          return new Response(
            JSON.stringify({ error: "Unauthorized access" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } else if (!userProfile.is_admin) {
        return new Response(
          JSON.stringify({ error: "Unauthorized access" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Check if the zip code exists in territories and is active
    const { data: existingTerritories, error: territoryError } = await supabaseAdmin
      .from('territories')
      .select('id, user_id, zip_code, lead_type, active')
      .eq('zip_code', zipCode);
    
    if (territoryError) {
      console.error("Error checking territories:", territoryError);
      throw territoryError;
    }
    
    // Only consider active territories as unavailable
    const activeTerritory = existingTerritories?.find(t => t.active === true);
    
    if (activeTerritory) {
      // Get user details for the active territory
      const { data: userProfiles } = await supabaseAdmin
        .from('user_profiles')
        .select('first_name, last_name')
        .eq('id', activeTerritory.user_id)
        .maybeSingle();
        
      const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(activeTerritory.user_id);
      
      const userName = userProfiles && (userProfiles.first_name || userProfiles.last_name) ? 
        `${userProfiles.first_name || ''} ${userProfiles.last_name || ''}`.trim() : 
        'unknown user';
      
      return new Response(
        JSON.stringify({ 
          available: false,
          existingTerritory: {
            ...activeTerritory,
            userName,
            userEmail: user?.email || 'N/A'
          }
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // If we got here, it means the territory is either not in the database
    // or it exists but is not active, so we'll mark it as available
    return new Response(
      JSON.stringify({ available: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error checking zip code availability:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred while checking availability" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
