
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LeadTypes = () => {
  const leadTypes = [
    {
      title: "Seller Leads",
      description: "Perfect for real estate professionals looking for exclusive seller leads in their territory.",
      features: [
        "Motivated sellers actively looking to sell their property",
        "Properties ranging from distressed homes to well-maintained listings",
        "Sellers open to various transaction types",
        "Opportunity for investors and agents alike",
        "Exclusive Territory"
      ],
      cta: "Perfect For All Real Estate Professionals",
      link: "/seller-leads"
    }
  ];

  return (
    <section className="py-12 bg-gray-50" id="lead-types">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Exclusive Seller Lead Generation</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer premium real estate seller leads with exclusive zip code territories to increase your closing rate.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {leadTypes.map((type, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-2xl font-semibold mb-3 text-brand-700">{type.title}</h3>
                <p className="text-gray-600 mb-6">{type.description}</p>
                
                <ul className="space-y-3">
                  {type.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-5 w-5 text-accent-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadTypes;
