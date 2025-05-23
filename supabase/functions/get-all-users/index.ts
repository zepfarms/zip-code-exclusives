
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[GET-ALL-USERS] Processing request");
    
    // Get the user ID from the request body or auth header
    const requestBody = await req.json().catch(() => ({}));
    const userId = requestBody.userId;

    console.log(`[GET-ALL-USERS] Request from user ID: ${userId || 'Not provided'}`);

    // Create a Supabase client with the service role key (required for admin operations)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // If userId is provided, verify admin status
    if (userId) {
      // Check if the requesting user is an admin
      const { data: adminCheck, error: adminCheckError } = await supabaseClient
        .from('user_profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();
        
      if (adminCheckError) {
        console.error(`[GET-ALL-USERS] Admin check error: ${adminCheckError.message}`);
        
        // Special case for zepfarms@gmail.com as a fallback
        const { data: userInfo } = await supabaseClient.auth.admin.getUserById(userId);
        
        if (!userInfo?.user || userInfo.user.email !== 'zepfarms@gmail.com') {
          console.error(`[GET-ALL-USERS] User ${userId} is not authorized`);
          return new Response(
            JSON.stringify({ error: 'Forbidden - Only admins can access user data' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        console.log(`[GET-ALL-USERS] Special admin access granted for zepfarms@gmail.com`);
      } else if (!adminCheck?.is_admin) {
        // Double-check with email
        const { data: userInfo } = await supabaseClient.auth.admin.getUserById(userId);
        
        if (!userInfo?.user || userInfo.user.email !== 'zepfarms@gmail.com') {
          console.error(`[GET-ALL-USERS] User ${userId} is not an admin`);
          return new Response(
            JSON.stringify({ error: 'Forbidden - Only admins can access user data' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        console.log(`[GET-ALL-USERS] Special admin access granted for zepfarms@gmail.com`);
      } else {
        console.log(`[GET-ALL-USERS] Admin access confirmed for user ${userId}`);
      }
    } else {
      // If no userId provided, use the auth header method as fallback
      const authHeader = req.headers.get('Authorization') || '';
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
      
      if (authError || !user) {
        console.error(`[GET-ALL-USERS] Auth error: ${authError?.message || 'No user found'}`);
        return new Response(
          JSON.stringify({ error: 'Unauthorized', details: authError?.message }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Check if the user is an admin
      const { data: adminCheck, error: adminCheckError } = await supabaseClient
        .from('user_profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
        
      if (adminCheckError || !adminCheck?.is_admin) {
        // Special case for zepfarms@gmail.com as a fallback
        if (user.email !== 'zepfarms@gmail.com') {
          console.error(`[GET-ALL-USERS] User ${user.id} (${user.email}) is not an admin`);
          return new Response(
            JSON.stringify({ error: 'Forbidden - Only admins can access user data' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        console.log(`[GET-ALL-USERS] Special admin access granted for zepfarms@gmail.com`);
      } else {
        console.log(`[GET-ALL-USERS] Admin access confirmed for user ${user.id}`);
      }
    }
    
    console.log("[GET-ALL-USERS] Admin access confirmed, fetching all users...");
    
    // Get all users from the auth.users table (only possible with service_role key)
    const { data: users, error } = await supabaseClient.auth.admin.listUsers();
    
    if (error) {
      console.error(`[GET-ALL-USERS] Error fetching users: ${error.message}`);
      throw error;
    }

    console.log(`[GET-ALL-USERS] Successfully fetched ${users.users.length} users`);

    // Return mapped users with more details
    const mappedUsers = users.users.map(user => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      app_metadata: user.app_metadata,
      user_metadata: user.user_metadata,
      confirmed_at: user.confirmed_at,
      banned_until: user.banned_until,
    }));

    return new Response(
      JSON.stringify(mappedUsers),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[GET-ALL-USERS] Error:', error.message);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
