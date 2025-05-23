
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader, Search, Edit, UserPlus, Bell, Mail, MessageSquare } from 'lucide-react';
import { formatPhoneNumber } from '@/utils/formatters';

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  territory_zip_code: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  archived: boolean | null;
  user_id: string | null;
  user_info?: {
    first_name: string | null;
    last_name: string | null;
    email?: string;
  };
}

interface User {
  id: string;
  email: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
  };
  created_at: string;
}

const LeadsTable = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadNotes, setLeadNotes] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Fetch leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        
        console.log("Attempting to fetch all leads via admin edge function");
        
        // Get the current session for the auth header
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setErrorMessage("Authentication session not found");
          toast.error("Authentication session not found");
          setIsLoading(false);
          return;
        }

        // Call the edge function with proper authorization
        const { data, error } = await supabase.functions.invoke('get-admin-leads');
        
        if (error) {
          console.error("Admin leads edge function failed:", error);
          setErrorMessage("Failed to load leads: " + error.message);
          toast.error("Failed to load leads: " + error.message);
          setIsLoading(false);
          return;
        }
        
        if (!data?.leads) {
          console.error("No leads data returned", data);
          setErrorMessage("No leads data returned from server");
          toast.error("No leads data returned from server");
          setLeads([]);
          setIsLoading(false);
          return;
        }
        
        console.log(`Successfully fetched ${data.leads.length} leads via admin edge function`);
        setLeads(data.leads);
        
      } catch (error: any) {
        console.error("Error fetching leads:", error);
        setErrorMessage("Failed to load leads: " + error.message);
        toast.error("Failed to load leads");
        setLeads([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Load users for assignment
  const fetchUsers = async () => {
    if (users.length > 0) return; // Already loaded
    
    try {
      setIsLoadingUsers(true);
      const { data: allUsers, error: allUsersError } = await supabase.functions.invoke('get-all-users');
      
      if (allUsersError) {
        console.error("Error fetching all users:", allUsersError);
        toast.error("Failed to load users");
      } else if (allUsers) {
        setUsers(allUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const updateLeadNotes = async () => {
    if (!selectedLead) return;
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('leads')
        .update({ notes: leadNotes })
        .eq('id', selectedLead.id);
      
      if (error) throw error;
      
      // Update leads state
      setLeads(prev => prev.map(lead => 
        lead.id === selectedLead.id ? { ...lead, notes: leadNotes } : lead
      ));
      
      toast.success("Lead notes updated successfully");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating lead notes:", error);
      toast.error("Failed to update lead notes");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (lead.name?.toLowerCase().includes(searchLower) || false) ||
      (lead.email?.toLowerCase().includes(searchLower) || false) ||
      (lead.phone?.includes(searchTerm) || false) ||
      (lead.address?.toLowerCase().includes(searchLower) || false) ||
      lead.territory_zip_code.includes(searchTerm) ||
      (lead.status?.toLowerCase().includes(searchLower) || false)
    );
  });

  const handleEditNotes = (lead: Lead) => {
    setSelectedLead(lead);
    setLeadNotes(lead.notes || '');
    setIsDialogOpen(true);
  };

  const handleAssignLead = (lead: Lead) => {
    setSelectedLead(lead);
    setSelectedUserId(lead.user_id || '');
    setIsAssignDialogOpen(true);
    fetchUsers(); // Ensure users are loaded
  };

  const handleResendEmailNotification = async (lead: Lead) => {
    if (!lead.user_id) {
      toast.error("This lead is not assigned to any user");
      return;
    }
    
    try {
      setIsNotifying(true);
      console.log("Sending email notification for lead:", lead.id, "to user:", lead.user_id);
      
      const { data: notificationResult, error: notificationError } = await supabase.functions.invoke('notify-lead', {
        body: {
          leadId: lead.id,
          userId: lead.user_id,
          notificationType: "email"
        }
      });

      if (notificationError) {
        console.error("Error sending email notification:", notificationError);
        toast.error("Failed to send email notification");
      } else {
        console.log("Email notification result:", notificationResult);
        if (notificationResult.notificationResults.email) {
          toast.success("Email notification sent successfully");
        } else {
          toast.warning("Email notification failed. User may not have email notifications enabled.");
        }
      }
    } catch (error) {
      console.error("Failed to send email notification:", error);
      toast.error("Failed to send email notification");
    } finally {
      setIsNotifying(false);
    }
  };

  const handleResendSmsNotification = async (lead: Lead) => {
    if (!lead.user_id) {
      toast.error("This lead is not assigned to any user");
      return;
    }
    
    try {
      setIsSendingSms(true);
      console.log("Sending SMS notification for lead:", lead.id, "to user:", lead.user_id);
      
      const { data: notificationResult, error: notificationError } = await supabase.functions.invoke('notify-lead', {
        body: {
          leadId: lead.id,
          userId: lead.user_id,
          notificationType: "sms"
        }
      });

      if (notificationError) {
        console.error("Error sending SMS notification:", notificationError);
        toast.error("Failed to send SMS notification");
      } else {
        console.log("SMS notification result:", notificationResult);
        if (notificationResult.notificationResults.sms) {
          toast.success("SMS notification sent successfully");
        } else {
          toast.warning("SMS notification failed. User may not have SMS notifications enabled or a valid phone number.");
        }
      }
    } catch (error) {
      console.error("Failed to send SMS notification:", error);
      toast.error("Failed to send SMS notification");
    } finally {
      setIsSendingSms(false);
    }
  };

  const assignLeadToUser = async () => {
    if (!selectedLead) return;
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('leads')
        .update({ user_id: selectedUserId || null })
        .eq('id', selectedLead.id);
      
      if (error) throw error;
      
      // Find user info for the assigned user
      const assignedUser = users.find(user => user.id === selectedUserId);
      
      // Update leads state with new assignment
      setLeads(prev => prev.map(lead => {
        if (lead.id !== selectedLead.id) return lead;
        
        return {
          ...lead,
          user_id: selectedUserId || null,
          user_info: selectedUserId ? {
            first_name: assignedUser?.user_metadata?.first_name || null,
            last_name: assignedUser?.user_metadata?.last_name || null,
            email: assignedUser?.email
          } : undefined
        };
      }));
      
      // Send notification if assigning to a user (not unassigning)
      if (selectedUserId) {
        try {
          console.log("Sending notification for lead:", selectedLead.id, "to user:", selectedUserId);
          const { data: notificationResult, error: notificationError } = await supabase.functions.invoke('notify-lead', {
            body: {
              leadId: selectedLead.id,
              userId: selectedUserId
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
      
      toast.success(selectedUserId 
        ? `Lead assigned to ${assignedUser?.email}` 
        : "Lead unassigned successfully");
      setIsAssignDialogOpen(false);
    } catch (error) {
      console.error("Error assigning lead:", error);
      toast.error("Failed to assign lead to user");
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleLeadArchived = async (lead: Lead) => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('leads')
        .update({ archived: !lead.archived })
        .eq('id', lead.id);
      
      if (error) throw error;
      
      // Update leads state
      setLeads(prev => prev.map(l => 
        l.id === lead.id ? { ...l, archived: !lead.archived } : l
      ));
      
      toast.success(`Lead ${!lead.archived ? 'archived' : 'unarchived'} successfully`);
    } catch (error) {
      console.error("Error updating lead archived status:", error);
      toast.error("Failed to update lead status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800">New</Badge>;
      case 'contacted':
        return <Badge className="bg-yellow-100 text-yellow-800">Contacted</Badge>;
      case 'qualified':
        return <Badge className="bg-green-100 text-green-800">Qualified</Badge>;
      case 'closed':
        return <Badge className="bg-purple-100 text-purple-800">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatPhone = (phone: string | null) => {
    if (!phone) return '';
    return formatPhoneNumber(phone);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Leads Management</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8 animate-spin text-brand-600" />
          <span className="ml-2">Loading leads...</span>
        </div>
      ) : errorMessage ? (
        <div className="text-center py-8 bg-red-50 rounded-lg border border-red-100">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Leads</h3>
          <p className="text-red-600">{errorMessage}</p>
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700">No leads found</h3>
          <p className="text-gray-500 mt-2">There are no leads in the system yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Territory</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className={lead.archived ? "bg-gray-50" : ""}>
                  <TableCell className="font-medium">
                    {lead.name}
                    {lead.archived && <span className="ml-2 text-xs text-gray-500">(Archived)</span>}
                  </TableCell>
                  <TableCell>
                    {lead.email && <div>{lead.email}</div>}
                    {lead.phone && <div>{formatPhone(lead.phone)}</div>}
                  </TableCell>
                  <TableCell>{lead.territory_zip_code}</TableCell>
                  <TableCell>
                    {lead.user_info ? (
                      <>
                        {lead.user_info.first_name || ''} {lead.user_info.last_name || ''}
                        {lead.user_info.email && <span className="block text-xs text-gray-500">{lead.user_info.email}</span>}
                      </>
                    ) : (
                      <span className="text-gray-500">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(lead.status || 'New')}</TableCell>
                  <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignLead(lead)}
                        disabled={isUpdating}
                        title="Assign to user"
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Assign
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditNotes(lead)}
                        disabled={isUpdating}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Notes
                      </Button>
                      {lead.user_id && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResendEmailNotification(lead)}
                            disabled={isNotifying}
                            title="Resend email notification to assigned user"
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResendSmsNotification(lead)}
                            disabled={isSendingSms}
                            title="Resend SMS notification to assigned user"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            SMS
                          </Button>
                        </>
                      )}
                      <Button
                        variant={lead.archived ? "outline" : "secondary"}
                        size="sm"
                        onClick={() => toggleLeadArchived(lead)}
                        disabled={isUpdating}
                      >
                        {lead.archived ? "Unarchive" : "Archive"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Notes Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Lead Notes</DialogTitle>
            <DialogDescription>
              Update notes for {selectedLead?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              value={leadNotes}
              onChange={(e) => setLeadNotes(e.target.value)}
              placeholder="Enter notes about this lead..."
              className="min-h-[150px]"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={updateLeadNotes}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Notes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Lead Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Lead to User</DialogTitle>
            <DialogDescription>
              Select a user to assign this lead to
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {isLoadingUsers ? (
              <div className="flex justify-center items-center py-4">
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                <span>Loading users...</span>
              </div>
            ) : (
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.user_metadata?.first_name} {user.user_metadata?.last_name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAssignDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={assignLeadToUser}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Assign Lead"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadsTable;
