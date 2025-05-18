
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { Loader } from 'lucide-react';

const Register = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userType, setUserType] = useState('investor');
  const [licenseState, setLicenseState] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

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
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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

      if (signUpError) throw signUpError;
      
      // Now sign in the user immediately after registration
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) {
        console.error("Auto sign-in failed:", signInError);
        toast.warning("Account created but automatic login failed. Please sign in manually.");
        navigate('/login');
        return;
      }

      toast.success("Account created and logged in successfully!");

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Registration error:", error);
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
              Register to start receiving exclusive real estate leads
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

              <div className="space-y-3 pt-2">
                <label className="text-sm font-medium text-gray-700">
                  I am a: <span className="text-red-500">*</span>
                </label>
                <RadioGroup 
                  value={userType} 
                  onValueChange={setUserType}
                  className="flex flex-col space-y-3"
                >
                  <div className="flex items-center space-x-3 rounded-md border p-3">
                    <RadioGroupItem value="investor" id="investor" />
                    <label htmlFor="investor" className="flex flex-col cursor-pointer">
                      <span className="font-medium">Real Estate Investor</span>
                      <span className="text-sm text-gray-500">
                        I'm looking for investment opportunities
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 rounded-md border p-3">
                    <RadioGroupItem value="agent" id="agent" />
                    <label htmlFor="agent" className="flex flex-col cursor-pointer">
                      <span className="font-medium">Real Estate Agent</span>
                      <span className="text-sm text-gray-500">
                        I'm a licensed real estate agent
                      </span>
                    </label>
                  </div>
                </RadioGroup>
              </div>
              
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
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
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
