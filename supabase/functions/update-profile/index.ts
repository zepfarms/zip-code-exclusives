
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
      throw new Error("profileData must be an object");
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

    // Sanitize the update data to prevent unwanted updates
    const allowedFields = [
      'first_name', 
      'last_name', 
      'company', 
      'phone', 
      'notification_phone',
      'notification_email', 
      'notification_sms', 
      'secondary_emails', 
      'secondary_phones',
      'license_state',
      'license_number'
    ];
    
    const sanitizedData: any = {};
    
    for (const field of allowedFields) {
      if (field in profileData) {
        sanitizedData[field] = profileData[field];
      }
    }
    
    // Always add updated_at timestamp
    sanitizedData.updated_at = new Date().toISOString();
    
    logStep("Sanitized update data", sanitizedData);

    // Update the profile
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .update(sanitizedData)
      .eq('id', userId)
      .select();
      
    if (error) {
      logStep("Error updating profile", error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      logStep("No profile found", { userId });
      throw new Error("Profile not found for this user");
    }

    // Log success with detailed data for debugging
    logStep("Successfully updated profile", { 
      id: data[0].id, 
      phone: data[0].phone || '(no phone)',
      notification_phone: data[0].notification_phone || '(no notification phone)',
      notification_sms: data[0].notification_sms,
      fullData: data[0] // Log the full profile data to help with debugging
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Profile updated successfully", 
      profile: data[0]
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("Error updating profile", { message: error.message });
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
