
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

    // Ensure phone numbers are stored as just digits for consistency
    if (sanitizedData.phone !== undefined) {
      // Only clean if it's not null or empty string
      if (sanitizedData.phone) {
        sanitizedData.phone = sanitizedData.phone.replace(/\D/g, '');
        logStep("Phone number cleaned for storage", sanitizedData.phone);
      }
      
      // If phone is explicitly set to empty string, convert to null
      if (sanitizedData.phone === '') {
        sanitizedData.phone = null;
        logStep("Empty phone converted to null");
      }
    }

    // Handle the notification_phone field
    if (sanitizedData.notification_phone !== undefined) {
      // Clean notification phone if it's not null or empty
      if (sanitizedData.notification_phone) {
        sanitizedData.notification_phone = sanitizedData.notification_phone.replace(/\D/g, '');
        logStep("Notification phone cleaned for storage", sanitizedData.notification_phone);
      }
      
      // Convert empty string to null
      if (sanitizedData.notification_phone === '') {
        sanitizedData.notification_phone = null;
        logStep("Empty notification_phone converted to null");
      }
    }

    logStep("Sanitized update data", sanitizedData);

    // Check if the profile exists first
    const { data: existingProfile, error: checkError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (checkError) {
      logStep("Error checking existing profile", checkError);
      throw checkError;
    }
    
    if (!existingProfile) {
      logStep("Profile doesn't exist, creating new profile");
      // Create a new profile if it doesn't exist
      const { data: insertData, error: insertError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: userId,
          ...sanitizedData
        })
        .select('*');
        
      if (insertError) {
        logStep("Error creating profile", insertError);
        throw insertError;
      }
      
      logStep("Successfully created profile", { 
        id: insertData[0].id, 
        phone: insertData[0].phone || '(no phone)',
        notification_phone: insertData[0].notification_phone || '(no notification phone)',
        notification_sms: insertData[0].notification_sms 
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Profile created successfully", 
        profile: insertData[0] 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

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
