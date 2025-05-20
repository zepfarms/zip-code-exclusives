
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

/**
 * Safely creates a user profile if it doesn't exist, or returns the existing profile
 */
export const ensureUserProfile = async (userId: string) => {
  try {
    console.log("Ensuring user profile for:", userId);
    
    // Try to get the profile directly first
    try {
      const { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (!fetchError && profile) {
        console.log("Found existing profile");
        return profile;
      }
      
      // If we got a 500 error or no profile was found, we'll try to create one
      console.log("No profile found or error occurred, will try to create one");
    } catch (fetchErr) {
      console.error("Error fetching profile:", fetchErr);
      // Continue to create a profile
    }

    // Try to create a profile
    try {
      console.log('Creating new user profile for:', userId);
      
      // Get user details from auth
      const { data: { user } } = await supabase.auth.getUser();
      const userMeta = user?.user_metadata || {};
      
      // Create minimal profile
      const { data: profile, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          first_name: userMeta.first_name || '',
          last_name: userMeta.last_name || '',
          user_type: userMeta.user_type || 'investor',
          notification_email: true,
          notification_sms: false,
          secondary_emails: [],
          secondary_phones: [],
          phone: ''
        })
        .select()
        .single();
        
      if (insertError) {
        // If we can't create a profile, we'll return a minimal placeholder
        console.error('Failed to create profile:', insertError);
        throw insertError;
      }
      
      return profile;
    } catch (createErr) {
      console.error("Error creating profile:", createErr);
      throw createErr;
    }
  } catch (error) {
    console.error('Profile operation failed:', error);
    // Return a minimal valid profile to prevent UI breakage
    return {
      id: userId,
      notification_email: true,
      notification_sms: false,
      user_type: 'investor',
      secondary_emails: [],
      secondary_phones: [],
      phone: '',
      first_name: '',
      last_name: '',
      company: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
};

/**
 * Safely updates a user profile, creating it first if needed
 */
export const updateUserProfile = async (userId: string, profileData: any) => {
  try {
    // Ensure the profile exists first
    await ensureUserProfile(userId);
    
    // Update the profile
    const { data, error } = await supabase
      .from('user_profiles')
      .update(profileData)
      .eq('id', userId)
      .select();
      
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to update profile:', error);
    throw error;
  }
};
