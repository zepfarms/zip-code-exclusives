
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.6";
import { Resend } from "npm:resend@1.0.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const resend = new Resend(RESEND_API_KEY);
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
  created_at: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error("Missing userId parameter");
    }
    
    console.log("Processing admin notification for new user:", userId);
    
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
      created_at: userData.user.created_at
    };
    
    console.log("Sending admin notification for new user:", userDetails.email);
    
    // Send admin notification email
    const { data, error } = await resend.emails.send({
      from: "LeadXclusive <noreply@leadxclusive.com>",
      to: "help@leadxclusive.com",
      subject: "New Account Created - LeadXclusive",
      html: generateAdminNotificationEmailHtml(userDetails)
    });
    
    if (error) {
      console.error("Error sending admin notification email:", error);
      throw new Error(`Failed to send admin notification email: ${error.message}`);
    }
    
    console.log("Admin notification email sent successfully:", data);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Admin notification sent successfully",
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
    console.error("Error in admin-new-account-notification function:", error);
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

function generateAdminNotificationEmailHtml(user: UserDetails): string {
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Not provided';
  const createdDate = new Date(user.created_at).toLocaleString();
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4a6cf7; margin-bottom: 10px;">New Account Created</h1>
        <p style="font-size: 16px; color: #666;">A new user has registered for LeadXclusive</p>
      </div>
      
      <div style="background-color: #f7f9fc; border: 1px solid #e1e8f0; border-radius: 8px; padding: 20px; margin: 25px 0;">
        <h2 style="color: #4a6cf7; margin-top: 0; margin-bottom: 15px;">User Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #e1e8f0;">Name:</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e1e8f0;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #e1e8f0;">Email:</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e1e8f0;"><a href="mailto:${user.email}" style="color: #4a6cf7; text-decoration: none;">${user.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #e1e8f0;">User ID:</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e1e8f0;">${user.id}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold;">Registration Date:</td>
            <td style="padding: 8px 12px;">${createdDate}</td>
          </tr>
        </table>
      </div>
      
      <div style="margin: 30px 0; text-align: center;">
        <a href="https://leadxclusive.com/admin" style="background-color: #4a6cf7; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Admin Dashboard</a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e8e8e8; margin: 30px 0;">
      
      <p style="font-size: 12px; color: #888888; text-align: center;">
        This is an automated notification from LeadXclusive<br>
        © ${new Date().getFullYear()} LeadXclusive, a service by AutoPilotRE LLC
      </p>
    </div>
  `;
}
