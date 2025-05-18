
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

const ZipCodeChecker = () => {
  const [zipCode, setZipCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [investorAvailable, setInvestorAvailable] = useState<boolean | null>(null);
  const [realtorAvailable, setRealtorAvailable] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const checkZipCodeAvailability = async (zip: string) => {
    setIsChecking(true);
    
    try {
      // Fetch investor data first
      const investorResult = await supabase
        .from('zip_codes')
        .select('is_available')
        .eq('code', zip)
        .eq('lead_type', 'investor')
        .single();

      // Fetch realtor data separately
      const realtorResult = await supabase
        .from('zip_codes')
        .select('is_available')
        .eq('code', zip)
        .eq('lead_type', 'agent')
        .single();

      // Process investor availability
      const investorData = investorResult.data;
      const investorError = investorResult.error;
      
      if (investorError) {
        if (investorError.code === 'PGRST116') {
          // Not found in database
          setInvestorAvailable(true);
        } else {
          console.error("Error checking investor zip:", investorError);
          setInvestorAvailable(null);
        }
      } else {
        // Data found, use it
        setInvestorAvailable(investorData?.is_available ?? false);
      }

      // Process realtor availability 
      const realtorData = realtorResult.data;
      const realtorError = realtorResult.error;
      
      if (realtorError) {
        if (realtorError.code === 'PGRST116') {
          // Not found in database
          setRealtorAvailable(true);
        } else {
          console.error("Error checking realtor zip:", realtorError);
          setRealtorAvailable(null);
        }
      } else {
        // Data found, use it
        setRealtorAvailable(realtorData?.is_available ?? false);
      }
      
      // Handle demo case - both not in database
      if (investorError?.code === 'PGRST116' && realtorError?.code === 'PGRST116') {
        setInvestorAvailable(true);
        setRealtorAvailable(true);
      }
    } catch (error: any) {
      console.error("Error checking zip code:", error);
      toast.error("Failed to check zip code: " + (error.message || "Unknown error"));
      // Set fallback values for both
      setInvestorAvailable(true);
      setRealtorAvailable(true);
    } finally {
      setIsChecking(false);
    }
  };

  const handleClaimArea = (leadType: string) => {
    // Store the zip code in localStorage for later use
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
