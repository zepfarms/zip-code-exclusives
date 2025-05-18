
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    // Find user by email
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (userError) {
      throw new Error(`Error fetching users: ${userError.message}`);
    }
    
    const targetEmail = "zepfarms@gmail.com";
    const user = userData.users.find(u => u.email === targetEmail);
    
    if (!user) {
      throw new Error(`User with email ${targetEmail} not found`);
    }
    
    // Update user profile to set them as admin
    const { error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update({ is_admin: true })
      .eq('id', user.id);
      
    if (updateError) {
      throw new Error(`Error updating user profile: ${updateError.message}`);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `User ${targetEmail} has been set as admin`,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error in set-admin function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
