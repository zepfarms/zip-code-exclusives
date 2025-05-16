
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ZipCodeChecker = () => {
  const [zipCode, setZipCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);
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
    } catch (error) {
      console.error("Error checking zip code:", error);
      toast.error("Failed to check zip code: " + (error.message || "Unknown error"));
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!zipCode || zipCode.length !== 5 || !/^\d+$/.test(zipCode)) {
      toast.error("Please enter a valid 5-digit zip code");
      return;
    }
    
    checkZipCodeAvailability(zipCode);
  };

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!waitlistEmail || !/\S+@\S+\.\S+/.test(waitlistEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmittingWaitlist(true);
    
    try {
      // Add to waitlist table in Supabase
      const { error } = await supabase
        .from('waitlist')
        .insert({
          email: waitlistEmail,
          zip_code: zipCode
        });
        
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("You've been added to the waitlist!");
      setWaitlistEmail('');
    } catch (error) {
      console.error("Error joining waitlist:", error);
      toast.error("Failed to join waitlist: " + (error.message || "Unknown error"));
    } finally {
      setIsSubmittingWaitlist(false);
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
              Enter Zip Code
            </label>
            <Input
              id="zipCode"
              placeholder="e.g. 90210"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full"
              maxLength={5}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-brand-700 hover:bg-brand-800"
            disabled={isChecking}
          >
            {isChecking ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              'Check Availability'
            )}
          </Button>
        </form>

        {isAvailable === true && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="font-bold text-green-800">
              Congratulations! This area is available!
            </h3>
            <p className="mt-2 text-green-700">
              You can claim exclusive rights to leads in this zip code for just $199/month.
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
        )}

        {isAvailable === false && (
          <div className="mt-6">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <h3 className="font-bold text-amber-800">
                This area is already taken
              </h3>
              <p className="mt-2 text-amber-700">
                Would you like to join the waitlist for this zip code?
              </p>
            </div>
            
            <form onSubmit={handleJoinWaitlist} className="mt-4 space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="waitlistEmail" className="text-sm font-medium text-gray-700">
                  Your Email
                </label>
                <Input
                  id="waitlistEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button 
                type="submit" 
                variant="outline"
                className="w-full border-teal-700 text-teal-700 hover:bg-teal-50"
                disabled={isSubmittingWaitlist}
              >
                {isSubmittingWaitlist ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Join Waitlist'
                )}
              </Button>
            </form>
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
