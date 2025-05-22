
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader, Search, RefreshCw } from 'lucide-react';
import AddTerritoryForm from './AddTerritoryForm';

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
  email: string;
}

interface Territory {
  id: string;
  zip_code: string;
  user_id: string;
  active: boolean;
  start_date: string | null;
  next_billing_date: string | null;
  lead_type: string;
  created_at: string;
  user_profile?: UserProfile;
}

const TerritoriesTable = () => {
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch territories
  const fetchTerritoriesData = async () => {
    try {
      setIsLoading(true);
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      console.log("Fetching territories with user ID:", session.user.id);

      // Use the enhanced edge function to get all territories as admin
      const { data: territoriesData, error: territoriesError } = await supabase.functions.invoke('get-user-territories', {
        body: { 
          userId: session.user.id, 
          includeInactive: true, 
          getAllForAdmin: true 
        }
      });

      if (territoriesError) {
        console.error("Error from edge function:", territoriesError);
        throw new Error("Failed to fetch territories via edge function");
      }

      if (!territoriesData || !territoriesData.territories) {
        console.error("Invalid response format from edge function:", territoriesData);
        throw new Error("Invalid response format from territories edge function");
      }

      console.log(`Fetched ${territoriesData.territories.length} total territories from edge function`); 
    
      // Get user profiles via the edge function
      const { data: userProfiles, error: profilesError } = await supabase.functions.invoke('get-admin-profiles', {
        body: { userId: session.user.id }
      });
      
      if (profilesError) {
        console.error("Error fetching user profiles:", profilesError);
      }
      
      // Get user emails using the edge function - explicitly pass user ID
      const { data: usersList, error: usersError } = await supabase.functions.invoke('get-all-users', {
        body: { userId: session.user.id }
      });
      
      if (usersError) {
        console.error("Error fetching users for territories:", usersError);
        toast.error("Could not load complete user data for territories");
      }

      // Create a map of user profiles by ID
      const userProfilesMap = new Map();
      if (userProfiles) {
        userProfiles.forEach((profile: any) => {
          userProfilesMap.set(profile.id, {
            first_name: profile.first_name,
            last_name: profile.last_name
          });
        });
      }
      
      // Create a map of user emails by ID
      const userEmailsMap = new Map();
      if (usersList) {
        usersList.forEach((user: any) => {
          userEmailsMap.set(user.id, user.email);
        });
      }
      
      // Combine territory data with user profiles and emails
      const enhancedTerritories = territoriesData.territories.map((territory: any) => {
        // Find the profile that matches this territory's user_id
        const profile = userProfilesMap.get(territory.user_id);
        // Find the auth user email that matches this territory's user_id
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
      
      // Count active territories for debugging
      const activeCount = enhancedTerritories.filter((t: any) => t.active).length;
      console.log(`Active territories: ${activeCount}`);
      
      setTerritories(enhancedTerritories);
      setIsLoading(false);
      return enhancedTerritories;
    } catch (error) {
      console.error("Error fetching territories:", error);
      toast.error("Failed to load territories");
      setIsLoading(false);
      return [];
    }
  };

  useEffect(() => {
    fetchTerritoriesData().catch(err => {
      console.error("Error in territory fetch effect:", err);
      setIsLoading(false);
    });
  }, []);

  const filteredTerritories = territories.filter(territory => {
    const searchLower = searchTerm.toLowerCase();
    return (
      territory.zip_code.includes(searchTerm) ||
      territory.user_profile?.first_name?.toLowerCase().includes(searchLower) ||
      territory.user_profile?.last_name?.toLowerCase().includes(searchLower) ||
      territory.user_profile?.email.toLowerCase().includes(searchLower) ||
      territory.lead_type.toLowerCase().includes(searchLower)
    );
  });

  const toggleTerritoryStatus = async (territory: Territory) => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('territories')
        .update({ active: !territory.active })
        .eq('id', territory.id);
      
      if (error) throw error;
      
      // Update territories state
      setTerritories(prev => prev.map(t => 
        t.id === territory.id ? { ...t, active: !territory.active } : t
      ));

      // Also update the zip_codes table to maintain consistency
      const { error: zipCodeError } = await supabase
        .from('zip_codes')
        .upsert({
          zip_code: territory.zip_code,
          available: territory.active, // If deactivating territory, make zip available
          user_id: !territory.active ? territory.user_id : null // If activating, assign user
        });

      if (zipCodeError) {
        console.error("Error updating zip_codes:", zipCodeError);
        toast.warning("Territory status changed, but zip code record was not fully updated");
      }
      
      toast.success(`Territory ${!territory.active ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error("Error updating territory status:", error);
      toast.error("Failed to update territory status");
    } finally {
      setIsUpdating(false);
    }
  };

  const refreshTerritories = async () => {
    const territoriesData = await fetchTerritoriesData();
    if (territoriesData.length > 0) {
      toast.success("Territory data refreshed");
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Territory Management</h2>
          <div className="flex space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search territories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchTerritoriesData}
              disabled={isLoading}
              className="flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-8 w-8 animate-spin text-brand-600" />
            <span className="ml-2">Loading territories...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zip Code</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Next Billing</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTerritories.length > 0 ? (
                  filteredTerritories.map((territory) => (
                    <TableRow key={territory.id}>
                      <TableCell className="font-medium">{territory.zip_code}</TableCell>
                      <TableCell>
                        {territory.user_profile?.first_name || territory.user_profile?.last_name ? 
                          `${territory.user_profile.first_name || ''} ${territory.user_profile.last_name || ''}`.trim() : 
                          'N/A'
                        }
                        <span className="block text-xs text-gray-500">{territory.user_profile?.email}</span>
                      </TableCell>
                      <TableCell>
                        {territory.start_date ? new Date(territory.start_date).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {territory.next_billing_date ? new Date(territory.next_billing_date).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {territory.active ? 
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Active
                          </Badge> : 
                          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                            Inactive
                          </Badge>
                        }
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={territory.active ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => toggleTerritoryStatus(territory)}
                          disabled={isUpdating}
                        >
                          {territory.active ? "Deactivate" : "Activate"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      {territories.length === 0 ? 
                        "No territories found. Add a territory using the form." :
                        "No territories found matching your search."
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      <div className="md:col-span-1">
        <AddTerritoryForm onTerritoryAdded={fetchTerritoriesData} />
      </div>
    </div>
  );
};

export default TerritoriesTable;
