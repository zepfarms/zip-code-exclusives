
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
import { supabase } from "@/integrations/supabase/client";
import { Loader } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { ensureUserProfile } from '@/utils/userProfile';

const Register = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
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
    
    if (!agreedToTerms) {
      toast.error("You must agree to the Terms of Service");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
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
            agreed_to_terms: true,
            terms_agreement_date: new Date().toISOString()
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

      // Ensure user profile creation
      if (signInData.user) {
        try {
          await ensureUserProfile(signInData.user.id);
          
          // Send welcome email to the user
          try {
            console.log("Sending welcome email to new user:", signInData.user.email);
            
            const { data: welcomeEmailData, error: welcomeEmailError } = await supabase.functions.invoke('welcome-email', {
              body: { 
                userId: signInData.user.id,
                zipCode: "00000" // Default zip code, can be updated later
              }
            });
            
            if (welcomeEmailError) {
              console.error("Failed to send welcome email:", welcomeEmailError);
            } else {
              console.log("Welcome email sent successfully:", welcomeEmailData);
            }
          } catch (welcomeError) {
            console.error("Error sending welcome email:", welcomeError);
          }
          
          // Send admin notification email
          try {
            console.log("Attempting to send admin notification for user:", signInData.user.id);
            
            const { data: adminNotificationData, error: adminNotificationError } = await supabase.functions.invoke('admin-new-account-notification', {
              body: { userId: signInData.user.id }
            });
            
            if (adminNotificationError) {
              console.error("Failed to send admin notification:", adminNotificationError);
              console.error("Admin notification error details:", {
                message: adminNotificationError.message,
                context: adminNotificationError.context,
                details: adminNotificationError.details
              });
            } else {
              console.log("Admin notification sent successfully:", adminNotificationData);
            }
          } catch (notificationError) {
            console.error("Error sending admin notification:", notificationError);
          }
          
          toast.success("Account created and logged in successfully!");
          navigate('/dashboard');
        } catch (profileError) {
          console.error("Failed to ensure user profile:", profileError);
          toast.success("Account created and logged in successfully!");
          navigate('/dashboard');
        }
      }
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
              
              <div className="flex items-start space-x-2 pt-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  required
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I have read and agree to the{" "}
                    <Link to="/terms-of-service" target="_blank" className="text-brand-700 hover:underline">
                      Terms of Service
                    </Link>
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                </div>
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-accent-600 hover:bg-accent-700"
                  disabled={isLoading || !agreedToTerms}
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
            
            {/* Email delivery notice */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Important Email Information
                  </h3>
                  <div className="mt-1 text-sm text-blue-700">
                    <p className="mb-2">
                      After registration, you'll receive important emails from <strong>help@leadxclusive.com</strong>.
                    </p>
                    <p className="mb-1">To ensure delivery:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Check your spam/junk folder</li>
                      <li>Add help@leadxclusive.com to your trusted contacts</li>
                      <li>Mark our emails as "Not Spam" if they appear in spam</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
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
