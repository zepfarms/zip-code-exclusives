
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";
import twilio from "npm:twilio@4.19.0";

// Get environment variables
const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

// Function to send test SMS
async function sendTestSms(phone: string): Promise<any> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error("Twilio credentials are not configured", {
      accountSid: TWILIO_ACCOUNT_SID ? "Present" : "Missing",
      authToken: TWILIO_AUTH_TOKEN ? "Present" : "Missing",
      phoneNumber: TWILIO_PHONE_NUMBER ? "Present" : "Missing"
    });
    throw new Error("Twilio credentials missing");
  }

  try {
    // Initialize Twilio client
    const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    console.log("Twilio client initialized successfully");
    
    const formattedPhone = formatPhoneNumber(phone);
    if (!formattedPhone) {
      throw new Error(`Invalid phone number format: ${phone}`);
    }
    
    console.log(`Attempting to send test SMS to: ${formattedPhone}`);
    
    const message = "This is a test SMS from LeadXclusive. If you received this, SMS functionality is working correctly.";
    
    const smsResult = await twilioClient.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });
    
    console.log(`Test SMS sent successfully, SID: ${smsResult.sid}`);
    return { success: true, sid: smsResult.sid };
    
  } catch (error: any) {
    console.error("Error sending test SMS:", error);
    return { success: false, error: error.message };
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get current user from auth header
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }
    
    // Get user profile to check if user is admin
    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("is_admin, phone")
      .eq("id", session.user.id)
      .maybeSingle();
      
    // Only admins can send test messages
    if (!userProfile?.is_admin) {
      throw new Error("Unauthorized: Admin access required");
    }
    
    // If we're specifically looking for zepfarms@gmail.com user
    const { data: targetUser } = await supabase.auth.admin.listUsers();
    const zepfarmsUser = targetUser?.users.find(u => u.email === "zepfarms@gmail.com");
    
    if (!zepfarmsUser) {
      throw new Error("Target test user not found");
    }
    
    // Get the user profile to get the phone number
    const { data: targetProfile } = await supabase
      .from("user_profiles")
      .select("phone, notification_phone")
      .eq("id", zepfarmsUser.id)
      .maybeSingle();
    
    if (!targetProfile) {
      throw new Error("Target user profile not found");
    }
    
    const phoneToUse = targetProfile.notification_phone || targetProfile.phone;
    
    if (!phoneToUse) {
      throw new Error("No phone number found for target user");
    }
    
    // Send test SMS
    const result = await sendTestSms(phoneToUse);
    
    return new Response(JSON.stringify({
      success: result.success,
      message: result.success ? "Test SMS sent successfully" : "Failed to send test SMS",
      details: result
    }), { 
      status: result.success ? 200 : 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
    
  } catch (error: any) {
    console.error("Error in test-sms function:", error.message);
    
    return new Response(JSON.stringify({
      success: false,
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
