
import { supabase } from '@/integrations/supabase/client';

/**
 * Utility for debugging Row Level Security issues
 */
export const debugRlsAccess = async () => {
  console.group('💡 Debugging RLS Access');
  
  try {
    // Check authentication status
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Auth session error:', sessionError);
      console.groupEnd();
      return { error: 'Authentication error', details: sessionError };
    }
    
    if (!session) {
      console.log('⚠️ No active session found - user is not authenticated');
      console.groupEnd();
      return { error: 'No active session' };
    }
    
    console.log('✅ Active session found:', {
      userId: session.user.id,
      email: session.user.email,
    });
    
    // Test access to profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();
      
    if (profileError) {
      console.error('⚠️ Profile access error:', profileError);
    } else {
      console.log('✅ Profile access successful:', profile);
    }
    
    // Test territories access directly - this avoids any filtering
    try {
      const { count: territoriesCount, error: countError } = await supabase
        .from('territories')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);
        
      if (countError) {
        console.error('⚠️ Territories count error:', countError);
      } else {
        console.log(`✅ Territories access appears successful: found approximately ${territoriesCount} territories`);
        
        // Now try to actually fetch some territories
        const { data: terrData, error: terrError } = await supabase
          .from('territories')
          .select('*')
          .eq('user_id', session.user.id)
          .limit(5);
          
        if (terrError) {
          console.error('⚠️ Territories fetch error:', terrError);
        } else {
          console.log(`✅ Successfully fetched ${terrData?.length || 0} territories`);
        }
      }
    } catch (err) {
      console.error('⚠️ Error testing territories:', err);
    }
    
    // Test leads access
    try {
      const { count: leadsCount, error: countError } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);
        
      if (countError) {
        console.error('⚠️ Leads count error:', countError);
        
        // If lead count fails, try a different approach
        try {
          // Attempt with the edge function
          const { data: edgeFunctionData, error: edgeFunctionError } = await supabase.functions.invoke('get-user-leads', {
            body: { userId: session.user.id }
          });
          
          if (edgeFunctionError) {
            console.error('⚠️ Edge function leads access error:', edgeFunctionError);
          } else {
            console.log(`✅ Edge function leads access successful: found ${edgeFunctionData?.leads?.length || 0} leads`);
          }
        } catch (edgeErr) {
          console.error('⚠️ Error testing edge function leads:', edgeErr);
        }
      } else {
        console.log(`✅ Leads access appears successful: found approximately ${leadsCount} leads`);
        
        // Now try to actually fetch some leads
        const { data: leadsData, error: leadsError } = await supabase
          .from('leads')
          .select('*')
          .eq('user_id', session.user.id)
          .limit(5);
          
        if (leadsError) {
          console.error('⚠️ Leads fetch error:', leadsError);
        } else {
          console.log(`✅ Successfully fetched ${leadsData?.length || 0} leads`);
        }
      }
    } catch (err) {
      console.error('⚠️ Error testing leads:', err);
    }
    
    // Test admin status
    try {
      const { data: isAdmin, error: adminError } = await supabase
        .rpc('is_admin', { user_id: session.user.id });
        
      if (adminError) {
        console.error('⚠️ Admin check error:', adminError);
        
        // Try edge function instead
        try {
          const { data: adminCheck, error: adminCheckError } = await supabase.functions.invoke('check-admin-status', {
            body: { userId: session.user.id }
          });
          
          if (adminCheckError) {
            console.error('⚠️ Edge function admin check error:', adminCheckError);
          } else {
            console.log(`✅ Edge function admin check successful: User is ${adminCheck?.isAdmin ? '' : 'not '}an admin`);
          }
        } catch (edgeErr) {
          console.error('⚠️ Error testing edge function admin check:', edgeErr);
        }
      } else {
        console.log(`✅ Admin check successful: User is ${isAdmin ? '' : 'not '}an admin`);
      }
      
      // Direct query to user_profiles as a last resort
      const { data: profileData, error: profileQueryError } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .maybeSingle();
        
      if (profileQueryError) {
        console.error('⚠️ Profile admin query error:', profileQueryError);
      } else if (profileData) {
        console.log(`✅ Profile admin query successful: User is ${profileData.is_admin ? '' : 'not '}an admin according to profile`);
      }
    } catch (err) {
      console.error('⚠️ Error checking admin status:', err);
    }
    
    console.groupEnd();
    return { success: true };
  } catch (error) {
    console.error('Error running RLS debug:', error);
    console.groupEnd();
    return { error: 'Debug execution error', details: error };
  }
};
