import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

/**
 * Safely creates a user profile if it doesn't exist, or returns the existing profile
 */
export const ensureUserProfile = async (userId: string) => {
  try {
    console.log("Ensuring user profile for:", userId);
    
    // Call the Edge Function to ensure the profile exists
    const response = await fetch(
      `https://ietvubimwsfugzkiycus.supabase.co/functions/v1/ensure-profile`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ userId })
      }
    );
    
    const result = await response.json();
    
    if (!result.success) {
      console.error('Error in ensure-profile function:', result.error);
      throw new Error(result.error || 'Failed to ensure profile');
    }
    
    return result.profile;
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
    await ensureUserProfile(userId);
    
    // Important: Keep the existing user_type to avoid violating the check constraint
    // This removes the user_type from the update data entirely
    const updatedData = { ...profileData };
    delete updatedData.user_type;
    
    console.log('Updating profile with data:', updatedData);

    // Always try the edge function approach first as it's more reliable (bypasses RLS issues)
    console.log('Using edge function for profile update');
    
    const session = await supabase.auth.getSession();
    const response = await fetch(
      `https://ietvubimwsfugzkiycus.supabase.co/functions/v1/update-profile`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session?.access_token}`
        },
        body: JSON.stringify({
          userId,
          profileData: updatedData
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Edge function error: ${errorText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update profile');
    }
    
    console.log('Profile updated successfully via edge function:', result.profile);
    toast.success('Profile updated successfully!');
    
    // Return the updated profile data
    return result.profile;
  } catch (error) {
    console.error('Failed to update profile:', error);
    toast.error('Failed to update profile. Please try again.');
    throw error;
  }
};
