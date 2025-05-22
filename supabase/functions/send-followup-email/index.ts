
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.6";
import { Resend } from "npm:resend@1.0.0";

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
    const { userId, zipCode, emailType = 'activation' } = await req.json();
    
    if (!userId) {
      throw new Error("Missing required userId parameter");
    }
    
    console.log(`Processing follow-up email for user: ${userId}, email type: ${emailType}`);
    
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
      zip_code: zipCode || ""
    };
    
    console.log("Sending follow-up email to:", userDetails.email);
    
    // Send follow-up email
    const { data, error } = await resend.emails.send({
      from: "LeadXclusive <help@leadxclusive.com>",
      to: userDetails.email,
      subject: "Your LeadXclusive Account is Now Active!",
      html: generateFollowUpEmailHtml(userDetails, emailType)
    });
    
    if (error) {
      console.error("Error sending follow-up email:", error);
      throw new Error(`Failed to send follow-up email: ${error.message}`);
    }
    
    console.log("Follow-up email sent successfully:", data);
    
    // Update the scheduled email status if this was triggered by a scheduled job
    if (req.headers.get("x-scheduled") === "true") {
      const { error: updateError } = await supabase
        .from('scheduled_emails')
        .update({ status: 'sent' })
        .eq('user_id', userId)
        .eq('type', emailType)
        .eq('status', 'scheduled');
        
      if (updateError) {
        console.error("Error updating scheduled email status:", updateError);
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Follow-up email sent successfully",
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
    console.error("Error in send-followup-email function:", error);
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

function generateFollowUpEmailHtml(user: UserDetails, emailType: string): string {
  const firstName = user.first_name || "there";
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4a6cf7; margin-bottom: 10px;">Your Account is Now Active!</h1>
        <p style="font-size: 18px; font-weight: 500;">Great news, ${firstName}!</p>
      </div>
      
      <p style="line-height: 1.6; margin-bottom: 15px;">Your LeadXclusive account is now fully active and you should start receiving exclusive leads for zip code <strong>${user.zip_code}</strong> right away.</p>
      
      <div style="background-color: #f7f9fc; border-left: 4px solid #4a6cf7; padding: 15px; margin: 25px 0;">
        <h2 style="color: #4a6cf7; margin-top: 0;">Important Information:</h2>
        <ul style="padding-left: 20px;">
          <li style="margin-bottom: 8px;"><strong>Exclusive Territory:</strong> You are now the only LeadXclusive customer receiving leads in zip code ${user.zip_code}.</li>
          <li style="margin-bottom: 8px;"><strong>Lead Notifications:</strong> You'll receive email notifications whenever new leads are assigned to you.</li>
          <li style="margin-bottom: 8px;"><strong>Dashboard Access:</strong> Log in anytime to view and manage your leads through your personal dashboard.</li>
        </ul>
      </div>
      
      <p style="line-height: 1.6; margin-bottom: 15px;">We encourage you to log in to your dashboard regularly to check for new leads and ensure you're responding to them promptly for the best conversion rates.</p>
      
      <div style="margin: 30px 0; text-align: center;">
        <a href="https://leadxclusive.com/dashboard" style="background-color: #4a6cf7; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Your Leads Now</a>
      </div>
      
      <p style="line-height: 1.6; margin-bottom: 15px;">If you have any questions or need assistance with using the platform, please reach out to us at <a href="mailto:help@leadxclusive.com" style="color: #4a6cf7; text-decoration: none; font-weight: bold;">help@leadxclusive.com</a>.</p>
      
      <p style="line-height: 1.6; margin-bottom: 25px;">We're excited about our partnership and helping you grow your business with exclusive, high-quality leads!</p>
      
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
