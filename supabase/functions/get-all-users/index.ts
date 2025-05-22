
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key (required for admin operations)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get the user making the request
    const authHeader = req.headers.get('Authorization') || '';
    const currentUser = await supabaseClient.auth.getUser(authHeader);
    
    if (!currentUser.data.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if the requesting user is zepfarms@gmail.com (the only allowed admin)
    if (currentUser.data.user.email !== 'zepfarms@gmail.com') {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get all users from the auth.users table (only possible with service_role key)
    const { data: users, error } = await supabaseClient.auth.admin.listUsers();
    
    if (error) {
      throw error;
    }

    // Return mapped users with ID and email
    const mappedUsers = users.users.map(user => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at
    }));

    return new Response(
      JSON.stringify(mappedUsers),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
