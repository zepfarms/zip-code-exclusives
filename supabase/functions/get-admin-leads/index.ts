
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Helper for logging steps in the function execution
const logStep = (step: string, details?: any) => {
  console.log(`[GET-ADMIN-LEADS] ${step}${details ? `: ${JSON.stringify(details)}` : ''}`);
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the current user's session
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
        auth: { persistSession: false }
      }
    );

    // Check if the user is authenticated
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

    if (sessionError || !session) {
      logStep("Error authenticating user", sessionError);
      throw new Error("Not authenticated");
    }

    const userId = session.user.id;
    logStep("Got authenticated user", userId);

    // Check if the user is an admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: { persistSession: false }
      }
    );

    // Check if user is admin via direct profile query
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (profileError) {
      logStep("Error fetching user profile", profileError);
      throw new Error("Error checking admin status");
    }

    if (!userProfile?.is_admin && session.user.email !== 'zepfarms@gmail.com') {
      logStep("User is not an admin", userId);
      throw new Error("Unauthorized - admin access required");
    }

    logStep("Admin status confirmed");

    // Get all leads
    const { data: leads, error: leadsError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (leadsError) {
      logStep("Error fetching leads", leadsError);
      throw leadsError;
    }

    // Get user profiles to join with leads
    const { data: userProfiles, error: userProfilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, first_name, last_name');

    if (userProfilesError) {
      logStep("Error fetching user profiles", userProfilesError);
      // Continue without user profiles
    }

    // Get all users from auth
    const { data: { users: authUsers }, error: authUsersError } = await supabaseAdmin.auth.admin.listUsers();

    if (authUsersError) {
      logStep("Error fetching auth users", authUsersError);
      // Continue without auth users
    }

    // Join leads with user information
    const processedLeads = leads.map(lead => {
      const userProfile = userProfiles?.find(profile => profile.id === lead.user_id);
      const authUser = authUsers?.find(user => user.id === lead.user_id);

      return {
        ...lead,
        user_info: userProfile ? {
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          email: authUser?.email
        } : authUser ? {
          first_name: authUser.user_metadata?.first_name || null,
          last_name: authUser.user_metadata?.last_name || null,
          email: authUser.email
        } : undefined
      };
    });

    logStep(`Successfully fetched ${processedLeads.length} leads`);

    return new Response(JSON.stringify({
      leads: processedLeads,
      fetchedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("Error in get-admin-leads function", { message: error.message });
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
