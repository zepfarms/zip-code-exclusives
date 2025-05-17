
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        </nav>
        
        {/* Desktop CTA buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" className="text-gray-700 hover:text-brand-700">
              Log In
            </Button>
          </Link>
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

      {/* Mobile menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16">
          <div className="container flex flex-col items-center justify-start p-6 space-y-6">
            <Link to="/" className="text-xl font-medium text-gray-900" onClick={closeMobileMenu}>
              Home
            </Link>
            <Link to="/how-it-works" className="text-xl font-medium text-gray-900" onClick={closeMobileMenu}>
              How It Works
            </Link>
            <Link to="/pricing" className="text-xl font-medium text-gray-900" onClick={closeMobileMenu}>
              Pricing
            </Link>
            <Link to="/about" className="text-xl font-medium text-gray-900" onClick={closeMobileMenu}>
              About Us
            </Link>
            <div className="pt-6 w-full">
              <Link to="/login" onClick={closeMobileMenu}>
                <Button variant="ghost" className="w-full text-gray-700 hover:text-brand-700 mb-4">
                  Log In
                </Button>
              </Link>
              <Button 
                className="w-full bg-accent-600 hover:bg-accent-700"
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
