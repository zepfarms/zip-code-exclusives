
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is signed in
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };

    getUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
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
        </nav>
        
        {/* CTA buttons - Desktop has full buttons, Mobile has only login */}
        <div className="flex items-center gap-2">
          {user ? (
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
