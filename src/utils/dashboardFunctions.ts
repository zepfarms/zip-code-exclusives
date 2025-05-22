
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { ensureUserProfile } from './userProfile';

export const fetchUserData = async (userId: string, setUserProfile: any, setTerritories: any, setLeads: any, setContacts: any, setSubscriptionInfo: any, setIsLoading: any) => {
  setIsLoading(true);
  console.log("Starting to fetch user data for:", userId);
  
  try {
    // Ensure user profile exists
    let profile = null;
    try {
      console.log("Fetching user profile for:", userId);
      
      // First try using the edge function (bypasses RLS issues)
      try {
        const { data: profileData, error: profileFunctionError } = await supabase.functions.invoke('ensure-profile', {
          body: { userId }
        });
        
        if (!profileFunctionError && profileData?.profile) {
          profile = profileData.profile;
          console.log("Got profile from edge function:", profile);
        } else {
          console.log("Edge function failed, falling back to client-side profile fetching");
          profile = await ensureUserProfile(userId);
        }
      } catch (edgeFunctionError) {
        console.error("Edge function error:", edgeFunctionError);
        // Fall back to client-side profile fetching
        profile = await ensureUserProfile(userId);
      }
      
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

    // Try to get territories - explicitly filter by user_id to avoid RLS issues
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
      
      // Explicitly filter by user_id to ensure we get the right data
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
        try {
          // Find earliest next billing date
          const nextBillingDates = territories
            ?.map(t => t.next_billing_date)
            .filter(Boolean) // Filter out null dates
            .sort();
            
          if (nextBillingDates && nextBillingDates.length > 0) {
            const nextRenewal = new Date(nextBillingDates[0]);
            const today = new Date();
            const daysRemaining = Math.ceil((nextRenewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            setSubscriptionInfo({
              totalMonthly: territories.length * 0, // $0.00 per territory for testing
              nextRenewal: nextRenewal,
              daysRemaining: daysRemaining
            });
          }
        } catch (subscriptionError) {
          console.error("Error calculating subscription info:", subscriptionError);
        }
      }
    } catch (err) {
      console.error("Error in territories fetch:", err);
      setTerritories([]);
    }

    // Try to get leads - use our improved debug helper and add better error handling
    try {
      console.log("Fetching leads for user:", userId);
      
      // First try with the RPC function which should bypass RLS issues
      try {
        const { data: rlsDebugInfo } = await supabase.rpc('debug_utils', {
          p_action: 'get_user_leads',
          p_user_id: userId
        });
        
        if (rlsDebugInfo?.leads && Array.isArray(rlsDebugInfo.leads)) {
          console.log("Leads fetched via RPC:", rlsDebugInfo.leads.length);
          setLeads(rlsDebugInfo.leads);
          return; // Exit early if this method works
        }
      } catch (rpcError) {
        console.log("RPC method unavailable, falling back to standard query:", rpcError);
      }
      
      // Standard approach - explicitly filter by user_id to ensure we get the right data
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .eq('archived', false)
        .order('created_at', { ascending: false });
      
      if (leadsError) {
        console.error("Error fetching leads:", leadsError);
        
        // Try edge function as last resort
        try {
          const { data: edgeFunctionLeads, error: edgeFunctionError } = await supabase.functions.invoke('get-user-leads', {
            body: { userId }
          });
          
          if (!edgeFunctionError && edgeFunctionLeads?.leads) {
            console.log("Leads fetched via edge function:", edgeFunctionLeads.leads.length);
            setLeads(edgeFunctionLeads.leads);
          } else {
            toast.error("Could not load your leads. Please try refreshing.");
            setLeads([]);
          }
        } catch (edgeError) {
          console.error("Edge function error:", edgeError);
          toast.error("Could not load your leads. Please try refreshing.");
          setLeads([]);
        }
      } else {
        console.log("Leads fetched:", leads?.length || 0);
        setLeads(leads || []);
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
