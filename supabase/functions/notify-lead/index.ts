
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import * as SendGrid from "https://esm.sh/@sendgrid/mail@7.7.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Initialize SendGrid
SendGrid.setApiKey(SENDGRID_API_KEY);

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadNotificationPayload {
  leadId: string;
  userId: string;
}

async function sendEmail(email: string, lead: any) {
  const msg = {
    to: email,
    from: "leads@leadxclusive.com", // Use your verified sender
    subject: "New Lead Notification",
    html: `
      <h2>New Lead Assigned</h2>
      <p>A new lead has been assigned to you:</p>
      <ul>
        <li><strong>Name:</strong> ${lead.name || 'Not provided'}</li>
        <li><strong>Email:</strong> ${lead.email || 'Not provided'}</li>
        <li><strong>Phone:</strong> ${lead.phone || 'Not provided'}</li>
        <li><strong>Address:</strong> ${lead.address || 'Not provided'}</li>
        <li><strong>Zip Code:</strong> ${lead.territory_zip_code}</li>
      </ul>
      <p>Log in to your dashboard to manage this lead.</p>
    `,
  };

  try {
    await SendGrid.send(msg);
    console.log("Email notification sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending email notification:", error);
    return false;
  }
}

async function sendSms(phone: string, lead: any) {
  // Using Email-to-SMS gateways (free option)
  // This will only work with US phone numbers and certain carriers
  
  // Format: number@carrier-gateway
  // Examples:
  // AT&T: number@txt.att.net
  // T-Mobile: number@tmomail.net
  // Verizon: number@vtext.com
  // Sprint: number@messaging.sprintpcs.com

  // We'll try all major carriers (if one fails, hopefully another will work)
  const carriers = [
    "txt.att.net", 
    "tmomail.net", 
    "vtext.com", 
    "messaging.sprintpcs.com"
  ];
  
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length !== 10) {
    console.error("Invalid phone number format");
    return false;
  }
  
  try {
    // Try sending to all carriers
    const emailPromises = carriers.map(carrier => {
      const smsMsg = {
        to: `${cleanPhone}@${carrier}`,
        from: "leads@leadxclusive.com", // Use your verified sender
        subject: "New Lead",
        text: `New lead: ${lead.name || 'Unknown'} - ${lead.phone || 'No phone'} - Zip: ${lead.territory_zip_code}`,
      };
      
      return SendGrid.send(smsMsg);
    });
    
    await Promise.allSettled(emailPromises);
    console.log("SMS notification attempts completed");
    return true;
  } catch (error) {
    console.error("Error sending SMS notification:", error);
    return false;
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { leadId, userId } = await req.json() as LeadNotificationPayload;
    
    if (!leadId || !userId) {
      throw new Error("Missing required parameters");
    }
    
    // Get the lead data
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();
    
    if (leadError || !lead) {
      throw new Error("Lead not found");
    }
    
    // Get the user profile
    const { data: userProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (profileError || !userProfile) {
      throw new Error("User profile not found");
    }
    
    // Get the user email
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !user) {
      throw new Error("User not found");
    }
    
    const notificationResults = {
      email: false,
      sms: false
    };
    
    // Send email notification if enabled
    if (userProfile.notification_email) {
      notificationResults.email = await sendEmail(user.email, lead);
    }
    
    // Send SMS notification if enabled and phone is available
    if (userProfile.notification_sms && userProfile.phone) {
      notificationResults.sms = await sendSms(userProfile.phone, lead);
    }
    
    return new Response(JSON.stringify({
      success: true,
      notificationResults
    }), { 
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
    
  } catch (error) {
    console.error("Error in notify-lead function:", error.message);
    
    return new Response(JSON.stringify({
      error: error.message
    }), { 
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
};

serve(handler);
