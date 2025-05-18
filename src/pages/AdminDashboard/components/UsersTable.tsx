
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader, Search } from 'lucide-react';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  email: string; // from auth.users
  company: string | null;
  phone: string | null;
  user_type: string;
  license_state: string | null;
  license_number: string | null;
  created_at: string;
}

const UsersTable = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        
        // Fetch user profiles along with auth email info
        const { data: profiles, error } = await supabase
          .from('user_profiles')
          .select('*');

        if (error) {
          throw error;
        }

        // For each profile, get the email from auth.users
        // In a production app, this would ideally be done on the backend
        // Here we're simulating it by assuming emails are available from auth providers
        // This is a simplification - in production, use an RPC function on Supabase

        // Get emails from auth (for demo purposes - in production, use server-side)
        const authData = await supabase.auth.admin.listUsers();
        const authUsers = authData.data?.users || [];

        // Combine the data
        const combinedData = profiles.map(profile => {
          const authUser = authUsers.find(u => u.id === profile.id);
          return {
            ...profile,
            email: authUser?.email || 'N/A'
          };
        });
        
        setUsers(combinedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.first_name?.toLowerCase().includes(searchLower) || false) ||
      (user.last_name?.toLowerCase().includes(searchLower) || false) ||
      (user.email?.toLowerCase().includes(searchLower) || false) ||
      (user.company?.toLowerCase().includes(searchLower) || false) ||
      (user.phone?.includes(searchTerm) || false)
    );
  });

  const handleViewUser = (user: UserProfile) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleSetAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_admin: isAdmin })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update users state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_admin: isAdmin } : user
      ));
      
      toast.success(`User admin status ${isAdmin ? 'granted' : 'revoked'} successfully`);
    } catch (error) {
      console.error("Error updating user admin status:", error);
      toast.error("Failed to update user admin status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">User Management</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8 animate-spin text-brand-600" />
          <span className="ml-2">Loading users...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.first_name} {user.last_name}
                      {user.company && <span className="block text-xs text-gray-500">{user.company}</span>}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || 'N/A'}</TableCell>
                    <TableCell className="capitalize">{user.user_type}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {user.is_admin ? 
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Admin
                        </span> : 
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          User
                        </span>
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewUser(user)}>
                          Details
                        </Button>
                        <Button
                          variant={user.is_admin ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => handleSetAdmin(user.id, !user.is_admin)}
                          disabled={isUpdating}
                        >
                          {user.is_admin ? "Remove Admin" : "Make Admin"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No users found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* User Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the user.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                  <p>{selectedUser.first_name} {selectedUser.last_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                  <p>{selectedUser.phone || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Company</h4>
                  <p>{selectedUser.company || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">User Type</h4>
                  <p className="capitalize">{selectedUser.user_type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Admin Status</h4>
                  <p>{selectedUser.is_admin ? 'Admin' : 'Regular User'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">License State</h4>
                  <p>{selectedUser.license_state || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">License Number</h4>
                  <p>{selectedUser.license_number || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Joined</h4>
                  <p>{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersTable;
