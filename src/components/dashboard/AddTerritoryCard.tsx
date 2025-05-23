
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AddTerritoryCard = ({ onTerritoryAdded }: { onTerritoryAdded: () => void }) => {
  const [zipCode, setZipCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [checkResult, setCheckResult] = useState<{available: boolean, checked: boolean}>({ available: false, checked: false });
  
  const checkZipCodeAvailability = async () => {
    if (!zipCode || zipCode.length !== 5 || !/^\d+$/.test(zipCode)) {
      toast.error("Please enter a valid 5-digit zip code");
      return;
    }
    
    setIsChecking(true);
    setCheckResult({ available: false, checked: false });
    
    try {
      // Check if the zip code exists in our database
      const { data, error } = await supabase
        .from('zip_codes')
        .select('available, zip_code')
        .eq('zip_code', zipCode)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      // If not found in the database or is available
      const isAvailable = !data || data.available;
      setCheckResult({ available: isAvailable, checked: true });
      
      if (!isAvailable) {
        toast.error(`Zip code ${zipCode} is not available for subscription`);
      }
    } catch (error: any) {
      console.error("Error checking zip code:", error);
      toast.error("Failed to check zip code: " + (error.message || "Unknown error"));
    } finally {
      setIsChecking(false);
    }
  };
  
  const handlePurchaseTerritory = async () => {
    try {
      setIsAdding(true);
      
      // Ensure user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You must be logged in to purchase a territory");
        // Redirect to login
        window.location.href = `/login?redirect=/dashboard?action=add-territory&zip=${zipCode}`;
        return;
      }
      
      // Store zipCode in localStorage to use after successful payment
      localStorage.setItem('lastZipCode', zipCode);
      
      console.log("Creating checkout for zip code:", zipCode);
      
      // Create Stripe checkout session with explicit lead_type
      // Note: We're using 'investor' as the default lead type since the database only accepts 'investor' or 'agent'
      const leadType = 'investor';
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { zipCode, leadType }
      });
      
      if (error) {
        console.error("Error creating checkout:", error);
        throw new Error(error.message || "Failed to create checkout");
      }
      
      if (!data) {
        throw new Error("No response received from checkout function");
      }
      
      console.log("Checkout response:", data);
      
      // Redirect to Stripe checkout
      if (data.url) {
        console.log("Redirecting to checkout URL:", data.url);
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error("Failed to process payment: " + (error.message || "Unknown error"));
    } finally {
      setIsAdding(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Territory</CardTitle>
        <CardDescription>
          Search and add exclusive zip codes to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="zipCode" className="text-sm font-medium">Zip Code</label>
          <div className="flex space-x-2">
            <Input 
              id="zipCode" 
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter 5-digit zip code"
              maxLength={5}
              className="flex-1"
            />
            <Button 
              onClick={checkZipCodeAvailability} 
              disabled={isChecking}
              variant="outline"
            >
              {isChecking ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                'Check'
              )}
            </Button>
          </div>
        </div>
        
        {checkResult.checked && (
          <div className={`p-4 rounded-lg ${checkResult.available ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
            <div className="flex items-center space-x-2">
              {checkResult.available ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-800">Zip code {zipCode} is available!</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="font-medium text-red-800">Zip code {zipCode} is not available.</span>
                </>
              )}
            </div>
            
            {checkResult.available && (
              <div className="mt-4">
                <Button 
                  onClick={handlePurchaseTerritory}
                  className="w-full"
                  disabled={isAdding}
                >
                  {isAdding ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    '$199 Get Started'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddTerritoryCard;
