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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader, Search, UserX, User, Users, RefreshCw } from 'lucide-react';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean | null;
  email?: string;
  company: string | null;
  phone: string | null;
  created_at: string;
  last_sign_in_at?: string;
  confirmed_at?: string;
}

interface Territory {
  zip_code: string;
  lead_type: string;
  active: boolean;
}

interface UserWithTerritories extends UserProfile {
  territories: Territory[];
}

const UsersTable = () => {
  const [users, setUsers] = useState<UserWithTerritories[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithTerritories | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch users and their territories
  const fetchUsersAndTerritories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First get authenticated session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("You must be logged in");
        setIsLoading(false);
        return;
      }
      
      console.log("Fetching users with auth token...");
      
      // Call the edge function to get all users (requires admin access)
      const { data: authUsers, error: funcError } = await supabase.functions.invoke('get-all-users');
      
      if (funcError) {
        console.error("Error from get-all-users function:", funcError);
        setError("Failed to load users from authentication system");
        toast.error("Failed to load users from authentication system");
        setIsLoading(false);
        return;
      }
      
      if (!authUsers || authUsers.error) {
        console.error("API error:", authUsers?.error || "Unknown error");
        setError(authUsers?.error || "Failed to load users");
        toast.error(authUsers?.error || "Failed to load users");
        setIsLoading(false);
        return;
      }
      
      console.log("Auth users loaded:", authUsers.length);
      
      // Fetch territories directly using our improved edge function
      console.log("Fetching all territories...");
      const { data: territoriesData, error: territoriesError } = await supabase.functions.invoke('get-user-territories', {
        body: { 
          userId: session.user.id, 
          includeInactive: true, 
          getAllForAdmin: true 
        }
      });
      
      if (territoriesError) {
        console.error("Error fetching territories:", territoriesError);
        toast.error("Failed to load territories");
      }
      
      let allTerritories = [];
      if (territoriesData?.territories) {
        allTerritories = territoriesData.territories;
        console.log(`Fetched ${allTerritories.length || 0} territories total from edge function`);
      }
      
      // Get user profiles directly with admin access via service role function
      const { data: profiles, error: profilesError } = await supabase.functions.invoke('get-admin-profiles', {
        body: { 
          userId: session.user.id
        }
      }).catch(err => {
        // Fall back to regular query if the function doesn't exist
        return supabase
          .from('user_profiles')
          .select('*');
      });
      
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        toast.error("Failed to load user profiles");
      }
      
      // Create a map of profiles by ID for faster lookup
      const profilesMap = new Map();
      if (profiles) {
        profiles.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });
      }
      
      // Group territories by user_id
      const territoriesByUser = new Map();
      if (allTerritories && allTerritories.length > 0) {
        allTerritories.forEach(territory => {
          if (!territoriesByUser.has(territory.user_id)) {
            territoriesByUser.set(territory.user_id, []);
          }
          territoriesByUser.get(territory.user_id).push({
            zip_code: territory.zip_code,
            lead_type: territory.lead_type,
            active: territory.active
          });
        });
      }
      
      // Combine auth users with profiles and territories
      const combinedData = authUsers.map(authUser => {
        const profile = profilesMap.get(authUser.id) || {};
        const userTerritories = territoriesByUser.get(authUser.id) || [];
        
        return {
          ...profile,
          id: authUser.id,
          email: authUser.email,
          created_at: authUser.created_at,
          last_sign_in_at: authUser.last_sign_in_at,
          confirmed_at: authUser.confirmed_at,
          territories: userTerritories
        };
      });
      
      setUsers(combinedData);
      setIsLoading(false);
      return combinedData;
    } catch (error) {
      console.error("Error in fetchUsers:", error);
      setError("Failed to load users");
      toast.error("Failed to load users");
      setIsLoading(false);
      return [];
    }
  };

  useEffect(() => {
    fetchUsersAndTerritories();
  }, []);

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const hasTerritoryMatch = user.territories.some(t => 
      t.zip_code.toLowerCase().includes(searchLower)
    );
    
    return (
      (user.first_name?.toLowerCase().includes(searchLower) || false) ||
      (user.last_name?.toLowerCase().includes(searchLower) || false) ||
      (user.email?.toLowerCase().includes(searchLower) || false) ||
      (user.company?.toLowerCase().includes(searchLower) || false) ||
      (user.phone?.includes(searchTerm) || false) ||
      hasTerritoryMatch
    );
  });

  const handleViewUser = (user: UserWithTerritories) => {
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

  const handleDeletePrompt = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setIsDeleting(true);
      
      // Get authenticated session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in");
        setIsDeleting(false);
        return;
      }
      
      // Call the delete-user edge function
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId: userToDelete },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (error) throw error;
      
      if (data && data.error) {
        throw new Error(data.error);
      }
      
      // Update the UI by removing the deleted user
      setUsers(users.filter(user => user.id !== userToDelete));
      toast.success("User deleted successfully");
      
      // Close the modal
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(`Failed to delete user: ${error.message || 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUsersAndTerritories();
    toast.success("User data has been refreshed");
    setIsRefreshing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 mr-2 text-brand-600" />
          <h2 className="text-xl font-semibold">User Management</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users or zip codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Error loading users</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
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
                <TableHead>Territories</TableHead>
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
                      {user.first_name || user.last_name ? 
                        `${user.first_name || ''} ${user.last_name || ''}`.trim() : 
                        'N/A'
                      }
                      {user.company && <span className="block text-xs text-gray-500">{user.company}</span>}
                    </TableCell>
                    <TableCell>{user.email || 'N/A'}</TableCell>
                    <TableCell>{user.phone || 'N/A'}</TableCell>
                    <TableCell>
                      {user.territories.length > 0 ? (
                        <div className="max-h-20 overflow-y-auto">
                          {user.territories.map((territory, index) => (
                            <span 
                              key={index} 
                              className={`inline-block mr-1 mb-1 px-2 py-1 text-xs rounded ${
                                territory.active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {territory.zip_code}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">No territories</span>
                      )}
                    </TableCell>
                    <TableCell>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</TableCell>
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
                        {/* Skip delete button for the current admin */}
                        {user.email !== 'zepfarms@gmail.com' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeletePrompt(user.id)}
                            className="flex items-center"
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    {error ? 'Error loading users' : 'No users found matching your search.'}
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
                  <p>{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Last Sign In</h4>
                  <p>{selectedUser.last_sign_in_at ? new Date(selectedUser.last_sign_in_at).toLocaleDateString() : 'Never'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email Confirmed</h4>
                  <p>{selectedUser.confirmed_at ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Territories</h4>
                {selectedUser.territories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.territories.map((territory, i) => (
                      <span 
                        key={i}
                        className={`inline-block px-2.5 py-1 text-xs rounded ${
                          territory.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {territory.zip_code} ({territory.lead_type})
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No territories assigned</p>
                )}
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
            
            {selectedUser && selectedUser.email !== 'zepfarms@gmail.com' && (
              <Button 
                variant="destructive" 
                onClick={() => {
                  setIsDialogOpen(false);
                  handleDeletePrompt(selectedUser.id);
                }}
              >
                <UserX className="mr-2 h-4 w-4" />
                Delete User
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Alert Dialog */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account
              and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault(); // Prevent the dialog from closing automatically
                handleDeleteUser();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <UserX className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersTable;
