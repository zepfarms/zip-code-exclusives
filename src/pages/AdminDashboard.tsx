
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";

const AdminDashboard = () => {
  // Mock data updated to include user_type and lead_type
  const [clients] = useState([
    { id: '1', name: 'John Smith', email: 'john@example.com', phone: '(555) 123-4567', territories: [{ zip: '90210', leadType: 'agent' }, { zip: '90211', leadType: 'investor' }], leadsReceived: 11, activeDate: '2023-04-01', userType: 'agent', licenseState: 'California', licenseNumber: 'CA12345678' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '(555) 987-6543', territories: [{ zip: '90220', leadType: 'investor' }], leadsReceived: 5, activeDate: '2023-04-15', userType: 'investor', licenseState: null, licenseNumber: null },
    { id: '3', name: 'David Wilson', email: 'david@example.com', phone: '(555) 234-5678', territories: [{ zip: '90230', leadType: 'agent' }, { zip: '90231', leadType: 'agent' }, { zip: '90232', leadType: 'investor' }], leadsReceived: 17, activeDate: '2023-05-01', userType: 'agent', licenseState: 'Nevada', licenseNumber: 'NV87654321' },
  ]);

  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    leadType: 'investor', // Default lead type - now fixed to 'investor'
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewLead(prev => ({ ...prev, [name]: value }));
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLead.name || !newLead.zipCode) {
      toast.error("Name and Zip Code are required");
      return;
    }
    
    // Find client with this zip code and matching lead type
    const matchingClient = clients.find(client => 
      client.territories.some(territory => 
        territory.zip === newLead.zipCode && territory.leadType === newLead.leadType
      )
    );
    
    if (matchingClient) {
      toast.success(`${newLead.leadType.charAt(0).toUpperCase() + newLead.leadType.slice(1)} lead assigned to ${matchingClient.name} (${matchingClient.email})`);
      // Reset form
      setNewLead({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        leadType: 'investor',
        notes: ''
      });
    } else {
      toast.error(`No ${newLead.leadType} found for zip code ${newLead.zipCode}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-brand-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold">LeadXclusive</span>
            <span className="ml-3 bg-amber-500 text-amber-900 py-1 px-2 rounded text-xs font-bold">
              ADMIN
            </span>
          </div>
          <Button variant="ghost" className="text-white hover:bg-brand-700">
            Logout
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <Tabs defaultValue="leads">
          <TabsList className="mb-6">
            <TabsTrigger value="leads">Add Lead</TabsTrigger>
            <TabsTrigger value="clients">Manage Clients</TabsTrigger>
            <TabsTrigger value="territories">Territories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leads">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Lead</CardTitle>
                  <CardDescription>
                    Enter lead information to assign to the appropriate client
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddLead} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Lead Name <span className="text-red-500">*</span>
                      </label>
                      <Input 
                        id="name"
                        name="name"
                        value={newLead.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                          Phone Number
                        </label>
                        <Input 
                          id="phone"
                          name="phone"
                          value={newLead.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </label>
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          value={newLead.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="address" className="text-sm font-medium">
                        Street Address
                      </label>
                      <Input 
                        id="address"
                        name="address"
                        value={newLead.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="city" className="text-sm font-medium">
                          City
                        </label>
                        <Input 
                          id="city"
                          name="city"
                          value={newLead.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="state" className="text-sm font-medium">
                          State
                        </label>
                        <Input 
                          id="state"
                          name="state"
                          value={newLead.state}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="zipCode" className="text-sm font-medium">
                          Zip Code <span className="text-red-500">*</span>
                        </label>
                        <Input 
                          id="zipCode"
                          name="zipCode"
                          value={newLead.zipCode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Removed the lead type selection - now fixed to 'investor' */}
                    <input type="hidden" name="leadType" value="investor" />
                    
                    <div className="space-y-2">
                      <label htmlFor="notes" className="text-sm font-medium">
                        Notes
                      </label>
                      <Textarea 
                        id="notes"
                        name="notes"
                        value={newLead.notes}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-accent-600 hover:bg-accent-700">
                      Add Lead & Assign to Client
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Lead Assignment Preview</CardTitle>
                  <CardDescription>
                    See which client will receive this lead
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {newLead.zipCode ? (
                    <div>
                      {clients.some(client => 
                        client.territories.some(
                          territory => territory.zip === newLead.zipCode && territory.leadType === newLead.leadType
                        )
                      ) ? (
                        clients.filter(client => 
                          client.territories.some(
                            territory => territory.zip === newLead.zipCode && territory.leadType === newLead.leadType
                          )
                        ).map(client => (
                          <div key={client.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="font-bold text-green-800">
                              Lead will be assigned to:
                            </div>
                            <div className="mt-2 space-y-1">
                              <div><span className="font-medium">Name:</span> {client.name}</div>
                              <div><span className="font-medium">Email:</span> {client.email}</div>
                              <div><span className="font-medium">Phone:</span> {client.phone}</div>
                              <div><span className="font-medium">Type:</span> {client.userType === 'agent' ? 'Real Estate Agent' : 'Investor'}</div>
                              {client.userType === 'agent' && (
                                <div><span className="font-medium">License:</span> {client.licenseState} #{client.licenseNumber}</div>
                              )}
                              <div className="mt-2 text-sm text-green-700">
                                This client has received {client.leadsReceived} leads to date.
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="font-bold text-amber-800">No client found for this zip code</div>
                          <div className="mt-2 text-amber-700">
                            Zip code {newLead.zipCode} isn't currently assigned to any client.
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Enter a zip code to see client assignment
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Client Management</CardTitle>
                <CardDescription>
                  View and manage your client accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 font-medium">Name</th>
                        <th className="py-3 px-4 font-medium">Contact</th>
                        <th className="py-3 px-4 font-medium">Type</th>
                        <th className="py-3 px-4 font-medium">Territories</th>
                        <th className="py-3 px-4 font-medium">Leads</th>
                        <th className="py-3 px-4 font-medium">Status</th>
                        <th className="py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map(client => (
                        <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{client.name}</td>
                          <td className="py-3 px-4">
                            <div>{client.email}</div>
                            <div className="text-sm text-gray-500">{client.phone}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              client.userType === 'agent' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {client.userType === 'agent' ? 'Agent' : 'Investor'}
                            </span>
                            {client.userType === 'agent' && (
                              <div className="text-xs text-gray-500 mt-1">
                                License: {client.licenseState} #{client.licenseNumber}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {client.territories.map(territory => (
                                <span 
                                  key={`${territory.zip}-${territory.leadType}`} 
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200"
                                >
                                  {territory.zip}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">{client.leadsReceived}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm" className="text-brand-700 hover:text-brand-800 hover:bg-brand-50">
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="territories">
            <Card>
              <CardHeader>
                <CardTitle>Territory Management</CardTitle>
                <CardDescription>
                  View availability and assignments of zip codes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">
                  Territory management will be implemented with Supabase integration.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
