
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SellerLeadsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Exclusive Seller Leads | LeadXclusive</title>
        <meta name="description" content="Connect with motivated sellers looking to sell their properties in your exclusive territory. No competition, just quality seller leads delivered directly to you." />
        <link rel="canonical" href="https://leadxclusive.com/seller-leads" />
      </Helmet>
      
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 hero-gradient text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Exclusive Seller Leads
              </h1>
              <p className="text-xl opacity-90 mb-8">
                Connect with motivated sellers looking to sell their properties in your exclusive territory.
                No competition, just quality leads delivered directly to you.
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
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Premium Seller Leads For Real Estate Professionals</h2>
                <p className="text-lg text-gray-600">
                  Our seller leads connect you with motivated homeowners ready to sell their properties,
                  whether they're looking for a quick cash sale or traditional listing with a real estate agent.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">What Makes Our Seller Leads Different</h3>
                  <ul className="space-y-4">
                    <li className="flex">
                      <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" aria-hidden="true" />
                      <span className="text-gray-600">Motivated sellers actively looking to sell their property</span>
                    </li>
                    <li className="flex">
                      <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" aria-hidden="true" />
                      <span className="text-gray-600">Properties ranging from distressed to well-maintained homes</span>
                    </li>
                    <li className="flex">
                      <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" aria-hidden="true" />
                      <span className="text-gray-600">Sellers open to various transaction types and offers</span>
                    </li>
                    <li className="flex">
                      <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" aria-hidden="true" />
                      <span className="text-gray-600">Opportunities for investors, agents, and all real estate professionals</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Types of Opportunities</h3>
                  <ul className="space-y-4">
                    <li className="flex">
                      <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" aria-hidden="true" />
                      <span className="text-gray-600">Pre-foreclosure and distressed properties for investors</span>
                    </li>
                    <li className="flex">
                      <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" aria-hidden="true" />
                      <span className="text-gray-600">Primary residences from homeowners ready to upgrade</span>
                    </li>
                    <li className="flex">
                      <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" aria-hidden="true" />
                      <span className="text-gray-600">Inherited properties from out-of-state owners</span>
                    </li>
                    <li className="flex">
                      <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" aria-hidden="true" />
                      <span className="text-gray-600">Properties from owners experiencing major life transitions</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-brand-50 p-8 rounded-lg border border-brand-100">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold text-brand-700">The Exclusive Advantage</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  When you purchase exclusive rights to seller leads in your territory, you'll be the only 
                  real estate professional receiving these leads in your zip code. This means:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h4 className="font-medium text-gray-900">No Competition</h4>
                      <p className="text-gray-600 mt-1">You won't be competing against others for the same property.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h4 className="font-medium text-gray-900">Higher Conversion Rates</h4>
                      <p className="text-gray-600 mt-1">Sellers aren't overwhelmed by calls from multiple professionals.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h4 className="font-medium text-gray-900">Better Negotiating Position</h4>
                      <p className="text-gray-600 mt-1">You have time to properly analyze deals without rushing.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h4 className="font-medium text-gray-900">More Profitable Deals</h4>
                      <p className="text-gray-600 mt-1">Exclusive access typically leads to better outcomes.</p>
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

export default SellerLeadsPage;
