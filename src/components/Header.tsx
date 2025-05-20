
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const handleCheckAvailability = () => {
    // If we're on the home page, scroll to the form
    if (location.pathname === '/') {
      const zipCheckerElement = document.getElementById('zip-checker-section');
      if (zipCheckerElement) {
        zipCheckerElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Otherwise navigate to the check-availability page
      navigate('/check-availability');
    }
    
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    closeMobileMenu();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
          <span className="text-2xl font-bold text-brand-700">LeadXclusive</span>
        </Link>
        
        {/* Desktop Navigation */}
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
        
        {/* Desktop CTA buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Button 
              variant="ghost" 
              className="text-gray-700 hover:text-brand-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="ghost" className="text-gray-700 hover:text-brand-700">
                Log In
              </Button>
            </Link>
          )}
          <Button 
            className="bg-accent-600 hover:bg-accent-700"
            onClick={handleCheckAvailability}
          >
            Check Availability
          </Button>
        </div>

        {/* Mobile menu button */}
        {isMobile && (
          <Button variant="ghost" onClick={toggleMobileMenu} className="md:hidden">
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </Button>
        )}
      </div>

      {/* Mobile menu - Fixed to ensure solid background and proper text visibility */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white shadow-lg overflow-auto">
          <div className="pt-16 pb-6 px-6">
            <div className="flex flex-col items-center justify-start space-y-6">
              <Link 
                to="/" 
                className="w-full text-center text-xl font-medium text-gray-900 p-3 bg-gray-50 rounded-md" 
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link 
                to="/how-it-works" 
                className="w-full text-center text-xl font-medium text-gray-900 p-3 bg-gray-50 rounded-md" 
                onClick={closeMobileMenu}
              >
                How It Works
              </Link>
              <Link 
                to="/pricing" 
                className="w-full text-center text-xl font-medium text-gray-900 p-3 bg-gray-50 rounded-md" 
                onClick={closeMobileMenu}
              >
                Pricing
              </Link>
              <Link 
                to="/about" 
                className="w-full text-center text-xl font-medium text-gray-900 p-3 bg-gray-50 rounded-md" 
                onClick={closeMobileMenu}
              >
                About Us
              </Link>
              {user && (
                <Link 
                  to="/dashboard" 
                  className="w-full text-center text-xl font-medium text-gray-900 p-3 bg-gray-50 rounded-md" 
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              )}
            </div>
            
            <div className="mt-8 w-full">
              {user ? (
                <Button 
                  variant="outline"
                  className="w-full mb-4 p-3 flex items-center justify-center border-2 text-gray-700"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Log Out
                </Button>
              ) : (
                <Link to="/login" onClick={closeMobileMenu} className="w-full block mb-4">
                  <Button variant="outline" className="w-full p-3 border-2 text-gray-700">
                    Log In
                  </Button>
                </Link>
              )}
              <Button 
                className="w-full bg-accent-600 hover:bg-accent-700 p-3"
                onClick={handleCheckAvailability}
              >
                Check Availability
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
