
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LeadTypes = () => {
  const leadTypes = [
    {
      title: "Investor Leads",
      description: "Perfect for real estate investors looking for off-market properties to wholesale or flip.",
      features: [
        "Motivated sellers looking for quick cash offers",
        "Properties that may need repairs or renovations",
        "Sellers wanting to avoid the traditional listing process",
        "Potential for significant ROI on purchases"
      ],
      cta: "Perfect For Real Estate Investors",
      link: "/investor-leads"
    },
    {
      title: "Realtor Leads",
      description: "Ideal for real estate agents seeking homeowners ready to list their property on the MLS.",
      features: [
        "Homeowners planning to sell in the traditional market",
        "Sellers looking for full market value for their home",
        "Clients who need agent representation and guidance",
        "Opportunity for listing and potentially buyer commissions"
      ],
      cta: "Perfect For Licensed Real Estate Agents",
      link: "/realtor-leads"
    }
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Lead Type</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer two distinct types of real estate leads to match your business strategy and goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {leadTypes.map((type, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-2xl font-semibold mb-3 text-brand-700">{type.title}</h3>
                <p className="text-gray-600 mb-6">{type.description}</p>
                
                <ul className="space-y-3">
                  {type.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-5 w-5 text-accent-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-6 bg-gray-50">
                <div className="text-sm font-medium text-gray-500 mb-3">{type.cta}</div>
                <Link to={type.link}>
                  <Button className="w-full bg-accent-600 hover:bg-accent-700 group">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadTypes;
