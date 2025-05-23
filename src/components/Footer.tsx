import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container px-4 py-12 mx-auto md:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="space-y-4 col-span-2 md:col-span-1">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold text-brand-700">LeadXclusive</span>
            </Link>
            <p className="text-gray-600">
              Premium real estate leads with exclusive zip code territories. Increase your closing rate with qualified leads.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/seller-leads" className="text-gray-600 hover:text-brand-700 transition-colors">
                  Seller Leads
                </Link>
              </li>
              <li>
                <Link to="/check-availability" className="text-gray-600 hover:text-brand-700 transition-colors">
                  Check Zip Availability
                </Link>
              </li>
              <li>
                <Link to="/investor-tools" className="text-gray-600 hover:text-brand-700 transition-colors">
                  Investor Tools
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="text-gray-600 hover:text-brand-700 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-brand-700 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-brand-700 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Company</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">
                <strong>Email:</strong> help@leadxclusive.com
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-600 hover:text-brand-700 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            &copy; {currentYear} LeadXclusive, a service by AutoPilotRE LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
