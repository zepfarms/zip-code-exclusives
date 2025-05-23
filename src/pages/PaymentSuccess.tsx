
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ensureUserProfile } from '@/utils/userProfile';

const PaymentSuccess = () => {
  const [countdown, setCountdown] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [territoryCreated, setTerritoryCreated] = useState(false);
  const [territoryCreationError, setTerritoryCreationError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract query parameters from URL
  const queryParams = new URLSearchParams(location.search);
  const zipCode = queryParams.get('zip_code');
  const leadType = queryParams.get('lead_type') || 'investor'; // Default to investor if not specified
  
  // Automatically redirect to dashboard after checking auth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Processing payment success with zip code:", zipCode, "and lead type:", leadType);
        
        // Get session data
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUserData(session.user);
          
          // Ensure user profile exists - use Service Role key in edge function to bypass RLS issues
          try {
            // Instead of directly calling ensureUserProfile, use a more reliable approach
            const { data: profileData, error: profileError } = await supabase.functions.invoke('ensure-profile', {
              body: { userId: session.user.id }
            });
            
            if (profileError) {
              console.error("Error from ensure-profile function:", profileError);
            } else {
              console.log("Profile ensured successfully:", profileData);
            }
          } catch (profileError) {
            console.error("Failed to ensure user profile:", profileError);
          }
          
          // If we have a zip code from query params, create the territory
          if (zipCode) {
            try {
              console.log("Creating territory with zip:", zipCode, "and lead type:", leadType);
              
              const { data: territoryData, error: territoryError } = await supabase.functions.invoke('create-territory', {
                body: { 
                  zipCode, 
                  userId: session.user.id, 
                  leadType: leadType 
                }
              });
              
              if (territoryError) {
                console.error("Error creating territory via function:", territoryError);
                setTerritoryCreationError(territoryError.message || "Unknown error");
                throw new Error(territoryError.message);
              } else {
                console.log("Territory created successfully:", territoryData);
                setTerritoryCreated(true);
                toast.success(`Territory ${zipCode} added successfully!`);
                
                // Save territory data to sessionStorage for immediate access
                sessionStorage.setItem('justCreatedTerritory', JSON.stringify({
                  zip_code: zipCode,
                  lead_type: leadType,
                  timestamp: new Date().toISOString()
                }));
              }
            } catch (error: any) {
              console.error("Error processing payment success:", error);
              setTerritoryCreationError(error.message || "Unknown error");
              toast.error(`There was an issue adding your territory: ${error.message || "Please contact support."}`);
            }
          }
          
          setIsLoading(false);
          
          // Start countdown
          const timer = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(timer);
                // We will add a query parameter to signal the dashboard to force refresh data
                navigate('/dashboard?refresh=true&source=payment');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          return () => clearInterval(timer);
        } else {
          // If not logged in, redirect to login
          toast.error("You need to be logged in to view this page");
          navigate('/login', { state: { returnTo: location.pathname + location.search } });
          setIsLoading(false);
        }
      } catch (error: any) {
        console.error("Authentication error:", error);
        setIsLoading(false);
        toast.error(`Authentication error occurred: ${error.message || "Please try logging in again."}`);
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate, zipCode, leadType, location]);
  
  const handleGoToDashboard = () => {
    // Add query parameters to signal the dashboard to force refresh data
    navigate('/dashboard?refresh=true&source=payment');
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
          ) : territoryCreationError ? (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-left">
              <h3 className="font-medium text-red-800 mb-2">Error Setting Up Territory</h3>
              <p className="text-red-700 mb-4">{territoryCreationError}</p>
              <p>Please contact support or try again. Your payment has been processed successfully.</p>
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
