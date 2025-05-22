
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.6";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, zipCode, daysToWait = 7 } = await req.json();
    
    if (!userId) {
      throw new Error("Missing required userId parameter");
    }
    
    console.log(`Scheduling follow-up email for user ${userId} in ${daysToWait} days`);
    
    // Calculate the timestamp for when the email should be sent
    const scheduledTime = new Date();
    scheduledTime.setDate(scheduledTime.getDate() + daysToWait);
    
    // Store this scheduled email in the database
    const { data, error } = await supabase
      .from('scheduled_emails')
      .insert({
        user_id: userId,
        zip_code: zipCode,
        type: 'activation',
        scheduled_for: scheduledTime.toISOString(),
        status: 'scheduled'
      });
    
    if (error) {
      throw new Error(`Failed to schedule follow-up email: ${error.message}`);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Follow-up email scheduled for ${scheduledTime.toISOString()}`,
        data
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
    console.error("Error in schedule-followup-email function:", error);
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
