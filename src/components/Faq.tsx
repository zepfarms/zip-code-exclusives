
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faq = () => {
  const faqs = [
    {
      question: "How do you get your leads?",
      answer: "We use AI technology to contact thousands of potential sellers each day. When a seller shows interest and is vetted, we immediately forward that lead to you. Our AI platform reaches out to homeowners through multiple channels to determine their interest in selling and qualify their expectations."
    },
    {
      question: "How many leads can I expect each month?",
      answer: "Lead volume varies by location and market conditions. On average, clients receive 5-10 qualified leads per month per zip code. Some high-demand areas may generate more leads, while others might produce fewer but higher-quality opportunities."
    },
    {
      question: "Can I select multiple zip codes?",
      answer: "Yes! You can secure as many zip codes as you'd like, provided they're available. Each additional zip code is $199/month. You can add or remove zip codes from your account at any time through your dashboard."
    },
    {
      question: "How do you verify leads are legitimate?",
      answer: "We use a multi-step verification process that includes phone verification, property ownership confirmation, and intent qualification. Every lead is screened to ensure they're serious about selling and that the contact information is valid."
    },
    {
      question: "What happens if I want to cancel?",
      answer: "You can cancel your subscription to any zip code at any time through your dashboard. You'll maintain access until the end of your current billing period, and won't be charged again. We don't offer refunds for partial months."
    },
    {
      question: "Are there any long-term contracts?",
      answer: "No, our service is month-to-month with no contracts. You pay $199 per month per zip code and can cancel anytime. However, most clients stay with us long-term due to the quality and exclusivity of our leads."
    },
    {
      question: "What if no leads come in for my area?",
      answer: "While we can't guarantee specific lead volumes (real estate markets fluctuate), if you receive zero leads in a 30-day period, contact our customer service. We'll work with you to either focus on more productive areas or make appropriate accommodations."
    },
    {
      question: "How quickly will I receive leads after signing up?",
      answer: "After signing up, we have a 7-day setup period during which we configure your account and lead delivery preferences. After this setup period, you'll begin receiving leads as they come in for your area."
    },
    {
      question: "Can I change my notification preferences?",
      answer: "Absolutely! Through your dashboard, you can update your notification preferences at any time, choosing to receive leads via email, text message, or both. You can also adjust notification frequency if needed."
    }
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our exclusive lead generation service.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Faq;
