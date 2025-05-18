
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PaymentSuccess = () => {
  const [countdown, setCountdown] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();
  
  // Automatically redirect to dashboard after checking auth
  useEffect(() => {
    const checkAuth = async () => {
      // Get session data
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUserData(session.user);
        setIsLoading(false);
        
        // Start countdown
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate('/dashboard');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return () => clearInterval(timer);
      } else {
        // If not logged in, redirect to login
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your subscription has been activated and your exclusive territory is now secured.
          </p>
          
          {isLoading ? (
            <div className="flex items-center justify-center mb-6">
              <Loader className="h-6 w-6 animate-spin text-brand-600 mr-2" />
              <span className="text-gray-600">Setting up your account...</span>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Redirecting you to your dashboard in {countdown} seconds...
              </p>
              
              <Button 
                onClick={handleGoToDashboard}
                className="bg-brand-600 hover:bg-brand-700 px-8 py-3"
              >
                Go to Dashboard Now
              </Button>
            </>
          )}
          
          <div className="mt-10 p-4 bg-blue-50 border border-blue-100 rounded-md text-left">
            <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
            <ul className="space-y-2 text-blue-700 text-sm">
              <li className="flex">
                <span className="mr-2">1.</span>
                <span>Your account has been set up and your exclusive territory has been reserved.</span>
              </li>
              <li className="flex">
                <span className="mr-2">2.</span>
                <span>Our team will start sourcing leads for you immediately.</span>
              </li>
              <li className="flex">
                <span className="mr-2">3.</span>
                <span>You'll receive your first leads within 7 days.</span>
              </li>
              <li className="flex">
                <span className="mr-2">4.</span>
                <span>You can customize your notification preferences in your dashboard.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
