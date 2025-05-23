
import React, { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Mail, Phone, MapPin, User, FileText, Calendar } from 'lucide-react';
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
}

interface LeadDetailsModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdated: (updatedLead: Lead) => void;
}

const LeadDetailsModal = ({ lead, isOpen, onClose, onLeadUpdated }: LeadDetailsModalProps) => {
  const [status, setStatus] = useState(lead?.status || 'New');
  const [notes, setNotes] = useState(lead?.notes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // Reset form when lead changes
  React.useEffect(() => {
    if (lead) {
      setStatus(lead.status || 'New');
      setNotes(lead.notes || '');
    }
  }, [lead]);

  const handleSave = async () => {
    if (!lead) return;

    try {
      setIsUpdating(true);

      const { data, error } = await supabase
        .from('leads')
        .update({ 
          status,
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', lead.id)
        .select()
        .single();

      if (error) throw error;

      const updatedLead = {
        ...lead,
        status,
        notes,
        updated_at: data.updated_at
      };

      onLeadUpdated(updatedLead);
      toast.success("Lead updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Failed to update lead");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800">New</Badge>;
      case 'working':
        return <Badge className="bg-yellow-100 text-yellow-800">Working</Badge>;
      case 'qualified':
        return <Badge className="bg-green-100 text-green-800">Qualified</Badge>;
      case 'closed':
        return <Badge className="bg-purple-100 text-purple-800">Closed</Badge>;
      case 'deleted':
        return <Badge className="bg-red-100 text-red-800">Deleted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Lead Details: {lead.name}
          </DialogTitle>
          <DialogDescription>
            View and update lead information and status
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Name</span>
                </div>
                <div className="font-medium">{lead.name}</div>
              </div>
              
              {lead.email && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </div>
                  <div className="font-medium">
                    <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                      {lead.email}
                    </a>
                  </div>
                </div>
              )}
              
              {lead.phone && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>Phone</span>
                  </div>
                  <div className="font-medium">
                    <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                      {formatPhoneNumber(lead.phone)}
                    </a>
                  </div>
                </div>
              )}
              
              {lead.address && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>Address</span>
                  </div>
                  <div className="font-medium">{lead.address}</div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Lead Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Lead Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Territory Zip Code</span>
                </div>
                <div className="font-medium">{lead.territory_zip_code}</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Created Date</span>
                </div>
                <div className="font-medium">{new Date(lead.created_at).toLocaleDateString()}</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Current Status</span>
                </div>
                <div>{getStatusBadge(lead.status)}</div>
              </div>
              
              {lead.updated_at !== lead.created_at && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Last Updated</span>
                  </div>
                  <div className="font-medium">{new Date(lead.updated_at).toLocaleDateString()}</div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Status Update */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Update Status</h3>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Working">Working</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notes</h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this lead..."
              className="min-h-[120px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailsModal;
