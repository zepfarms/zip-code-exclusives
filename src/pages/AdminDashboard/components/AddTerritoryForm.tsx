
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
}

interface AddTerritoryFormProps {
  onTerritoryAdded?: () => void;
}

const AddTerritoryForm = ({ onTerritoryAdded }: AddTerritoryFormProps) => {
  const [zipCode, setZipCode] = useState('');
  const [userId, setUserId] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [checkResult, setCheckResult] = useState<{available: boolean, checked: boolean, existingTerritory?: any}>({ 
    available: false, 
    checked: false 
  });

  // Fetch users for the dropdown
  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }
      
      console.log("Fetching users for territory form with user ID:", session.user.id);
      
      // Get emails from auth users via edge function with explicit user ID
      const { data: authUsers, error: authError } = await supabase.functions.invoke('get-all-users', {
        body: { userId: session.user.id }
      });
      
      if (authError) {
        console.error("Error fetching auth users:", authError);
        throw authError;
      }
      
      // Get all user profiles
      const { data: profiles, error: profilesError } = await supabase.functions.invoke('get-admin-profiles', {
        body: { userId: session.user.id }
      });
      
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }
      
      if (!authUsers || !Array.isArray(authUsers)) {
        console.error("Invalid response format from get-all-users:", authUsers);
        throw new Error("Failed to fetch user data in the expected format");
      }
      
      // Create a map of profiles by ID for faster lookup
      const profilesMap = new Map();
      if (profiles) {
        profiles.forEach((profile: any) => {
          profilesMap.set(profile.id, profile);
        });
      }
      
      // Combine the data
      const combinedUsers = authUsers.map(user => {
        const profile = profilesMap.get(user.id);
        return {
          id: user.id,
          email: user.email || 'N/A',
          first_name: profile?.first_name || null,
          last_name: profile?.last_name || null
        };
      });
      
      console.log("Combined users for dropdown:", combinedUsers);
      setUsers(combinedUsers);
      setIsLoadingUsers(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      setIsLoadingUsers(false);
    }
  };
  
  useEffect(() => {
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
      console.log("Checking availability for zip code:", zipCode);
      
      // Get current user session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      // Use the edge function to check territory availability
      const { data, error } = await supabase.functions.invoke('check-territory-availability', {
        body: { 
          zipCode: zipCode,
          userId: session.user.id
        }
      });
      
      if (error) {
        console.error("Error checking territory availability:", error);
        throw new Error(error.message || "Failed to check availability");
      }
      
      console.log("Territory check result:", data);
      
      if (data && data.available !== undefined) {
        setCheckResult({ 
          available: data.available, 
          checked: true,
          existingTerritory: data.existingTerritory
        });
        
        if (!data.available && data.existingTerritory) {
          toast.error(`Zip code ${zipCode} is already assigned to ${data.existingTerritory.userName || 'a user'}`);
        } else if (data.available) {
          toast.success(`Zip code ${zipCode} is available!`);
        }
      } else {
        throw new Error("Invalid response format from availability check");
      }
    } catch (error: any) {
      console.error("Error checking zip code:", error);
      toast.error("Failed to check zip code availability: " + (error.message || "Unknown error"));
      // Set a default state to avoid UI being stuck
      setCheckResult({ available: false, checked: true });
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
      // Check if the territory already exists but is inactive
      const { data: existingTerritory, error: checkError } = await supabase
        .from('territories')
        .select('id')
        .eq('zip_code', zipCode)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      let territoryId;
      
      if (existingTerritory) {
        // If territory exists, update it
        console.log("Updating existing territory:", existingTerritory.id);
        const { data, error } = await supabase
          .from('territories')
          .update({
            user_id: userId,
            active: true,
            start_date: new Date().toISOString(),
            next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          })
          .eq('id', existingTerritory.id)
          .select();
        
        if (error) throw error;
        territoryId = existingTerritory.id;
      } else {
        // Add the territory directly to the territories table
        console.log("Creating new territory for zip code:", zipCode);
        const { data, error } = await supabase
          .from('territories')
          .insert({
            zip_code: zipCode,
            user_id: userId,
            active: true,
            lead_type: 'investor',
            start_date: new Date().toISOString(),
            next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          })
          .select();
        
        if (error) throw error;
        territoryId = data[0].id;
      }
      
      // Update or create the zip_codes entry
      const { error: zipCodeError } = await supabase
        .from('zip_codes')
        .upsert({
          zip_code: zipCode,
          available: false,
          claimed_at: new Date().toISOString(),
          user_id: userId
        });
      
      if (zipCodeError) {
        console.error("Warning: Could not update zip_codes table:", zipCodeError);
      }
      
      // Create a sample lead for this territory to trigger notifications
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert({
          name: 'Welcome Lead',
          territory_zip_code: zipCode,
          user_id: userId,
          status: 'New',
          notes: 'This is a welcome lead created when the territory was assigned.',
          address: `Zip Code: ${zipCode}`,
          phone: '',
          email: ''
        })
        .select();

      if (leadError) {
        console.error("Error creating welcome lead:", leadError);
      } else if (leadData && leadData[0]) {
        // Trigger lead notification
        try {
          console.log("Sending notification for new lead:", leadData[0].id, "to user:", userId);
          const { data: notificationResult, error: notificationError } = await supabase.functions.invoke('notify-lead', {
            body: {
              leadId: leadData[0].id,
              userId: userId
            }
          });

          if (notificationError) {
            console.error("Error sending lead notification:", notificationError);
          } else {
            console.log("Notification result:", notificationResult);
          }
        } catch (notifyError) {
          console.error("Failed to send lead notification:", notifyError);
        }
      }
      
      toast.success(`Territory ${zipCode} successfully assigned to user`);
      
      // Reset the form
      setZipCode('');
      setUserId('');
      setCheckResult({ available: false, checked: false });
      
      // Notify parent component that a territory was added
      if (onTerritoryAdded) {
        onTerritoryAdded();
      }
      
    } catch (error: any) {
      console.error("Error adding territory:", error);
      toast.error("Failed to add territory: " + (error.message || "Unknown error"));
    } finally {
      setIsAdding(false);
    }
  };
  
  const handleRefreshUsers = async () => {
    await fetchUsers();
    toast.success("User list refreshed");
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
          <div className="flex justify-between items-center">
            <Label htmlFor="userId">Select User</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefreshUsers} 
              disabled={isLoadingUsers}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingUsers ? 'animate-spin' : ''}`} />
              <span className="sr-only">Refresh users</span>
            </Button>
          </div>
          <Select
            value={userId}
            onValueChange={setUserId}
            disabled={isLoadingUsers}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="-- Select User --" />
            </SelectTrigger>
            <SelectContent>
              {users.length > 0 ? (
                users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.email} {user.first_name ? `(${user.first_name} ${user.last_name || ''})` : ''}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading" disabled>
                  {isLoadingUsers ? "Loading users..." : "No users found"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
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
                  <div>
                    <span className="font-medium text-red-800 block">Zip code {zipCode} is not available.</span>
                    {checkResult.existingTerritory && (
                      <span className="text-sm text-red-700">
                        Assigned to {checkResult.existingTerritory.userName} ({checkResult.existingTerritory.userEmail})
                      </span>
                    )}
                  </div>
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
