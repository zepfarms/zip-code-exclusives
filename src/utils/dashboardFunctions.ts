
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { ensureUserProfile } from './userProfile';

export const fetchUserData = async (userId: string, setUserProfile: any, setTerritories: any, setLeads: any, setContacts: any, setSubscriptionInfo: any, setIsLoading: any) => {
  setIsLoading(true);
  
  try {
    // Try to get territories first as these might be available
    // even if the profile has issues
    try {
      console.log("Fetching territories for user:", userId);
      
      const { data: territoriesData, error: territoriesError } = await supabase
        .from('territories')
        .select('*')
        .eq('user_id', userId)
        .eq('active', true);
      
      if (territoriesError) {
        console.error("Error fetching territories:", territoriesError);
        toast.error("Could not load your territories. Please try refreshing.");
      } else {
        console.log("Territories fetched successfully:", territoriesData);
        setTerritories(territoriesData || []);
        
        // Calculate subscription info if territories were loaded successfully
        if (territoriesData && territoriesData.length > 0) {
          try {
            // Find earliest next billing date
            const nextBillingDates = territoriesData
              .map(t => t.next_billing_date)
              .filter(date => date) // Filter out null dates
              .sort();
              
            if (nextBillingDates.length > 0) {
              const nextRenewal = new Date(nextBillingDates[0]);
              const today = new Date();
              const daysRemaining = Math.ceil((nextRenewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              
              setSubscriptionInfo({
                totalMonthly: territoriesData.length * 99.99, // Assuming $99.99 per territory
                nextRenewal: nextRenewal,
                daysRemaining: daysRemaining
              });
            }
          } catch (subscriptionError) {
            console.error("Error calculating subscription info:", subscriptionError);
          }
        }
      }
    } catch (err) {
      console.error("Error in territories fetch:", err);
    }

    // Get or create user profile using our utility function
    try {
      const profile = await ensureUserProfile(userId);
      if (profile) {
        setUserProfile(profile);
        
        // Initialize contact information
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            // Get secondary emails and phones with type safety
            const secondaryEmails = Array.isArray(profile.secondary_emails) ? profile.secondary_emails : [];
            const primaryEmail = session?.user?.email || '';
            
            // Initialize secondary phones array to an empty array by default
            const secondaryPhones = Array.isArray(profile.secondary_phones) ? profile.secondary_phones : [];
            const primaryPhone = typeof profile.phone === 'string' ? profile.phone : '';
            
            // Set contacts with primary and secondary emails
            setContacts({
              emails: [primaryEmail, ...secondaryEmails].filter(Boolean),
              phones: [primaryPhone, ...secondaryPhones].filter(Boolean)
            });
          }
        } catch (contactError) {
          console.error("Error setting up contacts:", contactError);
        }
      }
    } catch (profileError) {
      console.error("Error with user profile:", profileError);
      toast.error("Could not load your profile data. Some features may be limited.");
    }

    // Try to get leads
    try {
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .eq('archived', false)
        .order('created_at', { ascending: false });
      
      if (leadsError) {
        console.error("Error fetching leads:", leadsError);
        toast.error("Could not load your leads. Please try refreshing.");
      } else {
        setLeads(leadsData || []);
      }
    } catch (leadsError) {
      console.error("Error in leads fetch:", leadsError);
    }

  } catch (error) {
    console.error('Error fetching user data:', error);
    toast.error('Failed to load user data. Please try refreshing.');
  } finally {
    setIsLoading(false);
  }
};
