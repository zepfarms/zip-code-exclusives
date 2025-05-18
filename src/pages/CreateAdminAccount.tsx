
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CreateAdminAccount = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setCurrentUser(data.session.user);
        // Check if user is already an admin
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('id', data.session.user.id)
          .single();
        
        if (profileData?.is_admin) {
          setIsComplete(true);
        }
      }
    };
    
    checkSession();
  }, []);

  const createAdminAccount = async () => {
    setIsCreating(true);
    
    try {
      // Try to sign in first if already created
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'zepfarms@gmail.com',
        password: 'Buffet1979$$'
      });
      
      if (!signInError && signInData.user) {
        // Successfully signed in
        toast.success("Signed in as admin successfully!");
        
        // Ensure admin flag is set
        await supabase
          .from('user_profiles')
          .upsert({
            id: signInData.user.id,
            first_name: 'Admin',
            last_name: 'User',
            is_admin: true,
            notification_email: true
          });
          
        setCurrentUser(signInData.user);
        setIsComplete(true);
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
        
        return;
      }
      
      // If sign-in failed, create a new account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'zepfarms@gmail.com',
        password: 'Buffet1979$$',
        options: {
          data: {
            first_name: 'Admin',
            last_name: 'User',
            is_admin: true
          }
        }
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        const userId = authData.user.id;
        
        // Create user profile
        await supabase
          .from('user_profiles')
          .upsert({
            id: userId,
            first_name: 'Admin',
            last_name: 'User',
            is_admin: true,
            notification_email: true
          });
        
        // Create territory
        await supabase
          .from('territories')
          .upsert({
            user_id: userId,
            zip_code: '23518',
            active: true,
            start_date: new Date().toISOString()
          }, { onConflict: 'user_id, zip_code' });
        
        // Update zip code record
        const { error: zipError } = await supabase
          .from('zip_codes')
          .upsert({ 
            code: '23518',
            is_available: false,
            city: 'Norfolk',
            state: 'VA'
          }, { onConflict: 'code' });
        
        if (zipError) console.error("Zip code error:", zipError);
        
        // Auto-confirm the user using the admin API - this is the correct property name
        await supabase.auth.admin.updateUserById(
          authData.user.id,
          { email_confirmed: true }
        ).catch(error => {
          console.error("Failed to auto-confirm user:", error);
          // If admin API fails, we'll try to sign in anyway
        });
        
        // Try to sign in immediately
        await supabase.auth.signInWithPassword({
          email: 'zepfarms@gmail.com',
          password: 'Buffet1979$$'
        });
        
        setCurrentUser(authData.user);
        setIsComplete(true);
        toast.success("Admin account created and logged in successfully!");
        
        // Redirect to admin dashboard
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      }
    } catch (error: any) {
      console.error("Error creating admin account:", error);
      toast.error(`Error: ${error.message || 'Unknown error occurred'}`);
      
      // If user already exists but we couldn't sign in, try to auto-confirm and sign in again
      if (error.message?.includes('already registered')) {
        toast.info("Account exists but couldn't sign in. Trying another approach...");
        
        // Try to get the session directly from any browser storage
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          setCurrentUser(sessionData.session.user);
          setIsComplete(true);
          navigate('/admin');
        }
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Account Setup</CardTitle>
            <CardDescription>
              Create an admin account with full feature access
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {!isComplete ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Email</div>
                  <div className="p-2 bg-gray-100 rounded">zepfarms@gmail.com</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Password</div>
                  <div className="p-2 bg-gray-100 rounded">••••••••••</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Zip Code</div>
                  <div className="p-2 bg-gray-100 rounded">23518</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Role</div>
                  <div className="p-2 bg-gray-100 rounded flex items-center">
                    <span className="bg-amber-500 text-amber-900 py-1 px-2 rounded text-xs font-bold">
                      ADMIN
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-brand-700 hover:bg-brand-800" 
                  onClick={createAdminAccount}
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating Account...' : 'Create Admin Account'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <div className="py-4 text-green-600 text-lg font-medium">
                  Admin account created successfully!
                </div>
                <Button 
                  className="w-full bg-brand-700 hover:bg-brand-800" 
                  onClick={() => navigate('/admin')}
                >
                  Go to Admin Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateAdminAccount;
