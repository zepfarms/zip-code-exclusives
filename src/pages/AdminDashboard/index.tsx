
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import AdminLayout from './components/AdminLayout';
import AdminHeader from './components/AdminHeader';
import UsersTable from './components/UsersTable';
import LeadsTable from './components/LeadsTable';
import TerritoriesTable from './components/TerritoriesTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader } from 'lucide-react';
import AddLeadForm from './components/AddLeadForm';

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
        
        // Only zepfarms@gmail.com is allowed to access admin
        if (session.user.email === 'zepfarms@gmail.com') {
          console.log("Admin access granted for zepfarms@gmail.com in inner component");
          setIsAdmin(true);
          setIsLoading(false);
          return;
        }

        // Everyone else is denied access
        toast.error("You don't have permission to access this page");
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

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | LeadXclusive</title>
      </Helmet>
      
      <AdminLayout>
        <AdminHeader />
        
        <div className="container mx-auto px-4 py-6">
          <Tabs defaultValue="leads">
            <TabsList className="mb-8">
              <TabsTrigger value="leads">Leads Management</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="territories">Territories</TabsTrigger>
              <TabsTrigger value="add-lead">Add New Lead</TabsTrigger>
            </TabsList>
            
            <TabsContent value="leads">
              <LeadsTable />
            </TabsContent>
            
            <TabsContent value="users">
              <UsersTable />
            </TabsContent>
            
            <TabsContent value="territories">
              <TerritoriesTable />
            </TabsContent>
            
            <TabsContent value="add-lead">
              <AddLeadForm />
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;
