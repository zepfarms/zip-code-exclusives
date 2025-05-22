
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { leadData, adminUserId } = await req.json();
    
    if (!leadData || !adminUserId) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required data" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log(`[CREATE-ADMIN-LEAD] Creating lead by admin ${adminUserId}`);
    console.log(`[CREATE-ADMIN-LEAD] Lead data:`, leadData);

    // Initialize Supabase admin client to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify the user is an admin first
    const { data: userProfile, error: userError } = await supabaseAdmin
      .from('user_profiles')
      .select('is_admin')
      .eq('id', adminUserId)
      .single();

    if (userError) {
      console.error("[CREATE-ADMIN-LEAD] Error checking admin status:", userError);
      
      // Special case for zepfarms@gmail.com as a failsafe
      const { data: userInfo } = await supabaseAdmin.auth.admin.getUserById(adminUserId);
      
      if (!userInfo?.user || (userInfo.user.email !== 'zepfarms@gmail.com')) {
        return new Response(
          JSON.stringify({ error: "Unauthorized access" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else if (!userProfile?.is_admin) {
      return new Response(
        JSON.stringify({ error: "Unauthorized access - admin only" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert lead into database using admin privileges
    const { data: lead, error: insertError } = await supabaseAdmin
      .from('leads')
      .insert(leadData)
      .select()
      .single();
    
    if (insertError) {
      console.error("[CREATE-ADMIN-LEAD] Error inserting lead:", insertError);
      throw insertError;
    }
    
    console.log("[CREATE-ADMIN-LEAD] Lead created successfully:", lead);
    
    return new Response(
      JSON.stringify(lead),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[CREATE-ADMIN-LEAD] Error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred while creating lead",
        details: error?.details || null
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
