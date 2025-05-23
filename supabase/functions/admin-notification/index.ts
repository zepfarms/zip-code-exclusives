
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Admin email to receive notifications
const ADMIN_EMAIL = "help@leadxclusive.com";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { userId, territoryId, zipCode, reason } = await req.json();
    
    if (!userId || !territoryId || !zipCode) {
      throw new Error("Missing required parameters");
    }
    
    // Get user details using service role key to bypass RLS
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Get user info
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !user) {
      throw new Error("User not found");
    }

    // Get territory info
    const { data: territory, error: territoryError } = await supabase
      .from("territories")
      .select("*")
      .eq("id", territoryId)
      .single();
    
    if (territoryError) {
      console.error("Error fetching territory:", territoryError);
    }
    
    // Record the cancellation request in the database
    const { error: insertError } = await supabase
      .from("cancellation_requests")
      .insert({
        user_id: userId,
        user_email: user.email,
        territory_id: territoryId,
        zip_code: zipCode,
        reason: reason || "No reason provided",
        status: 'pending',
        created_at: new Date().toISOString()
      });
    
    if (insertError) {
      console.error("Error recording cancellation request:", insertError);
    }
    
    // Log the notification (this will appear in edge function logs)
    console.log(`
      CANCELLATION REQUEST:
      From: ${user.email}
      User ID: ${userId}
      Territory ID: ${territoryId}
      Zip Code: ${zipCode}
      Reason: ${reason || "No reason provided"}
      Timestamp: ${new Date().toISOString()}
      
      This notification would be emailed to: ${ADMIN_EMAIL}
    `);
    
    // In production, you would send an actual email here using a service like Resend
    // For now, we'll just log it and record it in the database
    
    return new Response(JSON.stringify({ 
      success: true,
      message: "Cancellation request submitted successfully"
    }), { 
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
    
  } catch (error) {
    console.error("Error in cancellation notification function:", error);
    
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
