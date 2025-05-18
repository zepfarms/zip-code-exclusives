
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('You must be logged in to view this page');
        navigate('/login');
        return;
      }

      // Load user data
      fetchUserData(session.user.id);
    };

    checkAuth();
  }, [navigate]);

  const fetchUserData = async (userId) => {
    setIsLoading(true);
    
    try {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      setUserProfile(profile);

      // Get territories
      const { data: territoriesData, error: territoriesError } = await supabase
        .from('territories')
        .select('*')
        .eq('user_id', userId)
        .eq('active', true);
      
      if (territoriesError) throw territoriesError;
      setTerritories(territoriesData);

      // Get leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .eq('archived', false)
        .order('created_at', { ascending: false });
      
      if (leadsError) throw leadsError;
      setLeads(leadsData);

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddArea = () => {
    navigate('/add-territory');
  };

  const handleRemoveArea = async (territoryId, zipCode) => {
    const confirm = window.confirm(
      `Are you sure you want to cancel your subscription for ${zipCode}? ` +
      `Your territory will remain active until the end of the current billing cycle.`
    );
    
    if (confirm) {
      try {
        const { error } = await supabase
          .from('territories')
          .update({ active: false })
          .eq('id', territoryId);
        
        if (error) throw error;
        
        toast.success(`Territory ${zipCode} has been cancelled. It will remain active until the end of the current billing cycle.`);
        
        // Refresh territories list
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data, error: fetchError } = await supabase
            .from('territories')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('active', true);
          
          if (fetchError) throw fetchError;
          setTerritories(data);
        }
      } catch (error) {
        console.error('Error cancelling territory:', error);
        toast.error('Failed to cancel territory');
      }
    }
  };

  const handleUpdateLeadStatus = async (leadId, newStatus) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);
      
      if (error) throw error;
      toast.success(`Lead status updated to ${newStatus}`);
      
      // Update in the local state
      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast.error('Failed to update lead status');
    }
  };

  // Profile form schema
  const profileSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    company: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    notificationEmail: z.boolean(),
    notificationSms: z.boolean()
  });

  // Profile form
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: userProfile?.first_name || '',
      lastName: userProfile?.last_name || '',
      company: userProfile?.company || '',
      email: '',
      phone: userProfile?.phone || '',
      notificationEmail: userProfile?.notification_email || true,
      notificationSms: userProfile?.notification_sms || false
    }
  });

  // Update form values when userProfile loads
  useEffect(() => {
    if (userProfile) {
      profileForm.reset({
        firstName: userProfile.first_name || '',
        lastName: userProfile.last_name || '',
        company: userProfile.company || '',
        email: '', // Will be filled from auth session
        phone: userProfile.phone || '',
        notificationEmail: userProfile.notification_email,
        notificationSms: userProfile.notification_sms
      });
      
      // Get email from auth session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          profileForm.setValue('email', session.user.email);
        }
      });
    }
  }, [userProfile]);

  const onProfileSubmit = async (values) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      
      // Update profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          first_name: values.firstName,
          last_name: values.lastName,
          company: values.company,
          phone: values.phone,
          notification_email: values.notificationEmail,
          notification_sms: values.notificationSms,
          updated_at: new Date().toISOString() // Convert Date to string
        })
        .eq('id', session.user.id);
      
      if (updateError) throw updateError;
      
      // Check if email needs to be updated
      if (values.email !== session.user.email) {
        const { error: emailUpdateError } = await supabase.auth.updateUser({
          email: values.email
        });
        
        if (emailUpdateError) throw emailUpdateError;
        toast.info('A confirmation email has been sent to your new email address');
      }
      
      toast.success('Profile updated successfully');
      
      // Refresh user data
      fetchUserData(session.user.id);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
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
                    {isLoading ? (
                      <div className="text-center py-8">Loading leads...</div>
                    ) : leads.length > 0 ? (
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
                                  <div className="text-sm text-gray-500">Zip: {lead.territory_zip_code}</div>
                                </td>
                                <td className="py-3 px-4">{new Date(lead.created_at).toLocaleDateString()}</td>
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
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No leads available yet. They will appear here once generated for your territories.
                      </div>
                    )}
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
                    {isLoading ? (
                      <div className="text-center py-8">Loading territories...</div>
                    ) : territories.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="py-3 px-4 font-medium">Zip Code</th>
                              <th className="py-3 px-4 font-medium">Status</th>
                              <th className="py-3 px-4 font-medium">Start Date</th>
                              <th className="py-3 px-4 font-medium">Next Billing</th>
                              <th className="py-3 px-4 font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {territories.map((territory) => (
                              <tr key={territory.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium">{territory.zip_code}</td>
                                <td className="py-3 px-4">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                  </span>
                                </td>
                                <td className="py-3 px-4">{territory.start_date ? new Date(territory.start_date).toLocaleDateString() : 'N/A'}</td>
                                <td className="py-3 px-4">{territory.next_billing_date ? new Date(territory.next_billing_date).toLocaleDateString() : 'N/A'}</td>
                                <td className="py-3 px-4">
                                  <Button 
                                    variant="outline" 
                                    className="text-sm border-red-500 text-red-500 hover:bg-red-50"
                                    onClick={() => handleRemoveArea(territory.id, territory.zip_code)}
                                  >
                                    Cancel
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No territories found. Click "Add New Area" to get started.
                      </div>
                    )}
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
                  {isLoading ? (
                    <div className="text-center py-8">Loading profile...</div>
                  ) : (
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={profileForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Doe" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={profileForm.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company</FormLabel>
                              <FormControl>
                                <Input placeholder="Your Company LLC" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="your@email.com" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Email address for account notifications
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <Input placeholder="(555) 123-4567" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Phone number for lead notifications
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="border-t pt-6">
                          <h3 className="font-medium mb-4">Notification Preferences</h3>
                          
                          <div className="space-y-4">
                            <FormField
                              control={profileForm.control}
                              name="notificationEmail"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Email Notifications</FormLabel>
                                    <FormDescription>
                                      Receive lead notifications via email
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={profileForm.control}
                              name="notificationSms"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">SMS Notifications</FormLabel>
                                    <FormDescription>
                                      Receive lead notifications via text message
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <Button type="submit" className="bg-brand-700 hover:bg-brand-800">
                          Save Changes
                        </Button>
                      </form>
                    </Form>
                  )}
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
