
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.6";
import { Resend } from "npm:resend@1.0.0"; // Using npm: prefix instead of esm.sh

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "re_YDeatYqf_7PMsHrt7Szf17r69LZRQ6qJo";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Initialize Resend
const resend = new Resend(RESEND_API_KEY);

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface UserDetails {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  zip_code: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, zipCode } = await req.json();
    
    if (!userId || !zipCode) {
      throw new Error("Missing required parameters");
    }
    
    console.log("Processing welcome email for user:", userId, "zip:", zipCode);
    
    // Get user details
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !userData.user) {
      throw new Error(`Error fetching user: ${userError?.message || "User not found"}`);
    }
    
    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('first_name, last_name')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error("Error fetching profile:", profileError);
    }
    
    const userDetails: UserDetails = {
      id: userId,
      email: userData.user.email || "",
      first_name: profileData?.first_name || "",
      last_name: profileData?.last_name || "",
      zip_code: zipCode
    };
    
    console.log("Sending welcome email to:", userDetails.email);
    
    // Send welcome email
    const { data, error } = await resend.emails.send({
      from: "LeadXclusive <help@leadxclusive.com>",
      to: userDetails.email,
      subject: "Welcome to LeadXclusive!",
      html: generateWelcomeEmailHtml(userDetails)
    });
    
    if (error) {
      console.error("Error sending welcome email:", error);
      throw new Error(`Failed to send welcome email: ${error.message}`);
    }
    
    console.log("Welcome email sent successfully:", data);
    
    // Schedule a 7-day follow-up email
    try {
      await supabase.functions.invoke('schedule-followup-email', {
        body: { userId, zipCode, daysToWait: 7 }
      });
      console.log("7-day follow-up email scheduled successfully");
    } catch (followupError) {
      console.error("Error scheduling follow-up email:", followupError);
      // Don't fail the welcome email if scheduling fails
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Welcome email sent successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in welcome-email function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});

function generateWelcomeEmailHtml(user: UserDetails): string {
  const firstName = user.first_name || "there";
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4a6cf7; margin-bottom: 10px;">Welcome to LeadXclusive!</h1>
        <p style="font-size: 18px; font-weight: 500;">We're thrilled to have you join us, ${firstName}!</p>
      </div>
      
      <p style="line-height: 1.6; margin-bottom: 15px;">Thank you for choosing LeadXclusive as your partner for exclusive real estate leads. We're excited to help you grow your business with high-quality, exclusive leads in your territory.</p>
      
      <div style="background-color: #f7f9fc; border-left: 4px solid #4a6cf7; padding: 15px; margin: 25px 0;">
        <h2 style="color: #4a6cf7; margin-top: 0;">What happens next?</h2>
        <p style="margin-bottom: 10px;">Our team is currently setting up your exclusive territory. Here's what you can expect:</p>
        <ul style="padding-left: 20px;">
          <li style="margin-bottom: 8px;"><strong>Account Setup (Next 7 Days):</strong> We're configuring your territory and preparing our systems to deliver leads directly to you.</li>
          <li style="margin-bottom: 8px;"><strong>Activation Email:</strong> In approximately 7 days, you'll receive an activation email letting you know when your leads will start flowing.</li>
          <li style="margin-bottom: 8px;"><strong>Exclusive Access:</strong> Once active, you'll be the only LeadXclusive customer receiving leads in your zip code - giving you a competitive advantage.</li>
        </ul>
      </div>
      
      <p style="line-height: 1.6; margin-bottom: 15px;">You can log into your dashboard anytime to check the status of your account and view your leads once they begin arriving.</p>
      
      <div style="margin: 30px 0; text-align: center;">
        <a href="https://leadxclusive.com/dashboard" style="background-color: #4a6cf7; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Access Your Dashboard</a>
      </div>
      
      <p style="line-height: 1.6; margin-bottom: 15px;">If you have any questions or need assistance, please don't hesitate to reach out. We're here to help!</p>
      
      <p style="line-height: 1.6; margin-bottom: 15px;">You can email us anytime at <a href="mailto:help@leadxclusive.com" style="color: #4a6cf7; text-decoration: none; font-weight: bold;">help@leadxclusive.com</a> and we'll respond promptly.</p>
      
      <p style="line-height: 1.6; margin-bottom: 25px;">We look forward to being your trusted partner for exclusive real estate leads!</p>
      
      <p style="line-height: 1.6;">Warm regards,<br>The LeadXclusive Team</p>
      
      <hr style="border: none; border-top: 1px solid #e8e8e8; margin: 30px 0;">
      
      <p style="font-size: 12px; color: #888888; text-align: center;">
        © ${new Date().getFullYear()} LeadXclusive, a service by AutoPilotRE LLC<br>
        PO BOX 97, Cromwell, OK 74837<br>
        This email was sent to ${user.email} because you subscribed to our lead generation services.
      </p>
    </div>
  `;
}
