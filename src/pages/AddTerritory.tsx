
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ZipCodeForm from '@/components/zip-checker/ZipCodeForm';
import ZipAvailableSection from '@/components/zip-checker/ZipAvailableSection';
import ZipWaitlistSection from '@/components/zip-checker/ZipWaitlistSection';
import { supabase } from '@/integrations/supabase/client';

const AddTerritory = () => {
  const [zipCode, setZipCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const checkZipCodeAvailability = async (zip: string) => {
    setIsChecking(true);
    
    try {
      // First check if the user is logged in
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("You must be logged in to add a territory");
        navigate('/login');
        return;
      }

      // Check if the zip code exists in our database
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Add New Territory</h1>
          <p className="text-gray-600 mb-8">
            Enter a zip code to check availability and add it to your exclusive territories.
          </p>
          
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Check Zip Code Availability</CardTitle>
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
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AddTerritory;
