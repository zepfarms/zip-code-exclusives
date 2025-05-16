
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

const ZipCodeChecker = () => {
  const [zipCode, setZipCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);

  // This is a mock function. In production, this would check against your database
  const checkZipCodeAvailability = (zip: string) => {
    // For demo purposes, we'll just use random availability
    // In production, you'd check against your database
    setIsChecking(true);
    
    setTimeout(() => {
      // For demo purposes: Zip codes starting with even numbers are available
      const isZipAvailable = parseInt(zip[0]) % 2 === 0;
      setIsAvailable(isZipAvailable);
      setIsChecking(false);
    }, 1000);
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

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!waitlistEmail || !/\S+@\S+\.\S+/.test(waitlistEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmittingWaitlist(true);
    
    // In production, you would send this to your backend
    setTimeout(() => {
      setIsSubmittingWaitlist(false);
      toast.success("You've been added to the waitlist!");
      setWaitlistEmail('');
    }, 1000);
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
            {isChecking ? 'Checking...' : 'Check Availability'}
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
              <Button className="w-full bg-accent-600 hover:bg-accent-700">
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
                {isSubmittingWaitlist ? 'Submitting...' : 'Join Waitlist'}
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
