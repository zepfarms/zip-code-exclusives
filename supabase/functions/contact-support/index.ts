
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const SUPPORT_EMAIL = "help@leadxclusive.com";
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { userEmail, message, userId } = await req.json();
    
    if (!userEmail || !message) {
      throw new Error("Email and message are required");
    }
    
    // Get user details using service role key to get additional context
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    let userContext = "";
    if (userId) {
      // Get user profile for additional context
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("first_name, last_name, phone")
        .eq("id", userId)
        .single();
      
      if (profile) {
        userContext = `
User Details:
- Name: ${profile.first_name || ''} ${profile.last_name || ''}
- Phone: ${profile.phone || 'Not provided'}
        `;
      }
    }
    
    // Record the support request in the database for tracking
    const { error: insertError } = await supabase
      .from("support_requests")
      .insert({
        user_id: userId || null,
        user_email: userEmail,
        message: message,
        status: 'new',
        created_at: new Date().toISOString()
      });
    
    if (insertError) {
      console.error("Error recording support request:", insertError);
      // Don't fail the request if we can't record it, just log the error
    }
    
    // Send the actual email using Resend
    const emailContent = `
      <h2>New Support Request</h2>
      <p><strong>From:</strong> ${userEmail}</p>
      <p><strong>User ID:</strong> ${userId || 'Not provided'}</p>
      ${userContext ? `<p><strong>User Context:</strong><pre>${userContext}</pre></p>` : ''}
      <p><strong>Message:</strong></p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
        ${message.replace(/\n/g, '<br>')}
      </div>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    `;
    
    const emailResponse = await resend.emails.send({
      from: "LeadXclusive Support <noreply@leadxclusive.com>",
      to: [SUPPORT_EMAIL],
      replyTo: userEmail,
      subject: `Support Request from ${userEmail}`,
      html: emailContent
    });
    
    console.log("Support email sent successfully:", emailResponse);
    
    return new Response(JSON.stringify({ 
      success: true,
      message: "Support request submitted successfully"
    }), { 
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
    
  } catch (error) {
    console.error("Error in contact support function:", error);
    
    return new Response(JSON.stringify({
      error: error.message || "An unknown error occurred"
    }), { 
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
});
