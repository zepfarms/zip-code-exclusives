
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
    logStep("Starting admin leads function");
    
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      logStep("Missing authorization header");
      throw new Error("Missing authorization header");
    }
    
    // Create a Supabase client with the auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } },
        auth: { persistSession: false }
      }
    );

    // Check if the user is authenticated
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
    if (sessionError || !session) {
      logStep("Auth error or no session", { error: sessionError?.message });
      throw new Error("Not authenticated");
    }

    const userId = session.user.id;
    logStep("User authenticated", { userId });

    // Create admin client with service role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Check if user is admin
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      logStep("Error checking admin status", { error: profileError.message });
      throw new Error("Error checking admin status");
    }

    // Allow access if user is admin or has the special admin email
    if (!userProfile?.is_admin && session.user.email !== 'zepfarms@gmail.com') {
      logStep("Access denied - not an admin", { userId, email: session.user.email });
      throw new Error("Unauthorized: Admin access required");
    }

    logStep("Admin access granted");

    // Get all leads with service role
    const { data: leads, error: leadsError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (leadsError) {
      logStep("Error fetching leads", { error: leadsError.message });
      throw leadsError;
    }

    // Get user profiles to join with leads
    const { data: userProfiles, error: userProfilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, first_name, last_name');

    // Get auth users for email info
    const { data: { users: authUsers }, error: authUsersError } = await supabaseAdmin.auth.admin.listUsers();

    // Join leads with user info
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

    logStep("Success", { leadCount: processedLeads.length });

    return new Response(JSON.stringify({
      leads: processedLeads,
      fetchedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });
  } catch (error: any) {
    logStep("Error processing request", { message: error.message });
    
    return new Response(JSON.stringify({
      error: error.message || "Unknown error occurred"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 401
    });
  }
});
