
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, Users, DollarSign, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const PricingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Pricing - Exclusive Real Estate Seller Leads | $199/Month Per Zip Code</title>
        <meta name="description" content="Simple flat-rate pricing for exclusive real estate seller leads. Only $199/month per zip code with unlimited leads. One investor per area - no competition guaranteed." />
        <meta name="keywords" content="real estate leads pricing, exclusive seller leads cost, investor leads pricing, motivated seller leads price, real estate lead generation cost" />
        <link rel="canonical" href="https://leadxclusive.com/pricing" />
      </Helmet>

      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-brand-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
                Simple Flat-Rate Pricing for <span className="text-brand-700">Unlimited Exclusive Leads</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Only one investor per zip code. Unlimited seller leads in your territory for one low monthly price.
              </p>
              
              {/* Key Benefits Bar */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center justify-center bg-white p-4 rounded-lg shadow-sm">
                  <MapPin className="h-6 w-6 text-brand-700 mr-3" />
                  <span className="font-semibold">One Investor Per Zip</span>
                </div>
                <div className="flex items-center justify-center bg-white p-4 rounded-lg shadow-sm">
                  <Star className="h-6 w-6 text-brand-700 mr-3" />
                  <span className="font-semibold">Unlimited Leads</span>
                </div>
                <div className="flex items-center justify-center bg-white p-4 rounded-lg shadow-sm">
                  <DollarSign className="h-6 w-6 text-brand-700 mr-3" />
                  <span className="font-semibold">Flat-Rate Pricing</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Pricing Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Pricing Card */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-brand-100 relative mt-8">
                {/* Popular Badge - Fixed positioning */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-accent-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular Choice
                  </div>
                </div>

                <div className="p-6 md:p-12 hero-gradient text-white text-center pt-12 md:pt-16">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Exclusive Territory Rights</h2>
                  <p className="text-lg md:text-xl opacity-90 mb-6">
                    Get unlimited qualified seller leads delivered directly to you with zero competition
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <Users className="h-6 md:h-8 w-6 md:w-8 text-accent-400" />
                    <span className="text-base md:text-lg font-medium">Only 1 Client Per Zip Code</span>
                  </div>
                </div>
                
                <div className="p-6 md:p-12 text-center">
                  <div className="mb-8">
                    <div className="flex items-center justify-center mb-4 flex-wrap">
                      <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900">$199</span>
                      <div className="ml-2 md:ml-4 text-left">
                        <div className="text-lg md:text-xl text-gray-500">/month</div>
                        <div className="text-sm md:text-lg text-gray-400">per zip code</div>
                      </div>
                    </div>
                    <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                      🚀 Unlimited Leads Included
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 md:p-6 rounded-lg mb-8">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">What You Get:</h3>
                    <p className="text-gray-600 text-base md:text-lg">
                      <strong>Unlimited</strong> exclusive seller leads in your chosen zip code area.
                      <br />No contracts • Cancel anytime • Start receiving leads within 7 days
                    </p>
                  </div>
                  
                  <Link to="/check-availability">
                    <Button className="w-full md:w-auto px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl bg-accent-600 hover:bg-accent-700 shadow-lg transform hover:scale-105 transition-all duration-200">
                      Secure Your Territory Now
                    </Button>
                  </Link>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    ⚡ Setup takes less than 5 minutes
                  </p>
                </div>
                
                {/* Features Grid */}
                <div className="border-t border-gray-100 p-6 md:p-12 bg-gray-50">
                  <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8 text-gray-900">Everything Included</h3>
                  <div className="grid md:grid-cols-2 gap-6 md:gap-x-16 md:gap-y-6">
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-base md:text-lg">Unlimited Seller Leads</h4>
                        <p className="text-gray-600 mt-1 text-sm md:text-base">No caps, no limits. Get every qualified lead in your zip code.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-base md:text-lg">100% Exclusive Territory</h4>
                        <p className="text-gray-600 mt-1 text-sm md:text-base">You're the only investor receiving leads in your zip code.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-base md:text-lg">Pre-Qualified Leads</h4>
                        <p className="text-gray-600 mt-1 text-sm md:text-base">All leads are verified and pre-screened for motivation.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-base md:text-lg">Instant Notifications</h4>
                        <p className="text-gray-600 mt-1 text-sm md:text-base">Get leads via email, SMS, or both - your choice.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-base md:text-lg">Lead Management Dashboard</h4>
                        <p className="text-gray-600 mt-1 text-sm md:text-base">Track, organize, and manage all your leads in one place.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-base md:text-lg">No Long-Term Contracts</h4>
                        <p className="text-gray-600 mt-1 text-sm md:text-base">Month-to-month billing. Cancel anytime with no penalties.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Value Proposition Section */}
              <div className="mt-16 bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-6 md:p-12 text-white text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Choose Flat-Rate Pricing?</h2>
                <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8">
                  <div>
                    <div className="text-3xl md:text-4xl font-bold mb-2">$199</div>
                    <p className="text-base md:text-lg opacity-90">Fixed monthly cost regardless of lead volume</p>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold mb-2">∞</div>
                    <p className="text-base md:text-lg opacity-90">Unlimited leads in your exclusive territory</p>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold mb-2">1</div>
                    <p className="text-base md:text-lg opacity-90">Only one investor per zip code guaranteed</p>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mt-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-gray-900">Frequently Asked Questions</h2>
                
                <div className="space-y-6">
                  <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900">How many leads will I receive each month?</h3>
                    <p className="text-gray-600 text-base md:text-lg">
                      There's no limit! You'll receive every qualified seller lead in your zip code area. 
                      On average, clients see 5-12 leads per month, but busy markets can generate 20+ leads. 
                      Remember, you're getting 100% of the leads - not sharing them with competitors.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900">What if I want multiple zip codes?</h3>
                    <p className="text-gray-600 text-base md:text-lg">
                      Perfect! You can secure as many zip codes as you want. Each additional territory 
                      is just $199/month with the same unlimited lead guarantee and exclusive rights.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900">Are there any hidden fees or setup costs?</h3>
                    <p className="text-gray-600 text-base md:text-lg">
                      None whatsoever. $199/month per zip code is all-inclusive. No setup fees, 
                      no per-lead charges, no hidden costs. Just simple, transparent flat-rate pricing.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900">How quickly can I start receiving leads?</h3>
                    <p className="text-gray-600 text-base md:text-lg">
                      Within 7 days of securing your territory! We'll have your exclusive lead generation 
                      system activated and you'll start receiving unlimited qualified seller leads immediately.
                    </p>
                  </div>
                </div>
              </div>

              {/* Final CTA */}
              <div className="mt-16 text-center bg-gray-50 p-6 md:p-8 rounded-2xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Ready to Dominate Your Market?</h2>
                <p className="text-lg md:text-xl text-gray-600 mb-6">
                  Secure your exclusive territory today and start receiving unlimited seller leads with zero competition.
                </p>
                <Link to="/check-availability">
                  <Button className="w-full md:w-auto px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl bg-brand-700 hover:bg-brand-800 shadow-lg">
                    Check Territory Availability
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

export default PricingPage;
