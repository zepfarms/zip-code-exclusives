
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminHeader = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      const loadingToast = toast.loading("Logging out...");
      
      // Use global scope to clear all session data
      const { error } = await supabase.auth.signOut({
        scope: 'global'
      });
      
      toast.dismiss(loadingToast);
      
      if (error) {
        console.error('Logout error:', error);
        toast.error(`Failed to log out: ${error.message}`);
        return;
      }
      
      toast.success("Logged out successfully");
      
      // Clear any cached data that might be in localStorage
      localStorage.removeItem('leadxclusive-territory-data');
      localStorage.removeItem('leadxclusive-leads-data');
      
      // Force full page reload to clear any cached authentication state
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      
      // Fallback handling - just redirect to login page
      window.location.href = '/login';
    }
  };
  
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          LeadXclusive Admin
        </h1>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Exit Admin
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
