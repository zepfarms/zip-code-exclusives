
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Replace with your admin email
const ADMIN_EMAIL = "admin@leadxclusive.com";

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
    
    // Log notification (for development)
    console.log(`
      ADMIN NOTIFICATION EMAIL:
      To: ${ADMIN_EMAIL}
      Subject: New Territory Request
      
      A user has requested a new territory:
      
      User Email: ${user.email}
      User ID: ${userId}
      Requested Zip Code: ${zipCode}
      Timestamp: ${new Date().toISOString()}
      
      Please log in to the admin dashboard to process this request.
    `);
    
    // Record the request in the database for admin to process
    const { error: insertError } = await supabase
      .from("territory_requests")
      .insert({
        user_id: userId,
        user_email: user.email,
        zip_code: zipCode,
        status: 'pending',
        created_at: new Date().toISOString()
      });
    
    if (insertError) {
      console.error("Error recording territory request:", insertError);
      throw new Error("Failed to record territory request");
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: "Territory request submitted for admin approval"
    }), { 
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
    
  } catch (error) {
    console.error("Error in admin-notification function:", error);
    
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
