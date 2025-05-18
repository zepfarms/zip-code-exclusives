
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

interface ZipAvailableSectionProps {
  zipCode: string;
  investorAvailable: boolean | null;
  realtorAvailable: boolean | null;
  handleClaimArea: (leadType: string) => void;
}

const ZipAvailableSection = ({ 
  zipCode, 
  investorAvailable, 
  realtorAvailable, 
  handleClaimArea 
}: ZipAvailableSectionProps) => {
  
  const navigate = useNavigate();
  const atLeastOneAvailable = investorAvailable || realtorAvailable;
  
  const handleCreateAccount = () => {
    navigate('/register', { state: { scrollToTop: true } });
  };
  
  if (!atLeastOneAvailable) {
    return null;
  }
  
  return (
    <div className="mt-6 space-y-4">
      <h3 className="font-bold text-xl text-center">Available Lead Types in {zipCode}</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* Investor Lead Card */}
        <div className={`p-4 rounded-md border ${investorAvailable ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center mb-2">
            {investorAvailable ? (
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <h4 className={`font-semibold ${investorAvailable ? 'text-green-800' : 'text-gray-700'}`}>Investor Leads</h4>
          </div>
          
          <p className="text-sm mb-3">
            {investorAvailable 
              ? "Available for exclusive access! Perfect for real estate investors looking for off-market properties." 
              : "This territory is already claimed for investor leads."}
          </p>
        </div>

        {/* Realtor Lead Card */}
        <div className={`p-4 rounded-md border ${realtorAvailable ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center mb-2">
            {realtorAvailable ? (
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <h4 className={`font-semibold ${realtorAvailable ? 'text-green-800' : 'text-gray-700'}`}>Realtor Leads</h4>
          </div>
          
          <p className="text-sm mb-3">
            {realtorAvailable 
              ? "Available for exclusive access! Ideal for real estate agents seeking homeowners ready to list." 
              : "This territory is already claimed for real estate agent leads."}
          </p>
        </div>
      </div>

      {atLeastOneAvailable && (
        <div className="mt-4 py-4 border-t border-gray-200">
          <p className="text-center mb-4 text-gray-600">
            Create an account to access available territories in your dashboard.
          </p>
          
          <Button 
            className="w-full bg-accent-600 hover:bg-accent-700"
            onClick={handleCreateAccount}
          >
            Create Account
          </Button>
        </div>
      )}

      {!atLeastOneAvailable && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-center text-gray-700">
            Sorry, both lead types are already claimed for this zip code. 
            Check another zip code or join our waitlist.
          </p>
        </div>
      )}
    </div>
  );
};

export default ZipAvailableSection;
