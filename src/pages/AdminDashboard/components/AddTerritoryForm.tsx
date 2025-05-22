
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader, CheckCircle, XCircle } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface User {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
}

const AddTerritoryForm = () => {
  const [zipCode, setZipCode] = useState('');
  const [userId, setUserId] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [checkResult, setCheckResult] = useState<{available: boolean, checked: boolean}>({ available: false, checked: false });

  // Fetch users for the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true);
        
        // Get all user profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('id, first_name, last_name');
        
        if (profilesError) throw profilesError;
        
        // Get emails from auth.users
        const authData = await supabase.auth.admin.listUsers();
        const authUsers = authData.data?.users || [];
        
        // Combine the data
        const combinedUsers = profiles.map(profile => {
          const authUser = authUsers.find(user => user.id === profile.id);
          return {
            id: profile.id,
            email: authUser?.email || 'N/A',
            first_name: profile.first_name,
            last_name: profile.last_name
          };
        });
        
        setUsers(combinedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setIsLoadingUsers(false);
      }
    };
    
    fetchUsers();
  }, []);

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

  const handleAddTerritory = async () => {
    if (!zipCode) {
      toast.error("Please enter a zip code");
      return;
    }
    
    if (!userId) {
      toast.error("Please select a user");
      return;
    }
    
    if (!checkResult.checked) {
      toast.error("Please check zip code availability first");
      return;
    }
    
    if (!checkResult.available) {
      toast.error("This zip code is not available");
      return;
    }
    
    setIsAdding(true);
    
    try {
      // Call the create-territory function
      const { data, error } = await supabase.functions.invoke('create-territory', {
        body: { 
          zipCode, 
          userId,
          leadType: 'investor' // Default to 'investor' since we're removing the option
        }
      });
      
      if (error) throw error;
      
      toast.success(`Territory ${zipCode} successfully assigned to user`);
      
      // Reset the form
      setZipCode('');
      setUserId('');
      setCheckResult({ available: false, checked: false });
      
    } catch (error: any) {
      console.error("Error adding territory:", error);
      toast.error("Failed to add territory: " + (error.message || "Unknown error"));
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Territory Manually</CardTitle>
        <CardDescription>
          Assign a territory to a user directly from the admin panel
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="userId">Select User</Label>
          <select 
            id="userId" 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={isLoadingUsers}
          >
            <option value="">-- Select User --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email} {user.first_name ? `(${user.first_name} ${user.last_name || ''})` : ''}
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code</Label>
          <div className="flex space-x-2">
            <Input 
              id="zipCode" 
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter 5-digit zip code"
              maxLength={5}
              className="flex-1"
              disabled={isAdding}
            />
            <Button 
              onClick={checkZipCodeAvailability} 
              disabled={isChecking || !zipCode || isAdding}
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
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleAddTerritory} 
          disabled={isAdding || !zipCode || !userId || !checkResult.available}
          className="w-full"
        >
          {isAdding ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Adding Territory...
            </>
          ) : (
            'Add Territory'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddTerritoryForm;
