
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, Users, DollarSign, MapPin, Shield, Zap, Trophy, Target } from 'lucide-react';
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
        <section className="py-16 md:py-24 bg-gradient-to-br from-brand-50 via-white to-accent-50 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-32 h-32 bg-brand-600 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent-600 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-fade-in">
                <Trophy className="h-4 w-4 mr-2" />
                Industry Leading Success Rate
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-gray-900 leading-tight">
                <span className="text-brand-700">Unlimited Exclusive</span>
                <br />
                Seller Leads
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Get every qualified seller lead in your territory for one simple flat rate. 
                <span className="text-brand-700 font-semibold"> Only one investor per zip code.</span> No competition. No limits.
              </p>
              
              {/* Key Stats */}
              <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-brand-100 p-3 rounded-full">
                      <MapPin className="h-8 w-8 text-brand-700" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">100% Exclusive</h3>
                  <p className="text-gray-600">Only one investor per zip code guaranteed</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Star className="h-8 w-8 text-green-700" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Unlimited Leads</h3>
                  <p className="text-gray-600">No caps, no limits on qualified leads</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-accent-100 p-3 rounded-full">
                      <DollarSign className="h-8 w-8 text-accent-700" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Flat Rate</h3>
                  <p className="text-gray-600">Simple $199/month pricing</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Pricing Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Simple, Transparent Pricing
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  No hidden fees, no per-lead charges, no long-term contracts. 
                  Just unlimited exclusive leads for one flat monthly rate.
                </p>
              </div>

              {/* Pricing Card */}
              <div className="relative max-w-4xl mx-auto">
                {/* Popular Badge - Properly positioned */}
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-accent-600 to-accent-700 text-white px-8 py-3 rounded-full text-lg font-bold shadow-xl transform hover:scale-105 transition-transform duration-200">
                    🏆 Most Popular Choice
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-brand-100 relative">
                  {/* Header Section */}
                  <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-teal-700 p-8 md:p-12 text-white text-center">
                    <div className="flex items-center justify-center mb-4">
                      <Shield className="h-8 w-8 mr-3 text-accent-400" />
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold">Exclusive Territory Rights</h3>
                    </div>
                    <p className="text-lg md:text-xl opacity-95 max-w-2xl mx-auto">
                      Get unlimited qualified seller leads delivered directly to you with zero competition in your chosen zip code area
                    </p>
                  </div>
                  
                  {/* Pricing Content */}
                  <div className="p-8 md:p-12 text-center">
                    <div className="mb-10">
                      <div className="flex items-center justify-center mb-6 flex-wrap">
                        <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900">$199</span>
                        <div className="ml-4 text-left">
                          <div className="text-xl md:text-2xl text-gray-500">/month</div>
                          <div className="text-lg text-gray-400">per zip code</div>
                        </div>
                      </div>
                      
                      <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-6 py-3 rounded-full text-lg font-bold mb-6 shadow-sm">
                        <Zap className="h-5 w-5 mr-2" />
                        Unlimited Leads Included
                      </div>
                      
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 md:p-8 rounded-2xl mb-8 border border-gray-100">
                        <h4 className="text-xl font-bold mb-3 text-gray-900">What You Get:</h4>
                        <p className="text-gray-700 text-lg leading-relaxed">
                          <strong className="text-brand-700">Unlimited</strong> exclusive seller leads in your chosen zip code area.
                          <br />
                          <span className="text-sm text-gray-600 mt-2 block">No contracts • Cancel anytime • Start receiving leads within 7 days</span>
                        </p>
                      </div>
                      
                      <Link to="/check-availability">
                        <Button className="w-full md:w-auto px-10 md:px-16 py-6 md:py-8 text-xl md:text-2xl bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 shadow-xl transform hover:scale-105 transition-all duration-200 border-0">
                          Secure Your Territory Now
                        </Button>
                      </Link>
                      
                      <p className="text-sm text-gray-500 mt-4 flex items-center justify-center">
                        <Target className="h-4 w-4 mr-2" />
                        Setup takes less than 5 minutes
                      </p>
                    </div>
                  </div>
                  
                  {/* Features Grid */}
                  <div className="border-t border-gray-100 p-8 md:p-12 bg-gradient-to-br from-gray-50 to-white">
                    <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900">Everything Included</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-full mr-4 flex-shrink-0">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">Unlimited Seller Leads</h4>
                          <p className="text-gray-600">No caps, no limits. Get every qualified lead in your zip code area.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-4 flex-shrink-0">
                          <CheckCircle className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">100% Exclusive Territory</h4>
                          <p className="text-gray-600">You're the only investor receiving leads in your zip code.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-purple-100 p-2 rounded-full mr-4 flex-shrink-0">
                          <CheckCircle className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">Pre-Qualified Leads</h4>
                          <p className="text-gray-600">All leads are verified and pre-screened for motivation to sell.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-orange-100 p-2 rounded-full mr-4 flex-shrink-0">
                          <CheckCircle className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">Instant Notifications</h4>
                          <p className="text-gray-600">Get leads via email, SMS, or both - your choice.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-teal-100 p-2 rounded-full mr-4 flex-shrink-0">
                          <CheckCircle className="h-6 w-6 text-teal-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">Lead Management Dashboard</h4>
                          <p className="text-gray-600">Track, organize, and manage all your leads in one place.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-red-100 p-2 rounded-full mr-4 flex-shrink-0">
                          <CheckCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">No Long-Term Contracts</h4>
                          <p className="text-gray-600">Month-to-month billing. Cancel anytime with no penalties.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Value Proposition Section */}
              <div className="mt-20 bg-gradient-to-r from-brand-600 via-brand-700 to-teal-700 rounded-3xl p-8 md:p-16 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-8">Why Choose Flat-Rate Pricing?</h2>
                  <div className="grid md:grid-cols-3 gap-8 mt-8">
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl">
                      <div className="text-4xl md:text-5xl font-bold mb-3">$199</div>
                      <p className="text-lg opacity-90">Fixed monthly cost regardless of lead volume</p>
                    </div>
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl">
                      <div className="text-4xl md:text-5xl font-bold mb-3">∞</div>
                      <p className="text-lg opacity-90">Unlimited leads in your exclusive territory</p>
                    </div>
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl">
                      <div className="text-4xl md:text-5xl font-bold mb-3">1</div>
                      <p className="text-lg opacity-90">Only one investor per zip code guaranteed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mt-20">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">Frequently Asked Questions</h2>
                
                <div className="space-y-8">
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">How many leads will I receive each month?</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      There's no limit! You'll receive every qualified seller lead in your zip code area. 
                      On average, clients see 5-12 leads per month, but busy markets can generate 20+ leads. 
                      Remember, you're getting 100% of the leads - not sharing them with competitors.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">What if I want multiple zip codes?</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Perfect! You can secure as many zip codes as you want. Each additional territory 
                      is just $199/month with the same unlimited lead guarantee and exclusive rights.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Are there any hidden fees or setup costs?</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      None whatsoever. $199/month per zip code is all-inclusive. No setup fees, 
                      no per-lead charges, no hidden costs. Just simple, transparent flat-rate pricing.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">How quickly can I start receiving leads?</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Within 7 days of securing your territory! We'll have your exclusive lead generation 
                      system activated and you'll start receiving unlimited qualified seller leads immediately.
                    </p>
                  </div>
                </div>
              </div>

              {/* Final CTA */}
              <div className="mt-20 text-center bg-gradient-to-br from-accent-50 to-orange-50 p-8 md:p-12 rounded-3xl border-2 border-accent-200">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Ready to Dominate Your Market?</h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Secure your exclusive territory today and start receiving unlimited seller leads with zero competition.
                </p>
                <Link to="/check-availability">
                  <Button className="w-full md:w-auto px-12 md:px-16 py-6 md:py-8 text-xl md:text-2xl bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 shadow-xl transform hover:scale-105 transition-all duration-200">
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
