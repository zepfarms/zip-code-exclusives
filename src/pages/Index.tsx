
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ZipCodeChecker from '@/components/ZipCodeChecker';
import HowItWorks from '@/components/HowItWorks';
import LeadTypes from '@/components/LeadTypes';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import Faq from '@/components/Faq';
import CallToAction from '@/components/CallToAction';
import { Button } from '@/components/ui/button';
import { ArrowRight, DollarSign, MapPin, Star, Shield, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  // Function to scroll to the zip code checker section
  const scrollToZipChecker = () => {
    const zipCheckerElement = document.getElementById('zip-checker-section');
    if (zipCheckerElement) {
      zipCheckerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>LeadXclusive | Exclusive Real Estate Seller Leads With No Competition</title>
        <meta name="description" content="Get exclusive real estate seller leads with one investor or agent per zip code. High-quality motivated seller leads with no competition in your territory." />
        <link rel="canonical" href="https://leadxclusive.com/" />
      </Helmet>
      
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 hero-gradient text-white overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Exclusive Real Estate Seller Leads in <span className="text-accent-400 bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">Your Territory</span>
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto leading-relaxed">
                One investor or agent per zip code. No competition. Premium seller leads delivered directly to you with our exclusive territory guarantee.
              </p>
              
              {/* Guarantee Badge */}
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 mb-10">
                <Shield className="h-8 w-8 text-accent-300 mr-3" />
                <div className="text-left">
                  <div className="font-bold text-lg text-white">5 Lead Guarantee</div>
                  <div className="text-sm text-white/80">Minimum 5 leads per month or your month is FREE</div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button 
                  className="px-8 py-6 text-lg bg-accent-600 hover:bg-accent-700 group shadow-2xl transform hover:scale-105 transition-all duration-200"
                  onClick={scrollToZipChecker}
                >
                  Check Availability
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </Button>
                <Link to="/how-it-works">
                  <Button variant="outline" className="px-8 py-6 text-lg bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-700 transition-all duration-200">
                    Learn How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Enhanced Abstract shapes in the background */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden" aria-hidden="true">
            <div className="absolute top-1/4 left-0 w-64 h-64 bg-accent-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-300/5 rounded-full blur-3xl"></div>
          </div>
        </section>

        {/* Guarantee Section */}
        <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50 border-y border-green-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full text-lg font-semibold mb-6">
                <Shield className="h-6 w-6 mr-2" />
                Our Guarantee to You
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Minimum 5 Seller Leads Per Month, Guaranteed
              </h2>
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Since our leads don't cost us money to generate, we can make this promise: You will receive at least 5 qualified seller leads every month in your territory. If you don't receive at least 5 leads in any given month, that month is completely FREE. However, there's no limit to how many leads you can receive - many of our clients get 15-30+ leads per month!
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
                  <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Minimum 5 Leads</h3>
                  <p className="text-gray-600">Guaranteed every month or your money back</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
                  <Star className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">No Upper Limit</h3>
                  <p className="text-gray-600">Receive as many leads as your territory generates</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Risk-Free</h3>
                  <p className="text-gray-600">Month is free if you don't get your 5 leads</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Check Availability Section */}
        <section id="zip-checker-section" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Check Your Area's Availability
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Enter your desired zip code to see if it's available for exclusive seller lead generation with our 5-lead guarantee.
              </p>
            </div>
            
            <ZipCodeChecker />
          </div>
        </section>

        {/* Enhanced Pricing Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                Get unlimited exclusive seller leads in your territory for one low monthly price, with our 5-lead guarantee.
              </p>
              
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200 relative transform hover:scale-105 transition-all duration-300">
                {/* Popular Badge */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-accent-600 to-accent-700 text-white px-8 py-3 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
                
                <div className="mb-10">
                  <div className="flex items-center justify-center mb-6">
                    <span className="text-6xl font-bold text-gray-900">$199</span>
                    <div className="ml-4 text-left">
                      <div className="text-2xl text-gray-500">/month</div>
                      <div className="text-sm text-gray-400">per zip code</div>
                    </div>
                  </div>
                  <div className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-6 py-3 rounded-full text-sm font-semibold">
                    Unlimited Leads • 5 Lead Guarantee • Cancel Anytime
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Exclusive Territory Rights
                </h3>
                <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                  Be the only real estate professional receiving seller leads in your zip code. 
                  No competition, unlimited potential, minimum 5 leads guaranteed monthly.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  <div className="flex flex-col items-center bg-brand-50 p-4 rounded-xl">
                    <MapPin className="h-6 w-6 text-brand-700 mb-2" />
                    <span className="text-sm font-medium text-center">One Professional Per Zip</span>
                  </div>
                  <div className="flex flex-col items-center bg-brand-50 p-4 rounded-xl">
                    <Star className="h-6 w-6 text-brand-700 mb-2" />
                    <span className="text-sm font-medium text-center">Unlimited Seller Leads</span>
                  </div>
                  <div className="flex flex-col items-center bg-brand-50 p-4 rounded-xl">
                    <Shield className="h-6 w-6 text-brand-700 mb-2" />
                    <span className="text-sm font-medium text-center">5 Lead Guarantee</span>
                  </div>
                  <div className="flex flex-col items-center bg-brand-50 p-4 rounded-xl">
                    <DollarSign className="h-6 w-6 text-brand-700 mb-2" />
                    <span className="text-sm font-medium text-center">No Hidden Fees</span>
                  </div>
                </div>

                <Link to="/check-availability">
                  <Button className="px-10 py-6 text-lg bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 group shadow-xl transform hover:scale-105 transition-all duration-200">
                    Claim Your Territory
                    <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Lead Types Section */}
        <LeadTypes />

        {/* Testimonials Section */}
        <Testimonials />

        {/* Pricing Section */}
        <Pricing />

        {/* FAQ Section */}
        <Faq />

        {/* Call to Action */}
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
