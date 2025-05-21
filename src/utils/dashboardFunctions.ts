
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { ensureUserProfile } from './userProfile';

export const fetchUserData = async (userId: string, setUserProfile: any, setTerritories: any, setLeads: any, setContacts: any, setSubscriptionInfo: any, setIsLoading: any) => {
  setIsLoading(true);
  
  try {
    // Get or create user profile using our utility function
    let profile = null;
    try {
      console.log("Fetching user profile for:", userId);
      profile = await ensureUserProfile(userId);
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
      // Don't show error toast as we have a fallback profile
    }

    // Try to get territories
    try {
      console.log("Fetching territories for user:", userId);
      
      // Check if there's any territory data in sessionStorage (from PaymentSuccess page)
      const justCreatedTerritoryStr = sessionStorage.getItem('justCreatedTerritory');
      let justCreatedTerritory = null;
      
      if (justCreatedTerritoryStr) {
        try {
          justCreatedTerritory = JSON.parse(justCreatedTerritoryStr);
          console.log("Found recently created territory in sessionStorage:", justCreatedTerritory);
        } catch (err) {
          console.error("Error parsing territory from sessionStorage:", err);
        }
      }
      
      const { data: territoriesData, error: territoriesError } = await supabase
        .from('territories')
        .select('*')
        .eq('user_id', userId)
        .eq('active', true);
      
      if (territoriesError) {
        console.error("Error fetching territories:", territoriesError);
        // Only show error toast for actual database errors, not empty results or auth errors
        if (territoriesError.code !== 'PGRST116' && 
            territoriesError.code !== '401' && 
            territoriesError.code !== '403') {
          toast.error("Could not load your territories. Please try refreshing.");
        }
      } 
      
      // Use data from supabase or fallback to sessionStorage
      if (territoriesData && territoriesData.length > 0) {
        console.log("Territories fetched successfully:", territoriesData);
        setTerritories(territoriesData);
        
        // Clear sessionStorage after successful fetch
        if (justCreatedTerritory) {
          sessionStorage.removeItem('justCreatedTerritory');
        }
        
        // Calculate subscription info if territories were loaded successfully
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
      // If we have data in sessionStorage and failed to fetch territories, use that as a fallback
      else if (justCreatedTerritory) {
        try {
          console.log("Using territory from sessionStorage as fallback");
          
          // Create a minimal territory object as fallback
          const fallbackTerritory = {
            id: 'pending-' + Date.now(),
            user_id: userId,
            zip_code: justCreatedTerritory.zip_code,
            lead_type: 'seller',
            active: true,
            start_date: justCreatedTerritory.timestamp,
            next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: justCreatedTerritory.timestamp
          };
          
          setTerritories([fallbackTerritory]);
          toast.info("Using cached territory data. Refresh the page if details are incomplete.");
        } catch (e) {
          console.error("Error using sessionStorage territory:", e);
          setTerritories([]);
        }
      } else {
        setTerritories([]);
      }
    } catch (err) {
      console.error("Error in territories fetch:", err);
      setTerritories([]);
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
        // Only show error toast if it's not just a case of no leads found or auth errors
        if (leadsError.code !== 'PGRST116' && 
            leadsError.code !== '401' && 
            leadsError.code !== '403') {
          toast.error("Could not load your leads. Please try refreshing.");
        }
      } else {
        setLeads(leadsData || []);
      }
    } catch (leadsError) {
      console.error("Error in leads fetch:", leadsError);
      setLeads([]);
    }

  } catch (error: any) {
    console.error('Error fetching user data:', error);
  } finally {
    setIsLoading(false);
  }
};
