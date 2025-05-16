
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { supabase } from '@/integrations/supabase/client';
import { Loader } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  
  // Get zip code and session ID from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const zipCode = searchParams.get('zip_code');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const saveTerritory = async () => {
      try {
        if (!zipCode || !sessionId) {
          throw new Error("Missing required parameters");
        }

        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Please sign in to continue");
          navigate('/login', { state: { redirectTo: '/payment-success', zipCode } });
          return;
        }

        const userId = session.user.id;

        // First, update the zip code in the zip_codes table to mark it as unavailable
        const { error: zipCodeError } = await supabase
          .from('zip_codes')
          .update({ is_available: false })
          .eq('code', zipCode);

        if (zipCodeError) {
          console.error("Error updating zip code:", zipCodeError);
          toast.error("Failed to reserve your territory: " + zipCodeError.message);
          return;
        }

        // Calculate leads start date (7 days from now)
        const leadsStartDate = new Date();
        leadsStartDate.setDate(leadsStartDate.getDate() + 7);
        
        // Calculate next billing date (37 days from now = 7 days wait + 30 days service)
        const nextBillingDate = new Date();
        nextBillingDate.setDate(nextBillingDate.getDate() + 37);

        // Then, create a new territory for the user
        const { error: territoryError } = await supabase
          .from('territories')
          .insert({
            zip_code: zipCode,
            user_id: userId,
            active: true,
            start_date: leadsStartDate.toISOString(),
            next_billing_date: nextBillingDate.toISOString()
          });

        if (territoryError) {
          console.error("Error creating territory:", territoryError);
          toast.error("Failed to save your territory: " + territoryError.message);
          return;
        }

        // Update user profile with Stripe customer ID if not done already
        // This would typically be handled by a webhook, but for now we'll just update it here
        
        toast.success("Your territory has been successfully secured!");
        setIsProcessing(false);
      } catch (error) {
        console.error("Error processing payment success:", error);
        toast.error("An error occurred: " + (error.message || "Unknown error"));
        setIsProcessing(false);
      }
    };

    saveTerritory();
  }, [zipCode, sessionId, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>
              Thank you for subscribing to our exclusive lead generation service
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader className="h-12 w-12 animate-spin text-brand-600 mb-4" />
                <p>Processing your subscription...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="48" 
                    height="48" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-green-600 mx-auto mb-4"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    Your Territory Is Secured!
                  </h3>
                  <p className="text-green-700">
                    You now have exclusive rights to all leads in zip code <span className="font-bold">{zipCode}</span>.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium mb-2">Subscription Details:</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex justify-between">
                        <span>Territory:</span>
                        <span className="font-medium">Zip Code {zipCode}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>First Leads Delivery:</span>
                        <span className="font-medium">{new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString()}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Monthly Subscription:</span>
                        <span className="font-medium">$199.00</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Next Billing Date:</span>
                        <span className="font-medium">
                          {new Date(new Date().setDate(new Date().getDate() + 37)).toLocaleDateString()}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <Link to="/dashboard">
                    <Button className="w-full bg-brand-600 hover:bg-brand-700">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-sm text-gray-500 text-center">
            If you have any questions, please contact our support team.
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
