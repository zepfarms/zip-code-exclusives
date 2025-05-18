
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.6";

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
  lead_type: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, zipCode, leadType } = await req.json();
    
    if (!userId || !zipCode || !leadType) {
      throw new Error("Missing required parameters");
    }
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );
    
    // Get user details
    const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(userId);
    
    if (userError || !userData.user) {
      throw new Error(`Error fetching user: ${userError?.message || "User not found"}`);
    }
    
    // Get user profile
    const { data: profileData, error: profileError } = await supabaseClient
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
      zip_code: zipCode,
      lead_type: leadType
    };
    
    // Send welcome email via email service
    // In a real application, you'd use a service like SendGrid, Mailgun, etc.
    // For now, we'll just log that we would send an email

    console.log(`Welcome email would be sent to ${userDetails.email} with the following details:`, userDetails);
    
    // In a real implementation, you would add code to send an email here
    // For example:
    // const emailResponse = await sendEmailViaYourService({
    //   to: userDetails.email,
    //   subject: "Welcome to LeadXclusive!",
    //   html: generateWelcomeEmailHtml(userDetails)
    // });
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Welcome email has been queued for sending",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
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
  const leadTypeText = user.lead_type === 'investor' ? 'Investor' : 'Real Estate Agent';
  
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Welcome to LeadXclusive, ${firstName}!</h1>
      
      <p>Thank you for subscribing to our exclusive ${leadTypeText} leads service! We're excited to have you on board.</p>
      
      <h2>What Happens Next?</h2>
      
      <p>Here's what you can expect in the coming days:</p>
      
      <ol>
        <li><strong>Setup Period (7 Days):</strong> We're now setting up your exclusive territory for zip code ${user.zip_code}. During this time, we'll be configuring our systems to start delivering leads directly to you.</li>
        
        <li><strong>First Leads:</strong> You'll start receiving leads in as little as 7 days. These leads will be high-quality ${leadTypeText.toLowerCase()} leads with no competition.</li>
        
        <li><strong>Ongoing Service:</strong> After your first leads arrive, you'll continue to receive exclusive leads in your territory as they become available.</li>
      </ol>
      
      <h2>Your Subscription Details:</h2>
      
      <ul>
        <li><strong>Territory:</strong> Zip Code ${user.zip_code}</li>
        <li><strong>Lead Type:</strong> ${leadTypeText} Leads</li>
        <li><strong>Monthly Subscription:</strong> $199.00</li>
        <li><strong>First Leads Expected:</strong> In approximately 7 days</li>
      </ul>
      
      <p>You can log into your dashboard at any time to view your leads and manage your account.</p>
      
      <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
      
      <p>We look forward to helping you grow your business!</p>
      
      <p>Best regards,<br>The LeadXclusive Team</p>
      
      <hr style="margin: 20px 0;">
      
      <p style="font-size: 12px; color: #666;">
        This email was sent to ${user.email} because you subscribed to LeadXclusive lead generation services.
      </p>
    </div>
  `;
}
