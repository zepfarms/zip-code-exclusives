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
import ZipCodeForm from './ZipCodeForm';
import ZipAvailableSection from './ZipAvailableSection';
import ZipWaitlistSection from './ZipWaitlistSection';

type AvailabilityStatus = boolean | null;

const ZipCodeChecker = () => {
  const [zipCode, setZipCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [investorAvailable, setInvestorAvailable] = useState<AvailabilityStatus>(null);
  const [realtorAvailable, setRealtorAvailable] = useState<AvailabilityStatus>(null);
  const navigate = useNavigate();

  const checkZipCodeAvailability = async (zip: string) => {
    const cleanZip = zip.trim();
    console.log("Checking zip:", cleanZip);
    setIsChecking(true);

    try {
      const { data, error } = await supabase
        .from('zip_codes')
        .select('available')
        .eq('zip_code', cleanZip)
        .maybeSingle();

      console.log("Zip check result:", data, error);

      if (error && error.code !== 'PGRST116') {
        toast.error("Failed to check zip code: " + error.message);
        setInvestorAvailable(true);
        setRealtorAvailable(true);
      } else {
        const isAvailable = data?.available ?? false;
        console.log("Is available:", isAvailable);
        setInvestorAvailable(isAvailable);
        setRealtorAvailable(isAvailable);
      }
    } catch (error: any) {
      console.error("Error checking zip code:", error);
      toast.error("Failed to check zip code: " + (error.message || "Unknown error"));
      setInvestorAvailable(true);
      setRealtorAvailable(true);
    } finally {
      setIsChecking(false);
    }
  };

  const handleClaimArea = (leadType: string) => {
    localStorage.setItem('checkedZipCode', zipCode);
    localStorage.setItem('preferredLeadType', leadType);
    navigate('/register', { state: { scrollToTop: true } });
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
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
