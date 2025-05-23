
import { CheckCircle } from 'lucide-react';
import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      title: "Check Area Availability",
      description: "Enter your desired zip code to see if it's available for exclusive lead generation.",
      icon: "search"
    },
    {
      title: "Claim Your Territory",
      description: "Secure exclusive rights to receive all leads from your chosen area for just $199/month.",
      icon: "map-pin"
    },
    {
      title: "Complete Your Profile",
      description: "Set up how you want to receive leads - via email, text, or both.",
      icon: "user"
    },
    {
      title: "Start Receiving Leads",
      description: "After the 7-day setup period, start receiving exclusive, qualified leads directly.",
      icon: "inbox"
    }
  ];

  return (
    <div className="py-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our streamlined process makes it easy to start receiving exclusive real estate leads in your area.
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mb-4 text-brand-700">
                <span className="text-xl font-bold">{index + 1}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How We Generate Your Leads Section */}
      <div className="container mx-auto px-4 mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">How We Generate Your Leads</h3>
            <p className="text-lg text-gray-600">
              Our AI-powered system reaches out to thousands of potential sellers across the country daily.
            </p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-8 md:p-12">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-sm font-bold text-brand-700">1</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered List Building</h4>
                  <p className="text-gray-600">
                    We've built advanced AI tools to quickly identify potential homeowners who may be interested in selling. Our process begins with creating comprehensive lists of property owners using multiple data sources.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-sm font-bold text-brand-700">2</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Multi-Channel Outreach</h4>
                  <p className="text-gray-600">
                    Our AI platform reaches out through multiple channels to determine if homeowners are interested in receiving offers or looking to sell. We contact thousands of potential sellers daily across the country.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-sm font-bold text-brand-700">3</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Qualification Process</h4>
                  <p className="text-gray-600">
                    Interested homeowners are asked a variety of questions to determine their timeframe, motivation, and the reality of their expectations. This ensures we only send you qualified, serious prospects.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-sm font-bold text-brand-700">4</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Immediate Lead Delivery</h4>
                  <p className="text-gray-600">
                    Once we're convinced they could be a good lead, we immediately connect them with investors and agents in their market. You receive fresh, exclusive leads as they're qualified.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16">
        <div className="bg-brand-50 border border-brand-100 rounded-lg p-8">
          <h3 className="text-2xl font-semibold mb-6 text-center text-brand-700">The LeadXclusive Advantage</h3>
          
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
            
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Lead Management Dashboard</h4>
                <p className="text-gray-600 mt-1">Track and manage all your leads in one convenient place.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-teal-700 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Flexible Area Selection</h4>
                <p className="text-gray-600 mt-1">Add multiple zip codes to expand your territory at any time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
