
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader } from 'lucide-react';
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
    const fetchTerritories = async () => {
      try {
        setIsLoadingTerritories(true);
        
        const { data, error } = await supabase
          .from('territories')
          .select(`
            zip_code,
            lead_type,
            user_id,
            user_profiles:user_id (
              first_name,
              last_name
            )
          `)
          .eq('active', true);

        if (error) {
          throw error;
        }

        // For demo purposes, simulate the join with user email
        const authData = await supabase.auth.admin.listUsers();
        const authUsers = authData.data?.users || [];

        // Handle the data safely considering the types
        const processedData = data.map((territory: any) => {
          const authUser = authUsers.find(u => u.id === territory.user_id);
          
          // Safe access to nested properties
          const userProfiles = territory.user_profiles;
          const firstName = userProfiles && typeof userProfiles === 'object' ? userProfiles.first_name : null;
          const lastName = userProfiles && typeof userProfiles === 'object' ? userProfiles.last_name : null;
          
          return {
            ...territory,
            user_profile: {
              first_name: firstName,
              last_name: lastName,
              email: authUser?.email || 'N/A'
            }
          };
        });
        
        setTerritories(processedData as Territory[]);
        setIsLoadingTerritories(false);
      } catch (error) {
        console.error("Error fetching territories:", error);
        toast.error("Failed to load territory data");
        setIsLoadingTerritories(false);
      }
    };

    fetchTerritories();
  }, []);

  const checkTerritory = () => {
    if (!formData.zip_code) {
      toast.error("Please enter a zip code");
      return;
    }

    // Always use investor as the lead type now
    const leadType = 'investor';
    
    const match = territories.find(t => 
      t.zip_code === formData.zip_code && 
      t.lead_type === leadType
    );

    setTerritoryMatch(match || null);
    setHasCheckedTerritory(true);
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
      
      // Insert lead into database
      const { data, error } = await supabase
        .from('leads')
        .insert(leadData)
        .select();
      
      if (error) throw error;
      
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
                    This lead will be assigned to {territoryMatch.user_profile?.first_name} {territoryMatch.user_profile?.last_name} ({territoryMatch.user_profile?.email})
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
