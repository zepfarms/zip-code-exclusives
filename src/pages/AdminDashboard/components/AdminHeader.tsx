
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminHeader = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        
        // Special handling for missing session errors
        if (error.message.includes('session')) {
          // If session is missing, we'll consider user logged out anyway
          toast.success("Logged out successfully");
          navigate('/login', { replace: true });
          return;
        }
        
        toast.error(`Failed to log out: ${error.message}`);
        return;
      }
      
      toast.success("Logged out successfully");
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      
      // Fallback handling - just redirect to login page
      navigate('/login', { replace: true });
      toast.success("Logged out successfully");
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
