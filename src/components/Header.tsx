
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-brand-700">LeadXclusive</span>
        </Link>
        
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
          <Link to="/contact" className="text-gray-600 hover:text-brand-700 transition-colors">
            Contact
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" className="text-gray-700 hover:text-brand-700">
              Log In
            </Button>
          </Link>
          <Link to="/check-availability">
            <Button className="bg-accent-600 hover:bg-accent-700">
              Check Availability
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
