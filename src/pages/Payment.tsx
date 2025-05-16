
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { CircleX, Loader } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const zipCode = location.state?.zipCode || new URLSearchParams(location.search).get('zip_code') || 'your selected area';

  // Check if zipCode is valid (5-digit number)
  const isValidZipCode = /^\d{5}$/.test(zipCode);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to continue");
        navigate('/login', { state: { redirectTo: '/payment', zipCode } });
        return;
      }

      // Call Stripe checkout function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { zipCode }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to process payment: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Complete Your Purchase</CardTitle>
            <CardDescription>
              {isValidZipCode 
                ? `Secure exclusive rights to receive all leads in zip code ${zipCode}`
                : "Complete your subscription purchase"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Exclusive Territory Access:</span>
                <span>Zip Code {zipCode}</span>
              </div>
              <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                <span className="font-medium">Monthly Subscription:</span>
                <span>$199.00</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Today:</span>
                <span>$0.00</span>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Your subscription will begin with a 7-day free trial. You can cancel anytime before the trial ends.
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={handlePayment} 
                className="w-full bg-accent-600 hover:bg-accent-700 py-6"
                disabled={isLoading || !isValidZipCode}
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Start Your 7-Day Free Trial
                  </>
                )}
              </Button>
              
              <div className="flex items-center justify-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 h-4 w-4">
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
                <p className="text-xs text-gray-500">
                  Secure payment processing with Stripe
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-gray-500 text-center">
            By completing your purchase, you agree to our Terms of Service and Privacy Policy.
            Your subscription will automatically renew each month (at $199/month) after the 7-day trial.
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Payment;
