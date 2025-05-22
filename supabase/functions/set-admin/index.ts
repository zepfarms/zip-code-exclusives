
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Helper for logging steps in the function execution
const logStep = (step: string, details?: any) => {
  console.log(`[SET-ADMIN] ${step}${details ? `: ${JSON.stringify(details)}` : ''}`);
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, isAdmin, requesterUserId } = await req.json();
    
    if (!userId || isAdmin === undefined || !requesterUserId) {
      throw new Error("userId, isAdmin, and requesterUserId are required");
    }

    logStep("Processing request to set admin status", { userId, isAdmin, requesterUserId });

    // Initialize Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      }
    });

    // Check if requester is an admin using our new security definer function directly
    const { data: requesterData, error: requesterError } = await supabaseAdmin
      .from('user_profiles')
      .select('is_admin')
      .eq('id', requesterUserId)
      .single();
    
    if (requesterError) {
      logStep("Error checking requester admin status", requesterError);
      throw new Error("Failed to verify requester admin status");
    }
    
    if (!requesterData?.is_admin && requesterUserId !== userId) {
      logStep("Unauthorized request", { requesterUserId });
      return new Response(JSON.stringify({ 
        success: false, 
        error: "You don't have permission to set admin status" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // Update the user's admin status
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .update({ is_admin: isAdmin })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      logStep("Error updating admin status", error);
      throw new Error(`Failed to update admin status: ${error.message}`);
    }
    
    logStep("Successfully updated admin status", { userId, isAdmin });
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `User ${isAdmin ? 'is now' : 'is no longer'} an admin`, 
      user: data 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("Error in set-admin function", { message: error.message });
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
