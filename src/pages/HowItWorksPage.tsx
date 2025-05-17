
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle } from 'lucide-react';

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-brand-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                How LeadXclusive Works
              </h1>
              <p className="text-xl text-gray-600">
                Our streamlined process makes it easy to start receiving exclusive real estate leads in your area.
              </p>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-16">
                {/* Step 1 */}
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-shrink-0 w-full md:w-1/3 text-center">
                    <div className="inline-flex h-20 w-20 rounded-full bg-brand-100 items-center justify-center">
                      <span className="text-2xl font-bold text-brand-700">1</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold mb-3 text-gray-900">Check Area Availability</h2>
                    <p className="text-lg text-gray-600">
                      Start by entering your desired zip code to check if it's available. 
                      We limit each area to only one agent or investor to ensure you have 
                      exclusive access to all leads in that territory.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-shrink-0 w-full md:w-1/3 text-center">
                    <div className="inline-flex h-20 w-20 rounded-full bg-brand-100 items-center justify-center">
                      <span className="text-2xl font-bold text-brand-700">2</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold mb-3 text-gray-900">Claim Your Territory</h2>
                    <p className="text-lg text-gray-600">
                      Once you've found an available area, you can secure exclusive rights to 
                      all leads in that territory. Your subscription begins with a 7-day free trial 
                      period, after which you'll be billed $199/month for continued exclusive access.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-shrink-0 w-full md:w-1/3 text-center">
                    <div className="inline-flex h-20 w-20 rounded-full bg-brand-100 items-center justify-center">
                      <span className="text-2xl font-bold text-brand-700">3</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold mb-3 text-gray-900">Complete Your Profile</h2>
                    <p className="text-lg text-gray-600">
                      Set up your profile with your contact preferences. Choose how you want to 
                      receive leads—via email, text message, or both. You can also customize 
                      notification settings to ensure you never miss a lead.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-shrink-0 w-full md:w-1/3 text-center">
                    <div className="inline-flex h-20 w-20 rounded-full bg-brand-100 items-center justify-center">
                      <span className="text-2xl font-bold text-brand-700">4</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold mb-3 text-gray-900">Receive Exclusive Leads</h2>
                    <p className="text-lg text-gray-600">
                      We generate leads through our targeted marketing campaigns designed to attract 
                      motivated sellers. All leads are pre-screened before being sent to you, 
                      ensuring you only receive qualified opportunities.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-shrink-0 w-full md:w-1/3 text-center">
                    <div className="inline-flex h-20 w-20 rounded-full bg-brand-100 items-center justify-center">
                      <span className="text-2xl font-bold text-brand-700">5</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold mb-3 text-gray-900">Close More Deals</h2>
                    <p className="text-lg text-gray-600">
                      With exclusive access to all leads in your territory, you'll have the competitive 
                      advantage to close more deals. Our customers typically see a significant ROI 
                      within the first few months of using our service.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-20 bg-brand-50 p-8 rounded-lg border border-brand-100">
                <h3 className="text-2xl font-semibold mb-6 text-center text-brand-700">Why Choose LeadXclusive?</h3>
                
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Exclusive Territory Rights</h4>
                      <p className="text-gray-600 mt-1">No competing with other investors in your selected area.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Pre-Qualified Leads</h4>
                      <p className="text-gray-600 mt-1">Each lead is vetted to ensure they're serious about selling.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Customizable Notifications</h4>
                      <p className="text-gray-600 mt-1">Receive leads via email, text, or both - your choice.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">No Long-Term Contracts</h4>
                      <p className="text-gray-600 mt-1">Month-to-month service that you can cancel anytime.</p>
                    </div>
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

export default HowItWorksPage;
