
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
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const checkZipCodeAvailability = async (zip: string) => {
    setIsChecking(true);
    
    try {
      // First check if the zip code exists in our database
      const { data: zipCodeData, error: zipCodeError } = await supabase
        .from('zip_codes')
        .select('is_available')
        .eq('code', zip)
        .single();

      if (zipCodeError) {
        if (zipCodeError.code === 'PGRST116') {
          // ZIP code not found in database
          // We'll add it as available through a public insert
          const { error: insertError } = await supabase
            .from('zip_codes')
            .insert({ code: zip, is_available: true });
            
          if (insertError) {
            throw new Error(insertError.message);
          }
          
          setIsAvailable(true);
        } else {
          throw new Error(zipCodeError.message);
        }
      } else {
        // ZIP code found, check availability
        setIsAvailable(zipCodeData.is_available);
      }
    } catch (error: any) {
      console.error("Error checking zip code:", error);
      toast.error("Failed to check zip code: " + (error.message || "Unknown error"));
    } finally {
      setIsChecking(false);
    }
  };

  const handleClaimArea = () => {
    navigate('/payment', { state: { zipCode } });
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

        {isAvailable === true && (
          <ZipAvailableSection zipCode={zipCode} handleClaimArea={handleClaimArea} />
        )}

        {isAvailable === false && (
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
