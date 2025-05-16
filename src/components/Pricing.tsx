
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            One straightforward price with no hidden fees or long-term commitments.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 md:p-12 hero-gradient text-white text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Exclusive Territory Lead Generation</h3>
              <p className="text-lg opacity-90">
                Qualified real estate leads delivered directly to you with no competition
              </p>
            </div>
            
            <div className="p-8 md:p-12 text-center">
              <div className="mb-6">
                <span className="text-5xl font-bold">$199</span>
                <span className="text-xl text-gray-500 ml-2">/month per area</span>
              </div>
              
              <p className="text-gray-600 mb-8">
                Each area is exclusive - only one client per zip code.
                No contracts, cancel anytime.
              </p>
              
              <Link to="/check-availability">
                <Button className="px-12 py-6 text-lg bg-accent-600 hover:bg-accent-700">
                  Check Area Availability
                </Button>
              </Link>
            </div>
            
            <div className="border-t border-gray-100 p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-x-16 gap-y-6">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Exclusive Territory Rights</h4>
                    <p className="text-gray-600 mt-1">You're the only client receiving leads in your zip code.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Qualified Leads</h4>
                    <p className="text-gray-600 mt-1">All leads are pre-screened and verified.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Customizable Notifications</h4>
                    <p className="text-gray-600 mt-1">Receive leads via email, text message, or both.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Lead Management Dashboard</h4>
                    <p className="text-gray-600 mt-1">Track and manage your leads in our user-friendly portal.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">7-Day Free Trial</h4>
                    <p className="text-gray-600 mt-1">Try the service risk-free for 7 days.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Cancel Anytime</h4>
                    <p className="text-gray-600 mt-1">No long-term contracts or commitments required.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
