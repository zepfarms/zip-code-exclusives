
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

// Define explicit types for our state to avoid deep instantiation
type AvailabilityState = boolean | null;

const ZipCodeChecker = () => {
  const [zipCode, setZipCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [investorAvailable, setInvestorAvailable] = useState<AvailabilityState>(null);
  const [realtorAvailable, setRealtorAvailable] = useState<AvailabilityState>(null);
  const navigate = useNavigate();

  // Function to check zip code availability
  const checkZipCodeAvailability = async (zip: string) => {
    setIsChecking(true);
    
    try {
      // Modified query - removed lead_type filter since the column doesn't exist
      const zipCodeQuery = await supabase
        .from('zip_codes')
        .select('is_available, code')
        .eq('code', zip)
        .maybeSingle();
      
      console.log("Zip code query result:", zipCodeQuery);
      
      if (zipCodeQuery.error) {
        console.error("Error checking zip code:", zipCodeQuery.error);
        throw zipCodeQuery.error;
      }

      // If zip code is found in the database
      if (zipCodeQuery.data) {
        // For now, we'll use the same availability status for both investor and realtor
        // Since we don't have a lead_type column to differentiate
        const isAvailable = zipCodeQuery.data.is_available ?? false;
        setInvestorAvailable(isAvailable);
        setRealtorAvailable(isAvailable);
      } else {
        // Zip code not found in database - assume it's available
        setInvestorAvailable(true);
        setRealtorAvailable(true);
      }
      
    } catch (error: any) {
      console.error("Error checking zip code:", error);
      toast.error("Failed to check zip code: " + (error.message || "Unknown error"));
      
      // Set default availability on error to avoid stuck UI
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

  // Determine availability with explicit boolean comparison
  const atLeastOneAvailable = investorAvailable === true || realtorAvailable === true;
  const noneAvailable = investorAvailable === false && realtorAvailable === false;
  
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
              
              {atLeastOneAvailable && (
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
              
              {noneAvailable && (
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
