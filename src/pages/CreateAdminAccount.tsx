
import React, { useState } from 'react';
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
  const navigate = useNavigate();

  const createAdminAccount = async () => {
    setIsCreating(true);
    
    try {
      // 1. Create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'zepfarms@gmail.com',
        password: 'Buffet1979$$',
      });
      
      if (authError) throw authError;
      
      // If user was created successfully
      if (authData.user) {
        const userId = authData.user.id;
        
        // 2. Insert directly into the user_profiles table instead of updating
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            first_name: 'Admin',
            last_name: 'User',
            is_admin: true,
            notification_email: true
          });
          
        if (profileError) {
          console.error("Profile creation error:", profileError);
          throw profileError;
        }
        
        // 3. Create a territory assignment for the user with zip code 23518
        const { error: territoryError } = await supabase
          .from('territories')
          .insert({
            user_id: userId,
            zip_code: '23518',
            active: true,
            start_date: new Date().toISOString()
          });
          
        if (territoryError) throw territoryError;
        
        // 4. Update the zip_code availability
        const { error: zipCodeError } = await supabase
          .from('zip_codes')
          .update({ is_available: false })
          .eq('code', '23518');
          
        if (zipCodeError) {
          // If the zip code doesn't exist yet, insert it
          const { error: insertZipError } = await supabase
            .from('zip_codes')
            .insert({ 
              code: '23518',
              is_available: false,
              city: 'Norfolk',
              state: 'VA'
            });
          
          if (insertZipError) throw insertZipError;
        }
        
        setIsComplete(true);
        toast.success("Admin account created successfully!");
      }
      
    } catch (error: any) {
      console.error("Error creating admin account:", error);
      toast.error(`Error: ${error.message || 'Unknown error occurred'}`);
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
                  onClick={() => navigate('/login')}
                >
                  Go to Login
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
