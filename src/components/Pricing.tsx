
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, MapPin, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple Flat-Rate Pricing</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Unlimited exclusive seller leads in your territory for one low monthly price. No competition, no limits.
          </p>
          
          {/* Key Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center bg-brand-50 px-4 py-2 rounded-full">
              <MapPin className="h-5 w-5 text-brand-700 mr-2" />
              <span className="text-sm font-medium">One Investor Per Zip</span>
            </div>
            <div className="flex items-center bg-brand-50 px-4 py-2 rounded-full">
              <Star className="h-5 w-5 text-brand-700 mr-2" />
              <span className="text-sm font-medium">Unlimited Leads</span>
            </div>
            <div className="flex items-center bg-brand-50 px-4 py-2 rounded-full">
              <DollarSign className="h-5 w-5 text-brand-700 mr-2" />
              <span className="text-sm font-medium">Flat-Rate Pricing</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
            {/* Popular Badge */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-accent-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Exclusive Territory
              </div>
            </div>

            <div className="p-8 md:p-12 hero-gradient text-white text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Unlimited Exclusive Seller Leads</h3>
              <p className="text-lg opacity-90">
                Qualified real estate leads delivered directly to you with no competition
              </p>
            </div>
            
            <div className="p-8 md:p-12 text-center">
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-5xl font-bold">$199</span>
                  <div className="ml-3 text-left">
                    <div className="text-xl text-gray-500">/month</div>
                    <div className="text-sm text-gray-400">per zip code</div>
                  </div>
                </div>
                <div className="inline-block bg-blue-100 text-accent-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Guaranteed 5 leads a month
                </div>
              </div>
              
              <p className="text-gray-600 mb-8">
                Only one investor per zip code - you get 100% of the leads in your area.
                <br />No contracts, cancel anytime.
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
                    <h4 className="font-medium">100% Exclusive Territory Rights</h4>
                    <p className="text-gray-600 mt-1">You're the only investor receiving leads in your zip code.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Guaranteed 5 Leads Monthly</h4>
                    <p className="text-gray-600 mt-1">Minimum 5 qualified leads every month in your territory.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Instant Notifications</h4>
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
                    <h4 className="font-medium">Start Receiving Leads in 7 Days</h4>
                    <p className="text-gray-600 mt-1">Begin receiving qualified leads within one week of setup.</p>
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
