
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-brand-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-gray-600">
                One straightforward price with no hidden fees or long-term commitments.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
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
                    <span className="text-5xl font-bold">$1</span>
                    <span className="text-xl text-gray-500 ml-2">/month per area</span>
                    <div className="mt-2 text-sm text-rose-600">(Testing price - normally $199)</div>
                  </div>
                  
                  <p className="text-gray-600 mb-8">
                    Each area is exclusive - only one client per zip code.
                    <br />No long-term contracts required, cancel anytime.
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

              <div className="mt-16">
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">Frequently Asked Questions</h3>
                
                <div className="space-y-8">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold mb-2 text-gray-900">What happens if I want to add more zip codes?</h4>
                    <p className="text-gray-600">
                      You can add as many zip codes as you want! Each additional zip code is $199/month, 
                      and you'll have exclusive rights to all leads in those areas.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold mb-2 text-gray-900">How many leads can I expect each month?</h4>
                    <p className="text-gray-600">
                      Lead volume varies by area and market conditions. On average, clients receive 
                      3-8 qualified leads per month per zip code. Remember, these are exclusive leads 
                      that only you receive.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold mb-2 text-gray-900">What if I want to cancel?</h4>
                    <p className="text-gray-600">
                      You can cancel your subscription at any time through your dashboard. There are 
                      no cancellation fees or penalties. Your subscription will remain active until the 
                      end of your current billing cycle.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold mb-2 text-gray-900">Are there any setup fees or hidden costs?</h4>
                    <p className="text-gray-600">
                      No. The $199/month per zip code is all-inclusive. There are no setup fees, 
                      no hidden costs, and no long-term contracts required.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PricingPage;
