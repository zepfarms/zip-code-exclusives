
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
import { CheckCircle, XCircle } from 'lucide-react';

const ZipCodeChecker = () => {
  const [zipCode, setZipCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const navigate = useNavigate();

  // Function to check zip code availability
  const checkZipCodeAvailability = async (zip: string) => {
    setIsChecking(true);
    
    try {
      // Check if the zip code exists in our database
      const zipCodeQuery = await supabase
        .from('zip_codes')
        .select('available, zip_code')
        .eq('zip_code', zip)
        .maybeSingle();
      
      console.log("Zip code query result:", zipCodeQuery);
      
      if (zipCodeQuery.error) {
        console.error("Error checking zip code:", zipCodeQuery.error);
        throw zipCodeQuery.error;
      }

      // If zip code is found in the database
      if (zipCodeQuery.data) {
        // Use the available flag from the database
        setIsAvailable(zipCodeQuery.data.available ?? false);
      } else {
        // Zip code not found in database - assume it's available
        setIsAvailable(true);
      }
      
    } catch (error: any) {
      console.error("Error checking zip code:", error);
      toast.error("Failed to check zip code: " + (error.message || "Unknown error"));
      
      // Set default availability on error to avoid stuck UI
      setIsAvailable(true);
    } finally {
      setIsChecking(false);
    }
  };

  const handleCreateAccount = () => {
    localStorage.setItem('checkedZipCode', zipCode);
    // No longer storing lead type as we'll always use 'seller'
    navigate('/register', { state: { scrollToTop: true } });
  };

  const handlePurchaseZipCode = () => {
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

        {/* Only show results if we've checked availability */}
        {isAvailable !== null && (
          <div className="mt-6 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-lg mb-2">Zip Code {zipCode} Status</h3>
              
              <div className="flex items-center space-x-2 mb-4">
                {isAvailable ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      Available! This territory is open for exclusive leads.
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span className="font-medium text-red-800">
                      Not available. This territory is already claimed.
                    </span>
                  </>
                )}
              </div>
              
              {isAvailable && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="mb-4 text-sm text-gray-600">
                    This zip code is available! Create an account to claim this territory.
                  </p>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={handleCreateAccount}
                      className="w-full bg-brand-600 hover:bg-brand-700"
                    >
                      Create Account
                    </Button>
                    
                    <Button
                      onClick={handlePurchaseZipCode}
                      variant="outline"
                      className="w-full"
                    >
                      I Already Have an Account
                    </Button>
                  </div>
                </div>
              )}
              
              {!isAvailable && (
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
        We respect your privacy and never share your information.
      </CardFooter>
    </Card>
  );
};

export default ZipCodeChecker;
