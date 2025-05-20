
import { supabase } from '@/integrations/supabase/client';

/**
 * Safely creates a user profile if it doesn't exist, or returns the existing profile
 */
export const ensureUserProfile = async (userId: string) => {
  try {
    // First check if profile exists using count with no RLS filters
    // Use a direct count query instead of a fetch that might trigger RLS issues
    const { count, error: countError } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('id', userId);
      
    if (countError) {
      console.error('Error checking profile:', countError);
      throw countError;
    }

    // Create profile if it doesn't exist
    if (count === 0 || count === null) {
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
          notification_sms: false
        })
        .select()
        .single();
        
      if (insertError) {
        console.error('Failed to create profile:', insertError);
        throw insertError;
      }
      
      return profile;
    } else {
      // Get the existing profile if it exists
      // Using a raw query with service role would be better here,
      // but for now we'll use a direct query with error handling
      const { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        throw fetchError;
      }
      
      return profile;
    }
  } catch (error) {
    console.error('Profile operation failed:', error);
    // Return a minimal valid profile to prevent UI breakage
    return {
      id: userId,
      notification_email: true,
      notification_sms: false,
      user_type: 'investor'
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
