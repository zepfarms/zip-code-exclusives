
import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Since claiming my zip code, I've received 5-7 qualified leads per month. Two of these converted into deals, generating over $30,000 in profit.",
      author: "Michael R.",
      role: "Real Estate Investor",
      location: "Phoenix, AZ"
    },
    {
      quote: "The exclusivity is what makes this service worth every penny. Being the only agent receiving leads in my area has dramatically increased my conversion rate.",
      author: "Sarah T.",
      role: "Licensed Realtor",
      location: "Dallas, TX"
    },
    {
      quote: "I've tried other lead generation services, but the quality of leads from LeadXclusive is unmatched. These are genuinely motivated sellers.",
      author: "David W.",
      role: "Property Flipper",
      location: "Chicago, IL"
    }
  ];

  return (
    <div className="py-16 bg-brand-700 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Hear from clients who are experiencing results with our exclusive lead generation system.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20"
            >
              <svg className="h-8 w-8 text-accent-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="mb-4 italic">{testimonial.quote}</p>
              <div>
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-sm opacity-80">{testimonial.role}, {testimonial.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
