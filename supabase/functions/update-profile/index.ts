
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Helper for logging steps in the function execution
const logStep = (step: string, details?: any) => {
  console.log(`[UPDATE-PROFILE] ${step}${details ? `: ${JSON.stringify(details)}` : ''}`);
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, profileData } = await req.json();
    
    if (!userId) {
      throw new Error("userId is required");
    }

    if (!profileData || typeof profileData !== 'object') {
      throw new Error("profileData must be a valid object");
    }

    logStep("Processing profile update request for user", userId);
    logStep("Update data", profileData);

    // Initialize Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      }
    });

    // Make sure we never modify the user_type (this can violate a check constraint)
    const sanitizedData = { ...profileData };
    delete sanitizedData.user_type;
    
    // Always update the updated_at timestamp
    sanitizedData.updated_at = new Date().toISOString();

    logStep("Sanitized update data", sanitizedData);

    // Update the profile
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .update(sanitizedData)
      .eq('id', userId)
      .select('*'); // Select all columns to return the complete profile

    if (error) {
      logStep("Error updating profile", error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error("No profile data returned after update");
    }

    logStep("Successfully updated profile", { id: data[0].id });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Profile updated successfully", 
      profile: data[0] 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("Error in update-profile function", { message: error.message });
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
