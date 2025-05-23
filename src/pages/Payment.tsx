
import React, { useState, useEffect } from 'react';
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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [user, setUser] = useState<any>(null);
  const zipCode = location.state?.zipCode || new URLSearchParams(location.search).get('zip_code') || 'your selected area';

  // Check if zipCode is valid (5-digit number)
  const isValidZipCode = /^\d{5}$/.test(zipCode);

  // Check auth status on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Store current path and parameters for redirect after login
          localStorage.setItem('redirectAfterAuth', JSON.stringify({
            path: '/payment',
            state: { zipCode }
          }));
          
          // If not authenticated, redirect to registration
          toast.info("Please create an account to continue with your purchase");
          navigate('/register', { 
            state: { 
              zipCode, 
              redirectTo: '/payment' 
            },
            replace: true // Use replace instead of push to avoid browser history issues
          });
        } else {
          // User is authenticated, set the user
          setUser(session.user);
          setIsCheckingAuth(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [zipCode, navigate]);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.info("Please sign in to continue");
        navigate('/register', { state: { redirectTo: '/payment', zipCode } });
        return;
      }

      // Save zipCode to localStorage to use after successful payment
      localStorage.setItem('lastZipCode', zipCode);
      console.log("Saved to localStorage:", zipCode);
      
      // Call Stripe checkout function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { zipCode, leadType: 'investor' }
      });

      if (error) {
        console.error("Payment error:", error);
        throw new Error(error.message || "Failed to create checkout");
      }

      // Redirect to Stripe checkout
      if (data?.url) {
        console.log("Redirecting to checkout URL:", data.url);
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error("Failed to process payment: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-brand-600" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Complete Your Purchase</CardTitle>
            <CardDescription>
              {isValidZipCode 
                ? `Secure exclusive rights to receive seller leads in zip code ${zipCode}`
                : "Complete your subscription purchase"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Exclusive Territory Access:</span>
                <span>Zip Code {zipCode}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Lead Type:</span>
                <span>Seller Leads</span>
              </div>
              <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                <span className="font-medium">Territory Fee:</span>
                <span>$1.00</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Today:</span>
                <span>$1.00</span>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-sm text-blue-700">
                <p className="font-medium mb-1">Important Information:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Your subscription begins immediately after payment.</li>
                  <li>First leads will be delivered in 7 days.</li>
                  <li>This is a test payment of $1.00.</li>
                </ul>
              </div>
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
                    Pay $1.00 Now (Test Payment)
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
            This is a test payment of $1.00 for development purposes.
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Payment;
