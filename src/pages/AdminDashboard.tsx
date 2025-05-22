
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
        
        // First try using the is_admin RLS function via a select query
        const { data, error } = await supabase
          .rpc('is_admin', { user_id: session.user.id });
          
        if (error) {
          console.error("Error checking admin status via RPC:", error);
          
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
            console.log("Admin access granted");
            setIsAdmin(true);
            setIsLoading(false);
            return;
          }
        } else {
          // RPC call was successful
          if (data === true || session.user.email === 'zepfarms@gmail.com') {
            console.log("Admin access granted via is_admin function");
            setIsAdmin(true);
            setIsLoading(false);
            return;
          }
        }

        // Everyone else is denied access
        toast.error("You don't have permission to access the admin panel");
        navigate('/dashboard');
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast.error("An error occurred. Please try again.");
        navigate('/dashboard');
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
