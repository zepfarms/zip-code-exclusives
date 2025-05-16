
import React from 'react';
import { useLocation } from 'react-router-dom';
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
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Payment = () => {
  const location = useLocation();
  const zipCode = location.state?.zipCode || 'your selected area';

  const handlePayment = () => {
    toast.info("Stripe integration will be added with Supabase setup");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Complete Your Purchase</CardTitle>
            <CardDescription>
              Secure exclusive rights to receive all leads in zip code {zipCode}
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
                <span>$199.00</span>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Your subscription will begin after a 7-day setup period. You can cancel anytime.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-center text-gray-600 mb-4">
                Payment processing will be implemented with Stripe integration. For now, this is a placeholder.
              </p>
              
              <Button 
                onClick={handlePayment} 
                className="w-full bg-accent-600 hover:bg-accent-700 py-6"
              >
                Complete Payment - $199.00
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
            Your subscription will automatically renew each month until canceled.
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Payment;
