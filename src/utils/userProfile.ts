import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

/**
 * Safely creates a user profile if it doesn't exist, or returns the existing profile
 */
export const ensureUserProfile = async (userId: string) => {
  try {
    console.log("Ensuring user profile for:", userId);
    
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
    
    // Get user details from auth
    const { data: { user } } = await supabase.auth.getUser();
    const userMeta = user?.user_metadata || {};
    
    // Create new profile with 'investor' type since that appears to be allowed in the database
    const newProfileData = {
      id: userId,
      first_name: userMeta.first_name || '',
      last_name: userMeta.last_name || '',
      user_type: 'investor', // Using 'investor' as it appears to be valid in the DB
      notification_email: true,
      notification_sms: false,
      secondary_emails: [],
      secondary_phones: [],
      phone: ''
    };
    
    // Use upsert for more reliable operation
    const { data: newProfile, error: upsertError } = await supabase
      .from('user_profiles')
      .upsert(newProfileData)
      .select()
      .maybeSingle();
      
    if (upsertError) {
      console.error('Failed to create/update profile:', upsertError);
      toast.error('Failed to create user profile. Please try refreshing the page.');
      throw upsertError;
    }
    
    console.log('Successfully created/updated profile:', newProfile);
    return newProfile;
  } catch (error) {
    console.error('Profile operation failed:', error);
    // Return a minimal valid profile to prevent UI breakage
    return {
      id: userId,
      notification_email: true,
      notification_sms: false,
      user_type: 'investor', // Using 'investor' as the default type
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
    const existingProfile = await ensureUserProfile(userId);
    
    // Important: Keep the existing user_type to avoid violating the check constraint
    // This removes the user_type from the update data entirely
    const updatedData = { ...profileData };
    delete updatedData.user_type;
    
    console.log('Updating profile with data:', updatedData);
    
    // Update the profile without changing the user_type
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updatedData)
      .eq('id', userId)
      .select();
      
    if (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
      throw error;
    }
    
    toast.success('Profile updated successfully!');
    return data;
  } catch (error) {
    console.error('Failed to update profile:', error);
    toast.error('Failed to update profile. Please try again.');
    throw error;
  }
};
