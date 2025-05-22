
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
    
    // Test territories access
    const { data: territories, error: territoriesError } = await supabase
      .from('territories')
      .select('count')
      .eq('active', true);
      
    if (territoriesError) {
      console.error('⚠️ Territories access error:', territoriesError);
    } else {
      console.log(`✅ Territories access successful: ${territories.length} territories found`);
    }
    
    // Test leads access
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('count')
      .eq('archived', false);
      
    if (leadsError) {
      console.error('⚠️ Leads access error:', leadsError);
    } else {
      console.log(`✅ Leads access successful: ${leads.length} leads found`);
    }
    
    // Check if user is admin
    const { data: isAdmin, error: adminError } = await supabase
      .rpc('is_admin', { user_id: session.user.id });
      
    if (adminError) {
      console.error('⚠️ Admin check error:', adminError);
    } else {
      console.log(`✅ Admin check successful: User is ${isAdmin ? '' : 'not '}an admin`);
    }
    
    console.groupEnd();
    return { success: true };
  } catch (error) {
    console.error('Error running RLS debug:', error);
    console.groupEnd();
    return { error: 'Debug execution error', details: error };
  }
};
