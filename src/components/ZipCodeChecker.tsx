
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ZipCodeForm from './zip-checker/ZipCodeForm';
import ZipAvailableSection from './zip-checker/ZipAvailableSection';
import ZipWaitlistSection from './zip-checker/ZipWaitlistSection';

const ZipCodeChecker = () => {
  const [zipCode, setZipCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [investorAvailable, setInvestorAvailable] = useState<boolean | null>(null);
  const [realtorAvailable, setRealtorAvailable] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const checkZipCodeAvailability = async (zip: string) => {
    setIsChecking(true);
    
    try {
      // First check if the zip code exists in our database for investor leads
      const { data: investorData, error: investorError } = await supabase
        .from('zip_codes')
        .select('is_available')
        .eq('code', zip)
        .single();

      // If we got an error fetching the zip code data
      if (investorError) {
        if (investorError.code === 'PGRST116') {
          // ZIP code not found in database
          // We'll assume it's available since it doesn't exist yet
          setInvestorAvailable(true);
        } else {
          console.error("Error checking zip code:", investorError);
          toast.error("Failed to check zip code: " + investorError.message);
          setInvestorAvailable(null);
        }
      } else {
        // ZIP code found, check availability
        setInvestorAvailable(investorData?.is_available ?? false);
      }
      
      // For demo purposes, we'll set realtor availability the same as investor
      // In a real app, you would check this separately
      setRealtorAvailable(investorAvailable);
      
    } catch (error: any) {
      console.error("Error checking zip code:", error);
      toast.error("Failed to check zip code: " + (error.message || "Unknown error"));
    } finally {
      setIsChecking(false);
    }
  };

  const handleClaimArea = (leadType: string) => {
    navigate('/register', { state: { zipCode, leadType } });
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
          <ZipAvailableSection 
            zipCode={zipCode} 
            investorAvailable={investorAvailable}
            realtorAvailable={realtorAvailable}
            handleClaimArea={handleClaimArea} 
          />
        )}

        {investorAvailable === false && realtorAvailable === false && (
          <ZipWaitlistSection zipCode={zipCode} />
        )}
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-gray-500">
        We respect your privacy and will never share your information.
      </CardFooter>
    </Card>
  );
};

export default ZipCodeChecker;
