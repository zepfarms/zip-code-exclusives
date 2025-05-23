
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { fetchUserData } from '@/utils/dashboardFunctions';
import { updateUserProfile } from '@/utils/userProfile';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { formatPhoneNumber } from '@/utils/formatters';

const Dashboard = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [territories, setTerritories] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [contacts, setContacts] = useState<{ emails: string[], phones: string[] }>({ emails: [], phones: [] });
  const [subscriptionInfo, setSubscriptionInfo] = useState<{ totalMonthly: number, nextRenewal: string | null, daysRemaining: number }>({
    totalMonthly: 0,
    nextRenewal: null,
    daysRemaining: 0
  });
  
  // Form states for profile editing
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [formattedPhone, setFormattedPhone] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [notifyEmail, setNotifyEmail] = useState<boolean>(true);
  const [notifySms, setNotifySms] = useState<boolean>(false);

  // Monitor authentication state
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.info('Auth state changed:', event, session?.user.email);
        if (session?.user) {
          setUserId(session.user.id);
          setIsAuthenticated(true);
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserId(null);
      }
    });

    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        setUserId(session.user.id);
        setIsAuthenticated(true);
      } else {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Clean up subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated && userId) {
      console.info('User authenticated, loading data for:', userId);
      
      fetchUserData(
        userId,
        setUserProfile,
        setTerritories,
        setLeads,
        setContacts,
        setSubscriptionInfo,
        setIsLoading
      );
    }
  }, [isAuthenticated, userId]);

  // Update form state when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.first_name || '');
      setLastName(userProfile.last_name || '');
      
      // Display the phone number if it exists in profile
      const phoneNumber = userProfile.phone || '';
      setPhone(phoneNumber);
      setFormattedPhone(formatPhoneNumber(phoneNumber));
      
      setNotifyEmail(userProfile.notification_email ?? true);
      setNotifySms(userProfile.notification_sms ?? false);
      
      console.log("Updated form state from profile:", {
        phone: phoneNumber,
        formattedPhone: formatPhoneNumber(phoneNumber),
        notifySms: userProfile.notification_sms
      });
    }
  }, [userProfile]);

  // Handle phone number input with US formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const input = e.target.value.replace(/\D/g, '');
    setPhone(input);
    setFormattedPhone(formatPhoneNumber(input));
  };

  const handleSaveProfile = async () => {
    if (!userId) return;
    
    setIsSaving(true);
    
    try {
      // Format phone to store standardized format (digits only)
      const formattedPhone = phone ? phone.replace(/\D/g, '') : '';
      
      console.log('Saving profile with phone:', formattedPhone);
      
      const updatedProfile = await updateUserProfile(userId, {
        first_name: firstName,
        last_name: lastName,
        phone: formattedPhone,
        notification_email: notifyEmail,
        notification_sms: notifySms && !!formattedPhone // Only enable SMS if phone is provided
      });
      
      // Update local state with the returned profile
      if (updatedProfile) {
        setUserProfile(updatedProfile);
        
        // Update contacts state to reflect the changes
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setContacts({
            emails: [session.user.email || '', ...(updatedProfile.secondary_emails || [])],
            phones: [updatedProfile.phone || '', ...(updatedProfile.secondary_phones || [])]
          });
        }
        
        console.log("Profile updated successfully:", {
          phone: updatedProfile.phone,
          notification_sms: updatedProfile.notification_sms
        });
      }
    } catch (err) {
      console.error('Error in profile update:', err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated && !isLoading) {
    // Redirect to login if not authenticated
    window.location.href = '/login?redirect=/dashboard';
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-xl">Loading your dashboard...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Welcome Card */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Welcome{firstName ? `, ${firstName}` : ''}!</CardTitle>
                <CardDescription>
                  Here's an overview of your exclusive territories and leads.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="stats grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="stat bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold">Territories</h3>
                    <p className="text-3xl font-bold">{territories?.length || 0}</p>
                  </div>
                  <div className="stat bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold">Active Leads</h3>
                    <p className="text-3xl font-bold">{leads?.length || 0}</p>
                  </div>
                  <div className="stat bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold">Monthly Investment</h3>
                    <p className="text-3xl font-bold">${subscriptionInfo.totalMonthly}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Territories Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Your Territories</CardTitle>
                <CardDescription>
                  You have exclusive rights to leads in these zip codes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {territories && territories.length > 0 ? (
                  <div className="space-y-4">
                    {territories.map(territory => (
                      <div key={territory.id} className="border p-4 rounded-lg flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-lg">Zip Code: {territory.zip_code}</h4>
                          <p className="text-sm text-muted-foreground">Type: {territory.lead_type || 'All leads'}</p>
                          <p className="text-sm text-muted-foreground">
                            Next billing: {new Date(territory.next_billing_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="bg-green-100 px-3 py-1 rounded text-green-800">
                          Active
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">You don't have any territories yet.</p>
                    <Button className="mt-4" onClick={() => window.location.href = '/add-territory'}>
                      Add Territory
                    </Button>
                  </div>
                )}
              </CardContent>
              {territories && territories.length > 0 && (
                <CardFooter>
                  <Button variant="outline" onClick={() => window.location.href = '/add-territory'}>
                    Add Another Territory
                  </Button>
                </CardFooter>
              )}
            </Card>
            
            {/* Subscription Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>
                  Your subscription details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Monthly Total</p>
                  <p className="text-2xl font-bold">${subscriptionInfo.totalMonthly}</p>
                </div>
                
                {subscriptionInfo.nextRenewal && (
                  <div>
                    <p className="text-sm font-medium">Next Renewal</p>
                    <p>{new Date(subscriptionInfo.nextRenewal).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {subscriptionInfo.daysRemaining} days remaining
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Leads Tab */}
        <TabsContent value="leads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Leads</CardTitle>
              <CardDescription>
                Manage and track your exclusive leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              {leads && leads.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-2 font-medium">Name</th>
                        <th className="text-left p-2 font-medium">Contact</th>
                        <th className="text-left p-2 font-medium">Zip Code</th>
                        <th className="text-left p-2 font-medium">Status</th>
                        <th className="text-left p-2 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map(lead => (
                        <tr key={lead.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">{lead.name || 'Unknown'}</td>
                          <td className="p-2">
                            {lead.email && <div>{lead.email}</div>}
                            {lead.phone && <div>{lead.phone}</div>}
                          </td>
                          <td className="p-2">{lead.territory_zip_code}</td>
                          <td className="p-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {lead.status || 'New'}
                            </span>
                          </td>
                          <td className="p-2 text-sm text-muted-foreground">
                            {new Date(lead.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You don't have any leads yet.</p>
                  <p className="mt-2">
                    Leads will appear here when they're assigned to your territories.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Update your profile information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                      placeholder="Your first name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={formattedPhone} 
                    onChange={handlePhoneChange} 
                    placeholder="(555) 123-4567"
                    type="tel"
                    maxLength={14} // Account for formatting characters
                  />
                  <p className="text-sm text-muted-foreground">
                    Format: (555) 123-4567 (US numbers only)
                  </p>
                </div>
              </div>
              
              <Separator />
              
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contact Information</h3>
                
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {contacts.emails[0]?.substring(0, 2).toUpperCase() || 'NA'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">{contacts.emails[0] || 'No email set'}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        PH
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">{formatPhoneNumber(userProfile?.phone || '') || 'No phone number set'}</div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Notification Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifyEmail" className="block">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive new lead notifications by email</p>
                    </div>
                    <Switch 
                      id="notifyEmail" 
                      checked={notifyEmail} 
                      onCheckedChange={setNotifyEmail}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifySms" className="block">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive new lead notifications by text message</p>
                    </div>
                    <Switch 
                      id="notifySms" 
                      checked={notifySms} 
                      onCheckedChange={checked => {
                        setNotifySms(checked);
                        // If enabling SMS but no phone number, show a warning
                        if (checked && !phone) {
                          toast.warning("A phone number is required for SMS notifications");
                        }
                      }}
                      disabled={!phone}
                    />
                  </div>
                  
                  {notifySms && !phone && (
                    <p className="text-sm text-amber-600">
                      A phone number is required for SMS notifications. Please add your phone number above.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
