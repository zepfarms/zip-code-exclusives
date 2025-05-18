
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import ZipCodeForm from './zip-checker/ZipCodeForm';
import { Button } from './ui/button';

const ZipCodeChecker = () => {
  const [zipCode, setZipCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [investorAvailable, setInvestorAvailable] = useState<boolean | null>(null);
  const [realtorAvailable, setRealtorAvailable] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const checkZipCodeAvailability = async (zip: string) => {
    setIsChecking(true);
    
    try {
      // Check for investor lead availability
      const { data: investorData, error: investorError } = await supabase
        .from('zip_codes')
        .select('is_available')
        .eq('code', zip)
        .eq('lead_type', 'investor')
        .single();

      // Check for realtor lead availability 
      const { data: realtorData, error: realtorError } = await supabase
        .from('zip_codes')
        .select('is_available')
        .eq('code', zip)
        .eq('lead_type', 'agent')
        .single();

      // Handle investor lead availability
      if (investorError) {
        if (investorError.code === 'PGRST116') {
          // ZIP code not found in database for this type
          setInvestorAvailable(true);
        } else {
          console.error("Error checking investor zip:", investorError);
          setInvestorAvailable(null);
        }
      } else {
        // ZIP code found, check availability
        setInvestorAvailable(investorData?.is_available ?? false);
      }

      // Handle realtor lead availability
      if (realtorError) {
        if (realtorError.code === 'PGRST116') {
          // ZIP code not found in database for this type
          setRealtorAvailable(true);
        } else {
          console.error("Error checking realtor zip:", realtorError);
          setRealtorAvailable(null);
        }
      } else {
        // ZIP code found, check availability
        setRealtorAvailable(realtorData?.is_available ?? false);
      }
      
      // Set default values when no data exists, using direct check on variables rather than state
      const noInvestorData = !investorData && investorError?.code === 'PGRST116';
      const noRealtorData = !realtorData && realtorError?.code === 'PGRST116';
      
      if (noInvestorData && noRealtorData) {
        setInvestorAvailable(true);
        setRealtorAvailable(true);
      }
    } catch (error: any) {
      console.error("Error checking zip code:", error);
      toast.error("Failed to check zip code: " + (error.message || "Unknown error"));
      // For demo/fallback, set both available
      setInvestorAvailable(true);
      setRealtorAvailable(true);
    } finally {
      setIsChecking(false);
    }
  };

  const handleCreateAccount = () => {
    localStorage.setItem('checkedZipCode', zipCode);
    navigate('/register', { state: { scrollToTop: true } });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Check Zip Code Availability</CardTitle>
        <CardDescription>
          See if your desired area is available for exclusive leads
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ZipCodeForm 
          zipCode={zipCode} 
          setZipCode={setZipCode}
          onSubmit={checkZipCodeAvailability}
          isChecking={isChecking}
        />

        {(investorAvailable !== null || realtorAvailable !== null) && (
          <div className="mt-6 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-lg mb-2">Zip Code {zipCode} Status</h3>
              
              <div className="space-y-4">
                {investorAvailable !== null && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Investor Leads:</span>
                    {investorAvailable ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Not Available
                      </span>
                    )}
                  </div>
                )}
                
                {realtorAvailable !== null && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Realtor Leads:</span>
                    {realtorAvailable ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Not Available
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {(investorAvailable || realtorAvailable) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="mb-4 text-sm text-gray-600">
                    This zip code is available! Create an account to claim this territory.
                  </p>
                  
                  <Button
                    onClick={handleCreateAccount}
                    className="w-full bg-brand-600 text-white rounded hover:bg-brand-700 transition-colors"
                  >
                    Create Account
                  </Button>
                </div>
              )}
              
              {!investorAvailable && !realtorAvailable && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-amber-700">
                    This zip code is currently claimed. Join our waitlist to be notified when it becomes available.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-gray-500">
        We respect your privacy and will never share your information.
      </CardFooter>
    </Card>
  );
};

export default ZipCodeChecker;
