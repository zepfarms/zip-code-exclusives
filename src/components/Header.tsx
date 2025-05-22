
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is signed in
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Authentication error:', error);
          throw error;
        }
        
        setUser(data.session?.user || null);
        
        // Check if user is admin (only zepfarms@gmail.com)
        if (data.session?.user?.email === 'zepfarms@gmail.com') {
          console.log("Admin status granted in header for zepfarms@gmail.com");
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();

    // Listen for auth changes with cleaner subscription handling
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      
      // Check admin status when auth state changes
      if (session?.user?.email === 'zepfarms@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error(`Failed to log out: ${error.message}`);
        return;
      }
      
      // Only show success message and navigate if no error
      toast.success("Logged out successfully");
      setUser(null);
      setIsAdmin(false);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-brand-700">LeadXclusive</span>
        </Link>
        
        {/* Navigation - Desktop only */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="text-gray-600 hover:text-brand-700 transition-colors">
            Home
          </Link>
          <Link to="/how-it-works" className="text-gray-600 hover:text-brand-700 transition-colors">
            How It Works
          </Link>
          <Link to="/pricing" className="text-gray-600 hover:text-brand-700 transition-colors">
            Pricing
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-brand-700 transition-colors">
            About Us
          </Link>
          {user && (
            <Link to="/dashboard" className="text-gray-600 hover:text-brand-700 transition-colors">
              Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-gray-600 hover:text-brand-700 transition-colors font-semibold">
              Admin
            </Link>
          )}
        </nav>
        
        {/* Mobile only shows login button */}
        <div className="flex items-center gap-2">
          {!isLoading && (
            user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="hidden md:flex text-gray-700 hover:text-brand-700"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
                {isAdmin && (
                  <Link to="/admin" className="md:hidden">
                    <Button variant="ghost" size="sm" className="text-gray-700 hover:text-brand-700">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Link to="/dashboard" className="md:hidden">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-brand-700">
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-brand-700">
                  Log In
                </Button>
              </Link>
            )
          )}
          <Link to="/check-availability" className="hidden md:block">
            <Button 
              className="bg-accent-600 hover:bg-accent-700"
              size="sm"
            >
              Check Availability
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
