
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Helper for logging steps in the function execution
const logStep = (step: string, details?: any) => {
  console.log(`[GET-ADMIN-PROFILES] ${step}${details ? `: ${JSON.stringify(details)}` : ''}`);
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

    logStep("Checking admin status and fetching profiles", { requesterId: userId });

    // Initialize Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      }
    });

    // Check if the user requesting profiles is an admin
    const { data: adminCheck, error: adminCheckError } = await supabaseAdmin
      .from('user_profiles')
      .select('is_admin')
      .eq('id', userId)
      .maybeSingle();
    
    if (adminCheckError) {
      logStep("Error checking admin status", adminCheckError);
      throw new Error("Failed to verify admin status");
    }
    
    const isAdmin = adminCheck?.is_admin === true;
    
    // Allow access for a specific email as backup
    let email = '';
    const { data: userInfo } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (userInfo?.user) {
      email = userInfo.user.email || '';
    }
    
    if (!isAdmin && email !== 'zepfarms@gmail.com') {
      logStep("Unauthorized: User is not an admin", { isAdmin, email });
      return new Response(JSON.stringify({ 
        error: "You don't have permission to access all profiles" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }
    
    logStep("Admin verified, fetching all profiles");
    
    // Get all profiles using service role to bypass RLS
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('*');
    
    if (profilesError) {
      logStep("Error fetching profiles", profilesError);
      throw profilesError;
    }
    
    logStep(`Successfully fetched ${profiles.length} user profiles`);
    
    return new Response(JSON.stringify(profiles), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("Error in get-admin-profiles function", { message: error.message });
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
