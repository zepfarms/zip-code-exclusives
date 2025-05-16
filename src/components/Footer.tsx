
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container px-4 py-12 mx-auto md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
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
                <Link to="/investor-leads" className="text-gray-600 hover:text-brand-700 transition-colors">
                  Investor Leads
                </Link>
              </li>
              <li>
                <Link to="/realtor-leads" className="text-gray-600 hover:text-brand-700 transition-colors">
                  Realtor Leads
                </Link>
              </li>
              <li>
                <Link to="/check-availability" className="text-gray-600 hover:text-brand-700 transition-colors">
                  Check Zip Availability
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
                <Link to="/faqs" className="text-gray-600 hover:text-brand-700 transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">
                <strong>Email:</strong> contact@leadxclusive.com
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-brand-700 transition-colors">
                  Contact Form
                </Link>
              </li>
              <li className="pt-4">
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-600 hover:text-accent-600 transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-accent-600 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-accent-600 transition-colors">
                    <span className="sr-only">LinkedIn</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            &copy; {currentYear} LeadXclusive. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
