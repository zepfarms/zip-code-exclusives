
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPPORT_EMAIL = "help@leadxclusive.com";

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
    
    // Log the support request (this will appear in edge function logs)
    console.log(`
      SUPPORT REQUEST:
      From: ${userEmail}
      User ID: ${userId || 'Not provided'}
      Message: ${message}
      Timestamp: ${new Date().toISOString()}
      
      This notification would be emailed to: ${SUPPORT_EMAIL}
    `);
    
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
    
    // In production, you would send an actual email here using a service like Resend
    // For now, we'll just log it and record it in the database
    
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
