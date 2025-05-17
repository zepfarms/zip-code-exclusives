
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
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

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
        <title>LeadXclusive | Exclusive Real Estate Leads With No Competition</title>
        <meta name="description" content="Get exclusive real estate leads with one investor or agent per zip code. High-quality seller leads for investors and realtors with no competition." />
        <link rel="canonical" href="https://leadxclusive.com/" />
      </Helmet>
      
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 hero-gradient text-white overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Exclusive Real Estate Leads in <span className="text-accent-500">Your Territory</span>
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-10">
                One investor or agent per zip code. No competition. Premium leads delivered directly to you.
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
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
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
                Enter your desired zip code to see if it's available for exclusive lead generation.
              </p>
            </div>
            
            <ZipCodeChecker />
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
