
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "sonner";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Dashboard = () => {
  // This would be populated with real data from Supabase
  const leads = [
    { id: 1, name: 'John Smith', phone: '(555) 123-4567', email: 'john@example.com', address: '123 Main St, Anytown, USA', zipCode: '90210', date: '2023-05-15', status: 'New' },
    { id: 2, name: 'Sarah Johnson', phone: '(555) 987-6543', email: 'sarah@example.com', address: '456 Oak Ave, Somewhere, USA', zipCode: '90210', date: '2023-05-14', status: 'Contacted' },
    { id: 3, name: 'Michael Brown', phone: '(555) 567-8901', email: 'michael@example.com', address: '789 Pine St, Nowhere, USA', zipCode: '90210', date: '2023-05-12', status: 'Negotiating' },
  ];

  // This would be populated with real data from Supabase
  const territories = [
    { zipCode: '90210', status: 'Active', startDate: '2023-04-01', nextBillingDate: '2023-06-01', leadCount: 8 },
    { zipCode: '90211', status: 'Active', startDate: '2023-05-01', nextBillingDate: '2023-06-01', leadCount: 3 },
  ];

  const handleAddArea = () => {
    toast.info("This functionality will be implemented with Supabase integration");
  };

  const handleRemoveArea = (zipCode: string) => {
    toast.info(`Area ${zipCode} would be removed. This will be implemented with Supabase.`);
  };

  const handleUpdateLeadStatus = (leadId: number, newStatus: string) => {
    toast.success(`Lead #${leadId} status updated to ${newStatus}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Manage your territories and leads</p>
            </div>
            <Button onClick={handleAddArea} className="mt-4 md:mt-0 bg-accent-600 hover:bg-accent-700">
              Add New Area
            </Button>
          </div>
          
          <Tabs defaultValue="leads">
            <TabsList className="mb-6">
              <TabsTrigger value="leads">My Leads</TabsTrigger>
              <TabsTrigger value="territories">My Territories</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="leads">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Leads</CardTitle>
                    <CardDescription>
                      Manage and track the status of your leads
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="py-3 px-4 font-medium">Name</th>
                            <th className="py-3 px-4 font-medium">Contact</th>
                            <th className="py-3 px-4 font-medium">Address</th>
                            <th className="py-3 px-4 font-medium">Date</th>
                            <th className="py-3 px-4 font-medium">Status</th>
                            <th className="py-3 px-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leads.map((lead) => (
                            <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4">{lead.name}</td>
                              <td className="py-3 px-4">
                                <div>{lead.phone}</div>
                                <div className="text-sm text-gray-500">{lead.email}</div>
                              </td>
                              <td className="py-3 px-4">
                                <div>{lead.address}</div>
                                <div className="text-sm text-gray-500">Zip: {lead.zipCode}</div>
                              </td>
                              <td className="py-3 px-4">{lead.date}</td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  lead.status === 'New' 
                                    ? 'bg-green-100 text-green-800' 
                                    : lead.status === 'Contacted' 
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {lead.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <select 
                                  className="text-sm border border-gray-300 rounded px-2 py-1"
                                  defaultValue={lead.status}
                                  onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                                >
                                  <option value="New">New</option>
                                  <option value="Contacted">Contacted</option>
                                  <option value="Negotiating">Negotiating</option>
                                  <option value="Closed">Closed</option>
                                  <option value="Lost">Lost</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="territories">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Territories</CardTitle>
                    <CardDescription>
                      Manage your exclusive zip code territories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="py-3 px-4 font-medium">Zip Code</th>
                            <th className="py-3 px-4 font-medium">Status</th>
                            <th className="py-3 px-4 font-medium">Start Date</th>
                            <th className="py-3 px-4 font-medium">Next Billing</th>
                            <th className="py-3 px-4 font-medium">Lead Count</th>
                            <th className="py-3 px-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {territories.map((territory) => (
                            <tr key={territory.zipCode} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium">{territory.zipCode}</td>
                              <td className="py-3 px-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {territory.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">{territory.startDate}</td>
                              <td className="py-3 px-4">{territory.nextBillingDate}</td>
                              <td className="py-3 px-4">{territory.leadCount}</td>
                              <td className="py-3 px-4">
                                <Button 
                                  variant="outline" 
                                  className="text-sm border-red-500 text-red-500 hover:bg-red-50"
                                  onClick={() => handleRemoveArea(territory.zipCode)}
                                >
                                  Cancel
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your account and notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-gray-500">
                    Profile settings will be implemented with Supabase integration.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>
                    Manage your payment methods and view invoices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-gray-500">
                    Billing information will be implemented with Stripe and Supabase integration.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
