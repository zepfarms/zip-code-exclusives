
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
        
        console.log("Checking admin access for:", session.user.email);
        
        // Special case for zepfarms@gmail.com - grant admin access
        if (session.user.email === 'zepfarms@gmail.com') {
          console.log("Admin access granted for zepfarms@gmail.com");
          setIsAdmin(true);
          setIsLoading(false);
          return;
        }

        // Regular check for other users
        const { data: userProfile, error } = await supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Error checking admin status:", error);
          toast.error("An error occurred checking your permissions");
          navigate('/dashboard');
          return;
        }

        if (!userProfile?.is_admin) {
          toast.error("You don't have permission to access the admin panel");
          navigate('/dashboard');
          return;
        }

        setIsAdmin(true);
        setIsLoading(false);
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
