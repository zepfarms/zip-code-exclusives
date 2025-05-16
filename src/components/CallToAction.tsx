
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <div className="py-16 hero-gradient text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Secure Your Exclusive Territory?
        </h2>
        <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
          Check if your desired zip code is available and start receiving qualified leads with no competition.
        </p>
        <Link to="/check-availability">
          <Button className="px-8 py-6 text-lg bg-white text-brand-700 hover:bg-gray-100 group">
            Check Zip Code Availability
            <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CallToAction;
