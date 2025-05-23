
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";
import { Resend } from "npm:resend@1.0.0";

// Import Twilio with proper type safety
import { Twilio as TwilioClient } from "npm:twilio@4.26.0";

// Get environment variables - use optional chaining for safety
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "re_YDeatYqf_7PMsHrt7Szf17r69LZRQ6qJo";
const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Initialize Resend
const resend = new Resend(RESEND_API_KEY);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadNotificationPayload {
  leadId: string;
  userId: string;
  notificationType?: "email" | "sms" | "all";
}

async function sendEmail(emails: string[], lead: any) {
  if (!emails || emails.length === 0) {
    console.log("No email addresses provided for notification");
    return false;
  }

  // Filter out empty strings
  const validEmails = emails.filter(email => email && email.trim());
  
  if (validEmails.length === 0) {
    console.log("No valid email addresses found after filtering");
    return false;
  }

  try {
    console.log("Sending email notification to:", validEmails);
    
    const { data, error } = await resend.emails.send({
      from: "LeadXclusive <help@leadxclusive.com>",
      to: validEmails,
      subject: "New Lead Notification",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Lead Assigned</h2>
          <p>A new lead has been assigned to you:</p>
          <div style="background-color: #f5f5f5; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <p><strong>Name:</strong> ${lead.name || 'Not provided'}</p>
            <p><strong>Email:</strong> ${lead.email || 'Not provided'}</p>
            <p><strong>Phone:</strong> ${lead.phone || 'Not provided'}</p>
            <p><strong>Address:</strong> ${lead.address || 'Not provided'}</p>
            <p><strong>Zip Code:</strong> ${lead.territory_zip_code}</p>
            <p><strong>Notes:</strong> ${lead.notes || 'None'}</p>
          </div>
          <p>Log in to your dashboard to manage this lead:</p>
          <p><a href="https://www.leadxclusive.com/dashboard" style="background-color: #4a6cf7; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a></p>
          <p style="color: #777; font-size: 13px; margin-top: 30px;">This email was sent from LeadXclusive lead notification system.</p>
        </div>
      `,
    });
    
    if (error) {
      console.error("Error sending email notification:", error);
      return false;
    }
    
    console.log("Email notification sent successfully to", validEmails);
    return true;
  } catch (error) {
    console.error("Error sending email notification:", error);
    return false;
  }
}

async function sendSms(phones: string[], lead: any) {
  // Exit early if no phones provided or the array is empty
  if (!phones || phones.length === 0) {
    console.log("No phone numbers provided for SMS notification");
    return false;
  }

  // Filter out empty strings and invalid numbers
  const validPhones = phones.filter(phone => phone && phone.trim());
  
  if (validPhones.length === 0) {
    console.log("No valid phone numbers found after filtering");
    return false;
  }

  // Check if Twilio credentials are available
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error("Twilio credentials are not configured", {
      accountSid: TWILIO_ACCOUNT_SID ? "Present" : "Missing",
      authToken: TWILIO_AUTH_TOKEN ? "Present" : "Missing",
      phoneNumber: TWILIO_PHONE_NUMBER ? "Present" : "Missing"
    });
    return false;
  }

  try {
    console.log("Preparing to send SMS notifications to:", validPhones);
    
    // Initialize Twilio client - only once outside the loop to prevent repeated initialization
    let twilio: TwilioClient | null = null;
    
    try {
      twilio = new TwilioClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      console.log("Twilio client initialized successfully");
    } catch (twilioInitError) {
      console.error("Failed to initialize Twilio client:", twilioInitError);
      return false;
    }
    
    if (!twilio) {
      console.error("Failed to initialize Twilio client: client is null");
      return false;
    }
    
    // Create the message content
    const message = `New lead assigned: ${lead.name || 'New contact'} in ${lead.territory_zip_code}. Log in to your dashboard to view details.`;
    
    // Send SMS to each phone number with improved error handling
    const results = await Promise.all(
      validPhones.map(async (phone) => {
        try {
          const formattedPhone = formatPhoneNumber(phone);
          if (!formattedPhone) {
            console.error(`Invalid phone number format: ${phone}`);
            return false;
          }
          
          console.log(`Attempting to send SMS to: ${formattedPhone}`);
          
          const smsResult = await twilio.messages.create({
            body: message,
            from: TWILIO_PHONE_NUMBER,
            to: formattedPhone
          });
          
          console.log(`SMS sent successfully to ${formattedPhone}, SID: ${smsResult.sid}`);
          return true;
        } catch (sendError: any) {
          console.error(`Error sending SMS to ${phone}:`, sendError.message);
          // Log more details about the error if available
          if (sendError.code) {
            console.error(`Twilio error code: ${sendError.code}`);
          }
          return false;
        }
      })
    );
    
    // Log results summary
    const successCount = results.filter(Boolean).length;
    console.log(`SMS sending completed. Success: ${successCount}/${validPhones.length}`);
    
    // Return true if at least one SMS was sent successfully
    return successCount > 0;
    
  } catch (error) {
    console.error("Error in SMS sending process:", error);
    return false;
  }
}

// Helper function to format phone numbers for Twilio
function formatPhoneNumber(phone: string): string {
  if (!phone) return "";
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (!digitsOnly) return "";
  
  // US numbers need to be 10 or 11 digits (with country code)
  if (digitsOnly.length < 10) {
    console.log(`Phone number too short: ${phone} (${digitsOnly.length} digits)`);
    return "";
  }
  
  // If the number doesn't start with a country code, add +1 (US)
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  }
  
  // If it already has a country code, just add a +
  return digitsOnly.startsWith('+') ? digitsOnly : `+${digitsOnly}`;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request body with error handling
    let payload: LeadNotificationPayload;
    try {
      payload = await req.json() as LeadNotificationPayload;
      console.log("Request payload received:", payload);
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      throw new Error("Invalid request format");
    }
    
    const { leadId, userId, notificationType = "all" } = payload;
    
    if (!leadId || !userId) {
      throw new Error("Missing required parameters: leadId and userId must be provided");
    }
    
    console.log(`Processing notification for lead: ${leadId} to user: ${userId}, type: ${notificationType}`);
    
    // Get the lead data
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .maybeSingle();
    
    if (leadError) {
      console.error("Error fetching lead:", leadError);
      throw new Error("Failed to fetch lead data");
    }
    
    if (!lead) {
      console.error("Lead not found with ID:", leadId);
      throw new Error("Lead not found");
    }
    
    // Get the user profile
    const { data: userProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      throw new Error("Failed to fetch user profile");
    }
    
    if (!userProfile) {
      console.error("User profile not found with ID:", userId);
      throw new Error("User profile not found");
    }
    
    // Get the user email
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError) {
      console.error("Error fetching user:", userError);
      throw new Error("Failed to fetch user data");
    }
    
    if (!user) {
      console.error("User not found with ID:", userId);
      throw new Error("User not found");
    }
    
    const notificationResults = {
      email: false,
      sms: false
    };
    
    // Collect all email addresses
    const allEmails = [
      user.email, 
      ...(userProfile.secondary_emails || [])
    ].filter(Boolean);
    
    // Collect all phone numbers
    const allPhones = [
      userProfile.phone,
      ...(userProfile.secondary_phones || [])
    ].filter(Boolean);
    
    console.log("Notification preferences:", { 
      email: userProfile.notification_email, 
      sms: userProfile.notification_sms,
      emails: allEmails,
      phones: allPhones,
      requestedType: notificationType
    });

    // Debug phone number
    if (userProfile.phone) {
      console.log("Primary phone from profile:", userProfile.phone);
    } else {
      console.log("No primary phone number found in profile");
    }
    
    // Send email notification if enabled and emails are available
    if ((notificationType === "all" || notificationType === "email") && 
        userProfile.notification_email && allEmails.length > 0) {
      notificationResults.email = await sendEmail(allEmails, lead);
    } else {
      console.log("Email notification skipped:", {
        notificationEnabled: userProfile.notification_email,
        emailsAvailable: allEmails.length > 0,
        requestedType: notificationType
      });
    }
    
    // Send SMS notification if enabled and phones are available
    if ((notificationType === "all" || notificationType === "sms") && 
        userProfile.notification_sms && allPhones.length > 0) {
      notificationResults.sms = await sendSms(allPhones, lead);
    } else {
      console.log("SMS notification skipped:", {
        notificationEnabled: userProfile.notification_sms,
        phonesAvailable: allPhones.length > 0,
        requestedType: notificationType
      });
    }
    
    console.log("Notification results:", notificationResults);
    
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
    
  } catch (error: any) {
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
