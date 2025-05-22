
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Loader } from 'lucide-react';
import AdminDashboardMain from './AdminDashboard/index';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Please sign in to continue");
          navigate('/login', { state: { redirectTo: '/admin' } });
          return;
        }
        
        console.log("Checking admin status for user:", session.user.id);
        
        // Use the service role function first (more reliable if available)
        try {
          const { data: adminCheck, error: adminCheckError } = await supabase.functions.invoke('check-admin-status', {
            body: { userId: session.user.id }
          });
          
          if (!adminCheckError && adminCheck?.isAdmin === true) {
            console.log("Admin access granted via edge function");
            setIsAdmin(true);
            setIsLoading(false);
            return;
          } else if (adminCheckError) {
            console.error("Edge function error:", adminCheckError);
          }
        } catch (err) {
          console.error("Error calling admin check edge function:", err);
        }
        
        // Fall back to direct RPC check
        const { data: isAdminResult, error: rpcError } = await supabase
          .rpc('is_admin', { user_id: session.user.id });
          
        if (rpcError) {
          console.error("Error checking admin status via RPC:", rpcError);
          
          // Fall back to checking the profile directly
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profileError) {
            console.error("Error fetching profile:", profileError);
            toast.error("Could not verify admin status");
            navigate('/dashboard');
            return;
          }
          
          if (profile?.is_admin || session.user.email === 'zepfarms@gmail.com') {
            console.log("Admin access granted via profile check");
            setIsAdmin(true);
            setIsLoading(false);
            return;
          }
        } else {
          // RPC call was successful
          if (isAdminResult === true || session.user.email === 'zepfarms@gmail.com') {
            console.log("Admin access granted via is_admin function");
            setIsAdmin(true);
            setIsLoading(false);
            return;
          }
        }

        // Always grant access for zepfarms@gmail.com as a final failsafe
        if (session.user.email === 'zepfarms@gmail.com') {
          console.log("Admin access granted for special admin user");
          setIsAdmin(true);
          setIsLoading(false);
          return;
        }

        // Everyone else is denied access
        toast.error("You don't have permission to access the admin panel");
        navigate('/dashboard');
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast.error("An error occurred. Please try again.");
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-brand-600" />
        <span className="ml-2">Loading admin panel...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // This will not be rendered as the navigate will redirect
  }

  return <AdminDashboardMain />;
};

export default AdminDashboard;
