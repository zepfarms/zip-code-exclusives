
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
import { Loader, Search } from 'lucide-react';

interface Territory {
  id: string;
  zip_code: string;
  user_id: string;
  active: boolean;
  start_date: string | null;
  next_billing_date: string | null;
  lead_type: string;
  created_at: string;
  user_profiles?: {
    first_name: string | null;
    last_name: string | null;
  };
  user_profile: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
}

const TerritoriesTable = () => {
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch territories
  useEffect(() => {
    const fetchTerritories = async () => {
      try {
        setIsLoading(true);
        
        // Use RPC function to get territories with user info
        // This is a placeholder - in reality, you would create a Supabase function
        const { data, error } = await supabase
          .from('territories')
          .select(`
            id,
            zip_code,
            user_id,
            active,
            start_date,
            next_billing_date,
            lead_type,
            created_at,
            user_profiles:user_id (
              first_name,
              last_name
            )
          `);

        if (error) {
          throw error;
        }

        // For demo purposes, simulate the join with user email
        // In production, you would handle this through Supabase functions
        const authData = await supabase.auth.admin.listUsers();
        const authUsers = authData.data?.users || [];

        const processedData: Territory[] = data.map(territory => {
          const authUser = authUsers.find(u => u.id === territory.user_id);
          return {
            ...territory,
            user_profile: {
              first_name: territory.user_profiles?.first_name || null,
              last_name: territory.user_profiles?.last_name || null,
              email: authUser?.email || 'N/A'
            }
          };
        });
        
        setTerritories(processedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching territories:", error);
        toast.error("Failed to load territories");
        setIsLoading(false);
      }
    };

    fetchTerritories();
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
      
      toast.success(`Territory ${!territory.active ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error("Error updating territory status:", error);
      toast.error("Failed to update territory status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Territory Management</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search territories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
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
                <TableHead>Lead Type</TableHead>
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
                      {territory.user_profile?.first_name} {territory.user_profile?.last_name}
                      <span className="block text-xs text-gray-500">{territory.user_profile?.email}</span>
                    </TableCell>
                    <TableCell className="capitalize">{territory.lead_type}</TableCell>
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
                  <TableCell colSpan={7} className="text-center py-4">
                    No territories found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TerritoriesTable;
