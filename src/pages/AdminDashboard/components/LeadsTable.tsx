
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader, Search, Edit } from 'lucide-react';

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
  archived: boolean;
  user_id: string | null;
  user_profile?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
}

const LeadsTable = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadNotes, setLeadNotes] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true);
        
        // Fetch leads
        const { data, error } = await supabase
          .from('leads')
          .select(`
            *,
            user_profiles:user_id (
              first_name,
              last_name
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // For demo purposes, simulate the join with user email
        // In production, you would handle this through Supabase functions
        const authData = await supabase.auth.admin.listUsers();
        const authUsers = authData.data?.users || [];

        const processedData = data.map(lead => {
          if (!lead.user_id) return lead;
          
          const authUser = authUsers.find(u => u.id === lead.user_id);
          return {
            ...lead,
            user_profile: {
              ...lead.user_profiles,
              email: authUser?.email || 'N/A'
            }
          };
        });
        
        setLeads(processedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast.error("Failed to load leads");
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

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
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className={lead.archived ? "bg-gray-50" : ""}>
                    <TableCell className="font-medium">
                      {lead.name}
                      {lead.archived && <span className="ml-2 text-xs text-gray-500">(Archived)</span>}
                    </TableCell>
                    <TableCell>
                      {lead.email && <div>{lead.email}</div>}
                      {lead.phone && <div>{lead.phone}</div>}
                    </TableCell>
                    <TableCell>{lead.territory_zip_code}</TableCell>
                    <TableCell>
                      {lead.user_profile ? (
                        <>
                          {lead.user_profile.first_name} {lead.user_profile.last_name}
                          <span className="block text-xs text-gray-500">{lead.user_profile.email}</span>
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
                          onClick={() => handleEditNotes(lead)}
                          disabled={isUpdating}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Notes
                        </Button>
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No leads found matching your search.
                  </TableCell>
                </TableRow>
              )}
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
    </div>
  );
};

export default LeadsTable;
