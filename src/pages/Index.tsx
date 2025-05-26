
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
import { ArrowRight, DollarSign, MapPin, Star, Shield, CheckCircle2, Users, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
const Index = () => {
  // Function to scroll to the zip code checker section
  const scrollToZipChecker = () => {
    const zipCheckerElement = document.getElementById('zip-checker-section');
    if (zipCheckerElement) {
      zipCheckerElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>LeadXclusive | Exclusive Real Estate Seller Leads With No Competition</title>
        <meta name="description" content="Get exclusive real estate seller leads with one investor or agent per zip code. High-quality motivated seller leads with no competition in your territory." />
        <link rel="canonical" href="https://leadxclusive.com/" />
      </Helmet>
      
      <Header />
      
      <main className="flex-1">
        {/* Modern Hero Section */}
        <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          </div>
          
          {/* Geometric Accent Elements */}
          <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-indigo-400/5 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Content */}
                <div className="text-left">
                  {/* Main Headline */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Unlimited Exclusive 
                    <span className="block text-blue-600">Real Estate Seller Leads</span>
                    <span className="block text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-600 mt-2">
                      Just $199 a month
                    </span>
                  </h1>
                  
                  {/* Subheadline */}
                  <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
                    Get exclusive territory rights in your zip code. No competition, guaranteed 5 leads monthly, unlimited potential.
                  </p>
                  
                  {/* Key Features */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">One agent per zip code</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">Guaranteed 5 leads monthly</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">No competition in your area</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">Cancel anytime</span>
                    </div>
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={scrollToZipChecker} className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group">
                      Check Availability Now
                      <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                    </Button>
                    
                    <Link to="/how-it-works">
                      <Button variant="outline" className="px-8 py-6 text-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
                        Learn How It Works
                      </Button>
                    </Link>
                  </div>
                </div>
                
                {/* Right Column - Visual Elements */}
                <div className="relative lg:ml-8">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">1,000+</div>
                      <div className="text-sm text-gray-600">Active Investors</div>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
                      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
                        <Target className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">50,000+</div>
                      <div className="text-sm text-gray-600">Leads Delivered</div>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
                        <MapPin className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">500+</div>
                      <div className="text-sm text-gray-600">Exclusive Territories</div>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
                      <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
                        <TrendingUp className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">95%</div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                  </div>
                  
                  {/* Featured Badge */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-2xl">
                    <div className="flex items-center mb-4">
                      <Shield className="h-8 w-8 mr-3" />
                      <div>
                        <div className="font-bold text-lg">Exclusive Territory</div>
                        <div className="text-blue-100 text-sm">100% Guaranteed</div>
                      </div>
                    </div>
                    <p className="text-blue-100">
                      Be the only real estate professional receiving seller leads in your zip code. No competition, ever.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guarantee Section */}
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center bg-blue-50 text-blue-800 px-6 py-3 rounded-full text-lg font-semibold mb-6">
                <Shield className="h-6 w-6 mr-2" />
                Our Guarantee to You
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Guaranteed 5 Leads a Month
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                We guarantee you will receive at least 5 qualified seller leads every month in your exclusive territory. 
                Since our leads don't cost us money to generate, we can make this promise with confidence.
              </p>
              
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <CheckCircle2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Guaranteed 5 Leads</h3>
                  <p className="text-gray-600">Minimum leads every month in your territory</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl">
                  <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Quality Leads</h3>
                  <p className="text-gray-600">Motivated sellers ready to do business</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl">
                  <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Exclusive Territory</h3>
                  <p className="text-gray-600">One investor per zip code guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Check Availability Section */}
        <section id="zip-checker-section" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6 px-4">
                Check Your Area's Availability
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                Enter your desired zip code to see if it's available for exclusive seller lead generation with guaranteed 5 leads monthly.
              </p>
            </div>
            
            <ZipCodeChecker />
          </div>
        </section>

        {/* Enhanced Pricing Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 md:mb-8 px-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-12 leading-relaxed px-4 max-w-3xl mx-auto">
                Get unlimited exclusive seller leads in your territory for one low monthly price, with guaranteed 5 leads monthly.
              </p>
              
              <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 lg:p-12 border border-gray-200 relative transform hover:scale-105 transition-all duration-300 mx-4">
                <div className="mb-8 md:mb-10">
                  <div className="flex items-center justify-center mb-4 md:mb-6">
                    <span className="text-4xl md:text-6xl font-bold text-gray-900">$199</span>
                    <div className="ml-3 md:ml-4 text-left">
                      <div className="text-lg md:text-2xl text-gray-500">/month</div>
                      <div className="text-xs md:text-sm text-gray-400">per zip code</div>
                    </div>
                  </div>
                  <div className="inline-block bg-gradient-to-r from-blue-100 to-accent-100 text-accent-800 px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold">
                    Guaranteed 5 Leads Monthly • Cancel Anytime
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                  Unlimited Exclusive Seller Leads
                </h3>
                <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-10 leading-relaxed px-4">
                  Be the only real estate professional receiving seller leads in your zip code. 
                  No competition, guaranteed 5 leads monthly minimum.
                </p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
                  <div className="flex flex-col items-center bg-brand-50 p-3 md:p-4 rounded-xl">
                    <MapPin className="h-5 md:h-6 w-5 md:w-6 text-brand-700 mb-2" />
                    <span className="text-xs md:text-sm font-medium text-center">One Professional Per Zip</span>
                  </div>
                  <div className="flex flex-col items-center bg-brand-50 p-3 md:p-4 rounded-xl">
                    <Star className="h-5 md:h-6 w-5 md:w-6 text-brand-700 mb-2" />
                    <span className="text-xs md:text-sm font-medium text-center">Quality Seller Leads</span>
                  </div>
                  <div className="flex flex-col items-center bg-brand-50 p-3 md:p-4 rounded-xl">
                    <Shield className="h-5 md:h-6 w-5 md:w-6 text-brand-700 mb-2" />
                    <span className="text-xs md:text-sm font-medium text-center">Guaranteed 5 Monthly</span>
                  </div>
                  <div className="flex flex-col items-center bg-brand-50 p-3 md:p-4 rounded-xl">
                    <DollarSign className="h-5 md:h-6 w-5 md:w-6 text-brand-700 mb-2" />
                    <span className="text-xs md:text-sm font-medium text-center">No Hidden Fees</span>
                  </div>
                </div>

                <Link to="/check-availability">
                  <Button className="px-8 md:px-10 py-4 md:py-6 text-base md:text-lg bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 group shadow-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto">
                    Claim Your Territory
                    <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5 transform group-hover:translate-x-1 transition-transform" />
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
    </div>;
};
export default Index;
