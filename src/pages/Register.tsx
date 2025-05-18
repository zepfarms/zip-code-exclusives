
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('');
  const [licenseState, setLicenseState] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract zip code and lead type from location state if available
  const zipCode = location.state?.zipCode || '';
  const leadType = location.state?.leadType || '';
  
  // Set default user type based on leadType from state
  useEffect(() => {
    if (leadType) {
      setUserType(leadType);
    }
  }, [leadType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate license information for agents
    if (userType === 'agent' && (!licenseState || !licenseNumber)) {
      toast.error("License information is required for real estate agents");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            user_type: userType,
            license_state: licenseState || null,
            license_number: licenseNumber || null
          }
        }
      });

      if (error) throw error;

      toast.success("Account created successfully! Redirecting to payment...");
      
      // Navigate to payment page with user type and zip code
      setTimeout(() => {
        navigate("/payment", { 
          state: { 
            zipCode,
            userType,
            leadType: userType // Pass the lead type matching the user type
          }
        });
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
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
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>
              {zipCode 
                ? `Register to claim exclusive rights to ${userType === 'investor' ? 'investor' : 'realtor'} leads in zip code ${zipCode}` 
                : "Register to start receiving exclusive real estate leads"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  We'll send a verification code to this email
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {!leadType && (
                <div className="space-y-3 pt-2">
                  <label className="text-sm font-medium text-gray-700">
                    I am looking for: <span className="text-red-500">*</span>
                  </label>
                  <RadioGroup 
                    value={userType} 
                    onValueChange={setUserType}
                    className="flex flex-col space-y-3"
                  >
                    <div className="flex items-center space-x-3 rounded-md border p-3">
                      <RadioGroupItem value="investor" id="investor" />
                      <label htmlFor="investor" className="flex flex-col cursor-pointer">
                        <span className="font-medium">Investor Leads</span>
                        <span className="text-sm text-gray-500">
                          Receive leads from potential sellers for investment opportunities
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center space-x-3 rounded-md border p-3">
                      <RadioGroupItem value="agent" id="agent" />
                      <label htmlFor="agent" className="flex flex-col cursor-pointer">
                        <span className="font-medium">Real Estate Agent Leads</span>
                        <span className="text-sm text-gray-500">
                          Receive leads from potential buyers and sellers (requires real estate license)
                        </span>
                      </label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              {leadType && (
                <div className="p-4 bg-brand-50 rounded-md border border-brand-100">
                  <h3 className="font-medium text-brand-800">Selected Lead Type:</h3>
                  <p className="text-brand-700">
                    {userType === 'investor' ? 'Investor Leads' : 'Real Estate Agent Leads'} in zip code {zipCode}
                  </p>
                </div>
              )}
              
              {userType === 'agent' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-md border">
                  <div className="text-sm font-medium text-gray-800">
                    Real Estate License Information <span className="text-red-500">*</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Required for real estate agent leads. We'll verify this information.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="licenseState" className="text-sm font-medium text-gray-700">
                        Licensed State <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="licenseState"
                        value={licenseState}
                        onChange={(e) => setLicenseState(e.target.value)}
                        required={userType === 'agent'}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="licenseNumber" className="text-sm font-medium text-gray-700">
                        License Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="licenseNumber"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        required={userType === 'agent'}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-accent-600 hover:bg-accent-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account & Continue to Payment'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-700 hover:text-brand-800 font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
