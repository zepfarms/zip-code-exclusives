
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
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: authError?.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if the requesting user is zepfarms@gmail.com (the only allowed admin)
    if (user.email !== 'zepfarms@gmail.com') {
      return new Response(
        JSON.stringify({ error: 'Forbidden - Only zepfarms@gmail.com can access admin features' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Parse the request body to get the user ID to delete
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Prevent admin from deleting themselves
    if (userId === user.id) {
      return new Response(
        JSON.stringify({ error: 'Cannot delete yourself' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Admin requested deletion of user ID: ${userId}`);
    
    // First handle database dependencies in the correct order to avoid foreign key constraints
    
    // 1. Delete leads first (they reference user_id)
    const { error: deleteLeadsError } = await supabaseClient
      .from('leads')
      .delete()
      .eq('user_id', userId);
    
    if (deleteLeadsError) {
      console.warn("Error deleting leads:", deleteLeadsError);
      // Continue with deletion even if this fails
    } else {
      console.log("Successfully deleted leads for user");
    }
    
    // 2. Delete user profile
    const { error: deleteProfileError } = await supabaseClient
      .from('user_profiles')
      .delete()
      .eq('id', userId);
    
    if (deleteProfileError) {
      console.error("Error deleting user profile:", deleteProfileError);
      return new Response(
        JSON.stringify({ error: `Failed to delete user profile: ${deleteProfileError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // 3. Delete territories
    const { error: deleteTerritoriesError } = await supabaseClient
      .from('territories')
      .delete()
      .eq('user_id', userId);
    
    if (deleteTerritoriesError) {
      console.warn("Error deleting territories:", deleteTerritoriesError);
      // Continue with deletion even if this fails
    }
    
    // 4. Delete territory requests
    const { error: deleteRequestsError } = await supabaseClient
      .from('territory_requests')
      .delete()
      .eq('user_id', userId);
    
    if (deleteRequestsError) {
      console.warn("Error deleting territory requests:", deleteRequestsError);
      // Continue with deletion even if this fails
    }
    
    // 5. Finally, delete the user from auth.users
    const { error } = await supabaseClient.auth.admin.deleteUser(userId);
    
    if (error) {
      throw error;
    }

    console.log(`User ${userId} deleted successfully`);

    return new Response(
      JSON.stringify({ success: true, message: 'User deleted successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in delete-user function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
