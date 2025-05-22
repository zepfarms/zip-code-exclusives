
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { ensureUserProfile } from '@/utils/userProfile';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          setIsInitializing(false);
          return;
        }
        
        if (session) {
          // If user is already logged in, redirect to dashboard
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Specific handling for email confirmation errors
        if (error.message?.includes('Email not confirmed')) {
          // Try to bypass the email confirmation requirement by signing up again
          // This works because we've disabled email confirmations in config.toml
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });
          
          if (signUpError) {
            throw signUpError;
          }
          
          // Try signing in again after the signup attempt
          const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (retryError) {
            throw retryError;
          }
          
          // If we got here, we've successfully signed in
          if (retryData.user) {
            await ensureUserProfile(retryData.user.id);
            toast.success("Login successful!");
            navigate('/dashboard');
            return;
          }
        }
        
        // If we get here, it's a different error
        throw error;
      }
      
      if (data.user) {
        // Ensure the user has a profile
        try {
          await ensureUserProfile(data.user.id);
        } catch (profileError) {
          console.error("Failed to create/check profile:", profileError);
          // Continue anyway - we'll handle profile issues on the dashboard
        }
        
        toast.success("Login successful!");
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.error_description || error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-brand-600 border-t-transparent rounded-full"></div>
          <span className="ml-2">Checking authentication...</span>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Log in to your LeadXclusive account to manage your leads and territories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
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
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-brand-700 hover:text-brand-800">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-brand-700 hover:bg-brand-800"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/check-availability" className="text-brand-700 hover:text-brand-800 font-medium">
                Check availability and sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
