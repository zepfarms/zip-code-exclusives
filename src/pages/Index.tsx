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
import { ArrowRight, DollarSign, MapPin, Star } from 'lucide-react';
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
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Exclusive Real Estate Seller Leads in <span className="text-accent-500">Your Territory</span>
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-10">
                One investor or agent per zip code. No competition. Premium seller leads delivered directly to you.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button 
                  className="px-8 py-6 text-lg bg-accent-600 hover:bg-accent-700 group"
                  onClick={scrollToZipChecker}
                >
                  Check Availability
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </Button>
                <Link to="/how-it-works">
                  <Button variant="outline" className="px-8 py-6 text-lg bg-transparent border-white text-white hover:bg-white/10">
                    Learn How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Abstract shapes in the background */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden" aria-hidden="true">
            <div className="absolute top-1/4 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          </div>
        </section>

        {/* Check Availability Section */}
        <section id="zip-checker-section" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Check Your Area's Availability
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Enter your desired zip code to see if it's available for exclusive seller lead generation.
              </p>
            </div>
            
            <ZipCodeChecker />
          </div>
        </section>

        {/* Simple Pricing Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Get unlimited exclusive seller leads in your territory for one low monthly price.
              </p>
              
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-200 relative">
                {/* Popular Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-accent-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-5xl font-bold text-gray-900">$199</span>
                    <div className="ml-3 text-left">
                      <div className="text-xl text-gray-500">/month</div>
                      <div className="text-sm text-gray-400">per zip code</div>
                    </div>
                  </div>
                  <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                    Unlimited Leads • Cancel Anytime
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Exclusive Territory Rights
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  Be the only real estate professional receiving seller leads in your zip code. 
                  No competition, unlimited potential.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <div className="flex items-center bg-brand-50 px-4 py-2 rounded-full">
                    <MapPin className="h-5 w-5 text-brand-700 mr-2" />
                    <span className="text-sm font-medium">One Professional Per Zip</span>
                  </div>
                  <div className="flex items-center bg-brand-50 px-4 py-2 rounded-full">
                    <Star className="h-5 w-5 text-brand-700 mr-2" />
                    <span className="text-sm font-medium">Unlimited Seller Leads</span>
                  </div>
                  <div className="flex items-center bg-brand-50 px-4 py-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-brand-700 mr-2" />
                    <span className="text-sm font-medium">No Hidden Fees</span>
                  </div>
                </div>

                <Link to="/check-availability">
                  <Button className="px-8 py-6 text-lg bg-accent-600 hover:bg-accent-700 group">
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
