
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
      
      try {
        // First try the normal signOut
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          console.warn('Standard logout failed:', error);
          // Fall back to signOut with scope: 'global'
          const { error: globalError } = await supabase.auth.signOut({ scope: 'global' });
          
          if (globalError) {
            console.error('Global logout failed:', globalError);
            throw globalError;
          }
        }
        
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success("Logged out successfully");
        
        // Clear any cached data that might be in localStorage
        localStorage.removeItem('leadxclusive-territory-data');
        localStorage.removeItem('leadxclusive-leads-data');
        localStorage.removeItem('leadxclusive-auth-token');
        
        // Force full page reload to clear any cached authentication state
        window.location.href = '/login';
      } catch (error) {
        console.error('Logout error:', error);
        
        toast.dismiss(loadingToast);
        toast.success("Logged out");
        
        // Fallback handling - just redirect to login page
        window.location.href = '/login';
      }
    } catch (outerError) {
      console.error('Outer logout error:', outerError);
      // Absolute fallback
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
