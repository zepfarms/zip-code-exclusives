
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
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean | null;
  email?: string;
  company: string | null;
  phone: string | null;
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
        
        // Fetch all user profiles
        const { data: profiles, error } = await supabase
          .from('user_profiles')
          .select('*');

        if (error) {
          throw error;
        }

        // Get current user session to know the admin email
        const { data: { session } } = await supabase.auth.getSession();
        const adminEmail = session?.user?.email || '';
        
        // Fetch all authentication users to get emails
        // This edge function will get all users (only works when called by admin)
        const { data: authUsers, error: funcError } = await supabase.functions.invoke('get-all-users');
        
        if (funcError) {
          console.error("Error fetching auth users:", funcError);
          // Even if we can't get emails, still show the profiles
          const combinedData = profiles.map(profile => ({
            ...profile,
            email: profile.id === session?.user?.id ? adminEmail : undefined
          }));
          setUsers(combinedData);
          setIsLoading(false);
          return;
        }

        // Map auth users to profiles to get emails
        const userMap = new Map();
        if (authUsers && Array.isArray(authUsers)) {
          authUsers.forEach(user => {
            if (user.id && user.email) {
              userMap.set(user.id, user.email);
            }
          });
        }
        
        // Create the combined data with emails
        const combinedData = profiles.map(profile => {
          return {
            ...profile,
            email: userMap.get(profile.id) || (profile.id === session?.user?.id ? adminEmail : undefined)
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
                      {user.first_name || 'N/A'} {user.last_name || ''}
                      {user.company && <span className="block text-xs text-gray-500">{user.company}</span>}
                    </TableCell>
                    <TableCell>{user.email || 'N/A'}</TableCell>
                    <TableCell>{user.phone || 'N/A'}</TableCell>
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
                  <TableCell colSpan={6} className="text-center py-4">
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
                  <p>{selectedUser.first_name || 'N/A'} {selectedUser.last_name || ''}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p>{selectedUser.email || 'N/A'}</p>
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
                  <h4 className="text-sm font-medium text-gray-500">Admin Status</h4>
                  <p>{selectedUser.is_admin ? 'Admin' : 'Regular User'}</p>
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
