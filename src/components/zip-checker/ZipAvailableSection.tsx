
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ZipAvailableSectionProps {
  zipCode: string;
  handleClaimArea: () => void;
}

const ZipAvailableSection = ({ zipCode, handleClaimArea }: ZipAvailableSectionProps) => {
  return (
    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
      <h3 className="font-bold text-green-800">
        Congratulations! This area is available!
      </h3>
      <p className="mt-2 text-green-700">
        You can claim exclusive rights to leads in this zip code for just $199/month.
      </p>
      <p className="mt-1 text-sm text-green-600">
        Initial payment today. Your first leads will be delivered in 7 days.
      </p>
      <div className="mt-4">
        <Button 
          className="w-full bg-accent-600 hover:bg-accent-700"
          onClick={handleClaimArea}
        >
          Claim This Area Now
        </Button>
      </div>
    </div>
  );
};

export default ZipAvailableSection;
