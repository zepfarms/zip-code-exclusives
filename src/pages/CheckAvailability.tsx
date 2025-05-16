
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ZipCodeChecker from '@/components/ZipCodeChecker';

const CheckAvailability = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="bg-brand-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Check Area Availability
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Enter your desired zip code to see if it's available for exclusive lead generation.
                Remember, we only allow one client per zip code to ensure you get all the leads in your area.
              </p>
            </div>
            
            <ZipCodeChecker />
            
            <div className="mt-16 max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-center">How Exclusive Territories Work</h2>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-medium mb-2 text-brand-700">One Client Per Zip Code</h3>
                  <p className="text-gray-600">
                    We strictly enforce our one-client-per-area policy, ensuring you never have to compete for the leads we send. If you secure a zip code, all qualified leads in that area come exclusively to you.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-medium mb-2 text-brand-700">Secure Multiple Areas</h3>
                  <p className="text-gray-600">
                    If you operate in multiple zip codes, you can secure as many as you'd like (subject to availability). Each additional zip code is $199/month with the same exclusivity guarantee.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-medium mb-2 text-brand-700">Waitlist System</h3>
                  <p className="text-gray-600">
                    If your desired area is already taken, you can join our waitlist. We'll notify you immediately if the current client cancels their subscription or if we expand our coverage areas.
                  </p>
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

export default CheckAvailability;
