
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Helper for logging steps in the function execution
const logStep = (step: string, details?: any) => {
  console.log(`[ENSURE-PROFILE] ${step}${details ? `: ${JSON.stringify(details)}` : ''}`);
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error("userId is required");
    }

    logStep("Processing request for user", userId);

    // Initialize Supabase client with service role key to bypass RLS
    // Use fixed URLs - don't use variables for better security
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      }
    });

    // Get user data
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (userError) {
      logStep("Error getting user data", userError);
      throw new Error(`Failed to get user data: ${userError.message}`);
    }
    
    if (!userData?.user) {
      logStep("User not found");
      throw new Error("User not found");
    }

    const user = userData.user;
    const userMeta = user.user_metadata || {};
    
    logStep("Got user data", { email: user.email });

    // Check if profile exists
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*') // Select all fields to ensure we get the complete profile
      .eq('id', userId)
      .maybeSingle();

    if (profileError && profileError.code !== 'PGRST116') {
      logStep("Error checking existing profile", profileError);
      throw new Error(`Failed to check profile: ${profileError.message}`);
    }

    if (profile) {
      logStep("Found existing profile", { 
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        user_type: profile.user_type,
        phone: profile.phone || '',
        notification_phone: profile.notification_phone || ''
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Profile already exists", 
        profile 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Create new profile with userData metadata
    const newProfile = {
      id: userId,
      first_name: userMeta.first_name || '',
      last_name: userMeta.last_name || '',
      user_type: 'investor', // Using 'investor' as it appears to be allowed
      notification_email: true,
      notification_sms: false,
      notification_phone: null,
      secondary_emails: [],
      secondary_phones: [],
      phone: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    logStep("Creating new profile", newProfile);

    const { data: createdProfile, error: createError } = await supabaseAdmin
      .from('user_profiles')
      .upsert(newProfile)
      .select()
      .single();

    if (createError) {
      logStep("Error creating profile", createError);
      throw new Error(`Failed to create profile: ${createError.message}`);
    }

    logStep("Successfully created profile", { 
      id: createdProfile.id, 
      phone: createdProfile.phone || '(no phone)',
      notification_phone: createdProfile.notification_phone || '(no notification phone)'
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Profile created successfully", 
      profile: createdProfile 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("Error in ensure-profile function", { message: error.message });
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
