
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

/**
 * Safely creates a user profile if it doesn't exist, or returns the existing profile
 */
export const ensureUserProfile = async (userId: string) => {
  try {
    console.log("Ensuring user profile for:", userId);
    
    // Get user details from auth
    const { data: { user } } = await supabase.auth.getUser();
    const userMeta = user?.user_metadata || {};
    
    // Try to get the profile directly first
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (!fetchError && profile) {
      console.log("Found existing profile");
      return profile;
    }
    
    console.log("No profile found or error occurred, will try to create one");
    
    // Create new profile with simplified approach
    const newProfileData = {
      id: userId,
      first_name: userMeta.first_name || '',
      last_name: userMeta.last_name || '',
      user_type: 'seller', // Always using 'seller' type
      notification_email: true,
      notification_sms: false,
      secondary_emails: [],
      secondary_phones: [],
      phone: ''
    };
    
    const { data: newProfile, error: insertError } = await supabase
      .from('user_profiles')
      .insert(newProfileData)
      .select()
      .single();
      
    if (insertError) {
      console.error('Failed to create profile:', insertError);
      
      // As a fallback, try to update if insert fails (in case profile exists but select failed)
      const { data: updatedProfile, error: updateError } = await supabase
        .from('user_profiles')
        .update(newProfileData)
        .eq('id', userId)
        .select()
        .single();
        
      if (updateError) {
        console.error('Failed to update profile as fallback:', updateError);
        throw updateError;
      }
      
      return updatedProfile;
    }
    
    return newProfile;
  } catch (error) {
    console.error('Profile operation failed:', error);
    // Return a minimal valid profile to prevent UI breakage
    return {
      id: userId,
      notification_email: true,
      notification_sms: false,
      user_type: 'seller',
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
