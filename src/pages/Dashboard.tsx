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
import { X, Plus } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState({
    emails: [''],
    phones: ['']
  });
  const [subscriptionInfo, setSubscriptionInfo] = useState({
    totalMonthly: 0,
    nextRenewal: null,
    daysRemaining: 0
  });

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

      // Initialize secondary emails array to an empty array by default
      const secondaryEmails = profile.secondary_emails || [];
      // Get email from auth session
      const { data: { session } } = await supabase.auth.getSession();
      const primaryEmail = session?.user?.email || '';
      
      // Initialize secondary phones array to an empty array by default
      const secondaryPhones = profile.secondary_phones || [];
      const primaryPhone = profile.phone || '';
      
      // Set contacts with primary and secondary emails
      setContacts({
        emails: [primaryEmail, ...secondaryEmails],
        phones: [primaryPhone, ...secondaryPhones]
      });

      // Get territories
      const { data: territoriesData, error: territoriesError } = await supabase
        .from('territories')
        .select('*')
        .eq('user_id', userId)
        .eq('active', true);
      
      if (territoriesError) throw territoriesError;
      setTerritories(territoriesData);

      // Calculate subscription info
      if (territoriesData && territoriesData.length > 0) {
        // Find earliest next billing date
        const nextBillingDates = territoriesData
          .map(t => t.next_billing_date)
          .filter(date => date) // Filter out null dates
          .sort();
          
        if (nextBillingDates.length > 0) {
          const nextRenewal = new Date(nextBillingDates[0]);
          const today = new Date();
          const daysRemaining = Math.ceil((nextRenewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          setSubscriptionInfo({
            totalMonthly: territoriesData.length * 99.99, // Assuming $99.99 per territory
            nextRenewal: nextRenewal,
            daysRemaining: daysRemaining
          });
        }
      }

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

  // Handle adding a new contact email field
  const handleAddEmail = () => {
    if (contacts.emails.length < 3) {
      setContacts(prev => ({
        ...prev,
        emails: [...prev.emails, '']
      }));
    } else {
      toast.error('Maximum of 3 email addresses allowed');
    }
  };

  // Handle adding a new contact phone field
  const handleAddPhone = () => {
    if (contacts.phones.length < 3) {
      setContacts(prev => ({
        ...prev,
        phones: [...prev.phones, '']
      }));
    } else {
      toast.error('Maximum of 3 phone numbers allowed');
    }
  };

  // Handle removing a contact field
  const handleRemoveEmail = (index) => {
    if (index === 0) {
      toast.error('Primary email cannot be removed');
      return;
    }
    setContacts(prev => ({
      ...prev,
      emails: prev.emails.filter((_, i) => i !== index)
    }));
  };

  const handleRemovePhone = (index) => {
    if (index === 0) {
      toast.error('Primary phone cannot be removed');
      return;
    }
    setContacts(prev => ({
      ...prev,
      phones: prev.phones.filter((_, i) => i !== index)
    }));
  };

  // Handle changing a contact value
  const handleEmailChange = (index, value) => {
    setContacts(prev => {
      const newEmails = [...prev.emails];
      newEmails[index] = value;
      return { ...prev, emails: newEmails };
    });
  };

  const handlePhoneChange = (index, value) => {
    setContacts(prev => {
      const newPhones = [...prev.phones];
      newPhones[index] = value;
      return { ...prev, phones: newPhones };
    });
  };

  // Profile form schema
  const profileSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    company: z.string().optional(),
    email: z.string().email(),
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
      
      // Get secondary emails and phones (excluding the primary ones)
      const secondaryEmails = contacts.emails.slice(1);
      const secondaryPhones = contacts.phones.slice(1);
      
      // Update profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          first_name: values.firstName,
          last_name: values.lastName,
          company: values.company,
          phone: contacts.phones[0], // Primary phone
          secondary_phones: secondaryPhones, // Additional phones
          secondary_emails: secondaryEmails, // Additional emails
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

  // Stripe customer portal handler
  const handleManageBilling = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('You must be logged in');
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        body: { returnUrl: window.location.origin + '/dashboard' }
      });
      
      if (error) throw error;
      
      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
      
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open billing portal');
    } finally {
      setIsLoading(false);
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
                        
                        <div className="border-t pt-6">
                          <h3 className="font-medium mb-4">Contact Information</h3>
                          
                          <div className="space-y-4">
                            <div>
                              <FormLabel>Email Addresses (for lead notifications)</FormLabel>
                              <div className="space-y-2">
                                {contacts.emails.map((email, index) => (
                                  <div key={`email-${index}`} className="flex items-center gap-2">
                                    <Input 
                                      type="email"
                                      placeholder={index === 0 ? "Primary Email" : "Additional Email"}
                                      value={email}
                                      onChange={(e) => handleEmailChange(index, e.target.value)}
                                      className="flex-1"
                                    />
                                    {index === 0 ? (
                                      <div className="w-8 h-8 flex items-center justify-center">
                                        <span className="text-xs text-gray-500">Primary</span>
                                      </div>
                                    ) : (
                                      <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleRemoveEmail(index)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                                
                                {contacts.emails.length < 3 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={handleAddEmail}
                                  >
                                    <Plus className="h-4 w-4 mr-2" /> Add Email
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <FormLabel>Phone Numbers (for lead notifications)</FormLabel>
                              <div className="space-y-2">
                                {contacts.phones.map((phone, index) => (
                                  <div key={`phone-${index}`} className="flex items-center gap-2">
                                    <Input 
                                      type="tel"
                                      placeholder={index === 0 ? "Primary Phone" : "Additional Phone"}
                                      value={phone}
                                      onChange={(e) => handlePhoneChange(index, e.target.value)}
                                      className="flex-1"
                                    />
                                    {index === 0 ? (
                                      <div className="w-8 h-8 flex items-center justify-center">
                                        <span className="text-xs text-gray-500">Primary</span>
                                      </div>
                                    ) : (
                                      <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleRemovePhone(index)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                                
                                {contacts.phones.length < 3 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={handleAddPhone}
                                  >
                                    <Plus className="h-4 w-4 mr-2" /> Add Phone
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
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
                    Manage your payment methods and subscriptions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">Loading billing information...</div>
                  ) : territories.length > 0 ? (
                    <div className="space-y-6">
                      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Subscription Summary
                          </h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Details about your territory subscriptions
                          </p>
                        </div>
                        <div className="border-t border-gray-200">
                          <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Active Territories</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {territories.length}
                              </dd>
                            </div>
                            
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Monthly Total</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                ${subscriptionInfo.totalMonthly.toFixed(2)}
                              </dd>
                            </div>
                            
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Next Billing Date</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {subscriptionInfo.nextRenewal ? new Date(subscriptionInfo.nextRenewal).toLocaleDateString() : 'N/A'}
                                {subscriptionInfo.daysRemaining > 0 && (
                                  <span className="ml-2 text-sm text-gray-500">
                                    ({subscriptionInfo.daysRemaining} days remaining)
                                  </span>
                                )}
                              </dd>
                            </div>
                            
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <Button onClick={handleManageBilling}>
                                  Manage Payment Methods
                                </Button>
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <div className="flex">
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Need Help?</h3>
                            <div className="mt-2 text-sm text-blue-700">
                              <p>
                                For billing questions or to discuss custom territory packages, please contact our support team.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You don't have any active territories yet</p>
                      <Button onClick={handleAddArea}>Add Your First Territory</Button>
                    </div>
                  )}
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
