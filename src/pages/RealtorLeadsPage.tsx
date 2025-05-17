
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const RealtorLeadsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 hero-gradient text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Exclusive Realtor Leads
              </h1>
              <p className="text-xl opacity-90 mb-8">
                Connect with motivated homeowners looking to sell their homes through a traditional 
                listing with a professional real estate agent.
              </p>
              <Link to="/check-availability">
                <Button className="px-8 py-6 text-lg bg-white text-brand-700 hover:bg-gray-100">
                  Check Zip Code Availability
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Perfect For Real Estate Agents</h2>
                <p className="text-lg text-gray-600">
                  Our realtor leads are specifically sourced from homeowners who are looking to list 
                  their property with a professional agent to maximize their sales price.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">What Makes Our Realtor Leads Different</h3>
                  <ul className="space-y-4">
                    <li className="flex">
                      <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">Homeowners specifically looking to list with an agent</span>
                    </li>
                    <li className="flex">
                      <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">Properties typically in better condition than investor leads</span>
                    </li>
                    <li className="flex">
                      <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">Sellers looking for market value or higher</span>
                    </li>
                    <li className="flex">
                      <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">Opportunities for listing presentations and potential buyers</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Types of Listing Opportunities</h3>
                  <ul className="space-y-4">
                    <li className="flex">
                      <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">Primary residences from homeowners ready to upgrade</span>
                    </li>
                    <li className="flex">
                      <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">Downsizing empty-nesters looking for professional guidance</span>
                    </li>
                    <li className="flex">
                      <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">Relocating families needing to sell quickly but at market value</span>
                    </li>
                    <li className="flex">
                      <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">Investment properties being sold by landlords wanting retail price</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-brand-50 p-8 rounded-lg border border-brand-100">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold text-brand-700">The Exclusive Advantage</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  When you purchase exclusive rights to realtor leads in your territory, you'll be the only 
                  agent receiving these leads in your zip code. This means:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">No Competition</h4>
                      <p className="text-gray-600 mt-1">You won't be competing against other agents for the same listing.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Higher Conversion Rates</h4>
                      <p className="text-gray-600 mt-1">Sellers aren't overwhelmed by calls from multiple agents.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Better Client Experience</h4>
                      <p className="text-gray-600 mt-1">Build stronger relationships without rushed decisions.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Potential Buyer Leads</h4>
                      <p className="text-gray-600 mt-1">Many sellers also need to buy, creating double opportunities.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-16">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Ready to Secure Your Territory?</h3>
                <Link to="/check-availability">
                  <Button className="px-8 py-6 text-lg bg-accent-600 hover:bg-accent-700">
                    Check Zip Code Availability
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default RealtorLeadsPage;
