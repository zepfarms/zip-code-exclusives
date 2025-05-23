
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { ensureUserProfile } from './userProfile';

/**
 * Fetches all user data for dashboard display
 */
export const fetchUserData = async (
  userId: string,
  setUserProfile: React.Dispatch<React.SetStateAction<any>>,
  setTerritories: React.Dispatch<React.SetStateAction<any[]>>,
  setLeads: React.Dispatch<React.SetStateAction<any[]>>,
  setContacts: React.Dispatch<React.SetStateAction<{ emails: string[], phones: string[] }>>,
  setSubscriptionInfo: React.Dispatch<React.SetStateAction<{ totalMonthly: number, nextRenewal: string | null, daysRemaining: number }>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    console.log("Starting to fetch user data for:", userId);
    setIsLoading(true);
    
    // Step 1: Get user profile (using the edge function for reliability)
    console.log("Fetching user profile for:", userId);
    const userProfile = await fetchUserProfile(userId);
    setUserProfile(userProfile);
    
    // Step 2: Set contact information
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      // Handle emails: primary email from auth session, secondary from profile
      const primaryEmail = session.user.email || '';
      const secondaryEmails = userProfile?.secondary_emails || [];
      
      // Handle phones: primary from profile, secondary from profile
      const primaryPhone = userProfile?.phone || '';
      const notificationPhone = userProfile?.notification_phone || '';
      const secondaryPhones = userProfile?.secondary_phones || [];
      
      console.log("Setting contacts with primary email:", primaryEmail);
      console.log("Secondary emails:", secondaryEmails);
      console.log("Primary phone:", primaryPhone);
      console.log("Notification phone:", notificationPhone);
      console.log("Secondary phones:", secondaryPhones);
      console.log("Notification SMS enabled:", userProfile?.notification_sms);
      
      setContacts({
        emails: [primaryEmail, ...secondaryEmails],
        phones: [primaryPhone, notificationPhone, ...secondaryPhones].filter(Boolean) // Filter out empty strings
      });
    }
    
    // Try to get territories - use the edge function first
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
      
      // Try edge function approach first to bypass RLS issues
      try {
        const { data: edgeFunctionTerritories, error: edgeFunctionError } = await supabase.functions.invoke('get-user-territories', {
          body: { userId }
        });
        
        if (!edgeFunctionError && edgeFunctionTerritories?.territories && Array.isArray(edgeFunctionTerritories.territories)) {
          console.log("Territories fetched via edge function:", edgeFunctionTerritories.territories.length);
          setTerritories(edgeFunctionTerritories.territories);
          
          // Calculate subscription info
          calculateSubscriptionInfo(edgeFunctionTerritories.territories, setSubscriptionInfo);
        } else {
          console.log("Edge function approach failed for territories, falling back to standard query");
          
          // Fall back to direct query
          const { data: territories, error: territoriesError } = await supabase
            .from('territories')
            .select('*')
            .eq('user_id', userId)
            .eq('active', true);
          
          if (territoriesError) {
            console.error("Error fetching territories:", territoriesError);
            toast.error("Could not load your territories. Please try refreshing.");
            
            // Use sessionStorage as fallback if available
            if (justCreatedTerritory) {
              const fallbackTerritory = {
                id: 'pending-' + Date.now(),
                user_id: userId,
                zip_code: justCreatedTerritory.zip_code,
                lead_type: justCreatedTerritory.lead_type || 'investor',
                active: true,
                start_date: justCreatedTerritory.timestamp,
                next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                created_at: justCreatedTerritory.timestamp
              };
              
              setTerritories([fallbackTerritory]);
              toast.info("Using cached territory data. The dashboard will update with your full territory information shortly.");
            } else {
              setTerritories([]);
            }
          } else {
            console.log("Territories fetched:", territories?.length || 0);
            setTerritories(territories || []);
            
            // Clear sessionStorage after successful fetch
            if (justCreatedTerritory) {
              sessionStorage.removeItem('justCreatedTerritory');
            }
            
            // Calculate subscription info
            calculateSubscriptionInfo(territories || [], setSubscriptionInfo);
          }
        }
      } catch (err) {
        console.error("Error in territories fetch:", err);
        setTerritories([]);
      }
    } catch (err) {
      console.error("Error in territories fetch:", err);
      setTerritories([]);
    }
    
    // IMPROVED: Try to get leads with more logging and error handling
    try {
      console.log("Fetching leads for user:", userId);
      
      // Try edge function as first approach with detailed request and error logging
      try {
        console.log(`Invoking get-user-leads edge function with userId: ${userId}`);
        const { data: edgeFunctionLeads, error: edgeFunctionError } = await supabase.functions.invoke('get-user-leads', {
          body: { userId }
        });
        
        if (edgeFunctionError) {
          console.error("Edge function error for leads:", edgeFunctionError);
          throw edgeFunctionError;
        }
        
        if (edgeFunctionLeads?.leads) {
          console.log("Leads fetched via edge function:", edgeFunctionLeads.leads.length);
          console.log("Sample lead data (first item):", edgeFunctionLeads.leads.length > 0 ? edgeFunctionLeads.leads[0] : "No leads found");
          setLeads(edgeFunctionLeads.leads);
          return; // Exit early if this method works
        } else {
          console.log("Edge function returned no leads data, falling back to direct query");
        }
      } catch (edgeError) {
        console.error("Edge function error for leads:", edgeError);
        console.log("Falling back to direct query for leads");
      }
      
      // Standard approach with improved error handling and logging
      console.log(`Making direct query for leads with user_id: ${userId}`);
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .eq('archived', false)
        .order('created_at', { ascending: false });
      
      if (leadsError) {
        console.error("Error fetching leads:", leadsError);
        toast.error("Could not load your leads. Please try refreshing.");
        setLeads([]);
      } else {
        console.log("Leads fetched directly:", leads?.length || 0);
        if (leads && leads.length > 0) {
          console.log("Sample lead from direct query:", leads[0]);
        } else {
          console.log("No leads found for user");
        }
        setLeads(leads || []);
      }
    } catch (leadsError) {
      console.error("Error in leads fetch:", leadsError);
      setLeads([]);
      toast.error("An error occurred while loading leads. Please try again.");
    }
    
  } catch (error) {
    console.error("Error fetching user data:", error);
    setIsLoading(false);
    toast.error("Failed to load dashboard data. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

// Helper function to calculate subscription information based on territories
const calculateSubscriptionInfo = (territories: any[], setSubscriptionInfo: any) => {
  try {
    // Find earliest next billing date
    const nextBillingDates = territories
      .map(t => t.next_billing_date)
      .filter(Boolean) // Filter out null dates
      .sort();
      
    if (nextBillingDates && nextBillingDates.length > 0) {
      const nextRenewal = new Date(nextBillingDates[0]);
      const today = new Date();
      const daysRemaining = Math.ceil((nextRenewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      setSubscriptionInfo({
        totalMonthly: territories.length * 199, // $199.00 per territory
        nextRenewal: nextRenewal,
        daysRemaining: daysRemaining
      });
    }
  } catch (subscriptionError) {
    console.error("Error calculating subscription info:", subscriptionError);
  }
};

// Helper function to fetch user profile using the edge function
const fetchUserProfile = async (userId: string) => {
  try {
    console.log("Using edge function to get profile");
    const { data: profileData, error: profileFunctionError } = await supabase.functions.invoke('ensure-profile', {
      body: { userId }
    });
    
    if (!profileFunctionError && profileData?.profile) {
      return profileData.profile;
    } else {
      console.log("Edge function failed, falling back to client-side profile fetching");
      return await ensureUserProfile(userId);
    }
  } catch (edgeFunctionError) {
    console.error("Edge function error:", edgeFunctionError);
    // Fall back to client-side profile fetching
    return await ensureUserProfile(userId);
  }
};
