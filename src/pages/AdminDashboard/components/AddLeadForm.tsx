
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader, Search, RefreshCw } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
  email: string;
}

interface Territory {
  id: string;
  zip_code: string;
  lead_type: string;
  user_id: string;
  user_profiles?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  user_profile?: UserProfile;
}

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  notes: string;
}

const initialFormData: LeadFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  notes: ''
};

const AddLeadForm = () => {
  const [formData, setFormData] = useState<LeadFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [isLoadingTerritories, setIsLoadingTerritories] = useState(false);
  const [territoryMatch, setTerritoryMatch] = useState<Territory | null>(null);
  const [hasCheckedTerritory, setHasCheckedTerritory] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset territory check when zip code changes
    if (name === 'zip_code') {
      setHasCheckedTerritory(false);
      setTerritoryMatch(null);
    }
  };
  
  // Fetch territories for reference
  useEffect(() => {
    fetchTerritories();
  }, []);

  const fetchTerritories = async () => {
    try {
      setIsLoadingTerritories(true);
      console.log("Fetching territories for lead assignment...");
      
      // Get territories with a more robust approach
      const { data: territoriesData, error: territoriesError } = await supabase
        .from('territories')
        .select(`
          id,
          zip_code,
          lead_type,
          user_id,
          active
        `)
        .eq('active', true);

      if (territoriesError) {
        throw territoriesError;
      }
      
      console.log("Raw territories data:", territoriesData);
      
      if (!territoriesData || territoriesData.length === 0) {
        console.log("No active territories found");
        setTerritories([]);
        setIsLoadingTerritories(false);
        return;
      }
      
      // Get user profiles
      const { data: userProfilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, first_name, last_name');
      
      if (profilesError) {
        console.error("Error fetching user profiles:", profilesError);
      }
      
      // Create a map of user profiles by ID
      const userProfilesMap = new Map();
      if (userProfilesData) {
        userProfilesData.forEach((profile: any) => {
          userProfilesMap.set(profile.id, {
            first_name: profile.first_name,
            last_name: profile.last_name
          });
        });
      }
      
      // Get user emails from the edge function
      const { data: usersList, error: usersError } = await supabase.functions.invoke('get-all-users');
      
      if (usersError) {
        console.error("Error fetching users:", usersError);
      }
      
      // Create a map of user emails by ID
      const userEmailsMap = new Map();
      if (usersList) {
        usersList.forEach((user: any) => {
          userEmailsMap.set(user.id, user.email);
        });
      }
      
      // Combine territory data with user profiles and emails
      const enhancedTerritories = territoriesData.map((territory: any) => {
        const profile = userProfilesMap.get(territory.user_id);
        const email = userEmailsMap.get(territory.user_id);
        
        return {
          ...territory,
          user_profile: {
            first_name: profile?.first_name || null,
            last_name: profile?.last_name || null,
            email: email || 'N/A'
          }
        };
      });
      
      console.log("Enhanced territories:", enhancedTerritories);
      setTerritories(enhancedTerritories);
      setIsLoadingTerritories(false);
    } catch (error) {
      console.error("Error fetching territories:", error);
      toast.error("Failed to load territory data");
      setIsLoadingTerritories(false);
    }
  };

  const checkTerritory = () => {
    if (!formData.zip_code) {
      toast.error("Please enter a zip code");
      return;
    }

    console.log("Checking for territory match with zip code:", formData.zip_code);
    console.log("Available territories:", territories);

    // Always use investor as the lead type now
    const leadType = 'investor';
    
    const match = territories.find(t => 
      t.zip_code === formData.zip_code
    );

    console.log("Territory match result:", match);
    
    setTerritoryMatch(match || null);
    setHasCheckedTerritory(true);
    
    if (!match) {
      toast.warning(`No active territory found for zip code ${formData.zip_code}`);
    } else {
      toast.success(`Territory found for zip code ${formData.zip_code}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!formData.name || !formData.zip_code) {
        toast.error("Name and zip code are required");
        return;
      }

      if (!hasCheckedTerritory) {
        toast.error("Please check territory availability first");
        return;
      }

      setIsSubmitting(true);
      
      // Prepare lead data
      const leadData = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address ? 
          `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip_code}` : 
          null,
        territory_zip_code: formData.zip_code,
        notes: formData.notes || null,
        user_id: territoryMatch?.user_id || null,
        status: 'New'
      };
      
      console.log("Submitting lead data:", leadData);
      
      // Insert lead into database
      const { data, error } = await supabase
        .from('leads')
        .insert(leadData)
        .select();
      
      if (error) throw error;
      
      // Notify the user if a territory match was found
      if (territoryMatch?.user_id) {
        try {
          // Invoke notification edge function if we have a user to notify
          await supabase.functions.invoke('notify-lead', {
            body: { 
              leadId: data[0].id, 
              userId: territoryMatch.user_id 
            }
          });
        } catch (notifyError) {
          console.error("Error sending notification:", notifyError);
          // Continue even if notification fails
        }
      }
      
      toast.success(`Lead created successfully${territoryMatch ? ' and assigned to user' : ''}`);
      
      // Reset form
      setFormData(initialFormData);
      setHasCheckedTerritory(false);
      setTerritoryMatch(null);
      
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error("Failed to create lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Lead</CardTitle>
        <CardDescription>
          Create a new lead and assign it to a territory if available
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zip_code">Zip Code *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="zip_code"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                    required
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={checkTerritory}
                    disabled={!formData.zip_code || isLoadingTerritories}
                  >
                    {isLoadingTerritories ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : "Check"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={fetchTerritories}
                    disabled={isLoadingTerritories}
                    className="flex items-center"
                    title="Refresh territories list"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoadingTerritories ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>
          
          {/* Territory match status */}
          {hasCheckedTerritory && (
            <Alert className={territoryMatch ? "bg-green-50" : "bg-yellow-50"}>
              {territoryMatch ? (
                <>
                  <AlertTitle className="text-green-800">Territory Assigned</AlertTitle>
                  <AlertDescription className="text-green-700">
                    This lead will be assigned to {territoryMatch.user_profile?.first_name || ''} {territoryMatch.user_profile?.last_name || ''} {territoryMatch.user_profile?.first_name || territoryMatch.user_profile?.last_name ? `(${territoryMatch.user_profile?.email})` : territoryMatch.user_profile?.email}
                  </AlertDescription>
                </>
              ) : (
                <>
                  <AlertTitle className="text-yellow-800">No Territory Match</AlertTitle>
                  <AlertDescription className="text-yellow-700">
                    No user is currently assigned to zip code {formData.zip_code}. 
                    The lead will be saved but not assigned to any user.
                  </AlertDescription>
                </>
              )}
            </Alert>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || !hasCheckedTerritory}
          >
            {isSubmitting ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Creating Lead...
              </>
            ) : "Add Lead"}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="text-sm text-gray-500">
        * Required fields
      </CardFooter>
    </Card>
  );
};

export default AddLeadForm;
