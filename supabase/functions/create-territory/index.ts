
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the zipCode and userId from the request
    const { zipCode, userId, leadType } = await req.json();
    
    if (!zipCode || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize the admin service client to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // First, check if the zip code is available
    const { data: zipData, error: zipError } = await supabaseAdmin
      .from("zip_codes")
      .select("*")
      .eq("zip_code", zipCode)
      .maybeSingle();
    
    if (zipError) {
      console.error("Error checking zip code:", zipError);
      return new Response(
        JSON.stringify({ error: "Error checking zip code" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!zipData || !zipData.available) {
      return new Response(
        JSON.stringify({ error: "Zip code is not available" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if the territory is already assigned
    const { data: existingTerritory, error: territoryError } = await supabaseAdmin
      .from("territories")
      .select("*")
      .eq("zip_code", zipCode)
      .eq("active", true)
      .maybeSingle();
      
    if (territoryError && territoryError.code !== "PGRST116") {
      console.error("Error checking existing territory:", territoryError);
      return new Response(
        JSON.stringify({ error: "Error checking existing territory" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (existingTerritory) {
      return new Response(
        JSON.stringify({ error: "This territory is already taken" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a new territory record
    const now = new Date();
    const thirtySevenDaysLater = new Date(now);
    thirtySevenDaysLater.setDate(now.getDate() + 37); // 30 days + 7 days initial lead delivery period
    
    const { data: territory, error: insertError } = await supabaseAdmin
      .from("territories")
      .insert({
        user_id: userId,
        zip_code: zipCode,
        lead_type: leadType || "seller",
        active: true,
        start_date: now.toISOString(),
        next_billing_date: thirtySevenDaysLater.toISOString()
      })
      .select()
      .single();
      
    if (insertError) {
      console.error("Error creating territory:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create territory" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Mark the zip code as no longer available
    const { error: updateError } = await supabaseAdmin
      .from("zip_codes")
      .update({ 
        available: false, 
        user_id: userId,
        claimed_at: now.toISOString() 
      })
      .eq("zip_code", zipCode);
      
    if (updateError) {
      console.error("Error updating zip code availability:", updateError);
      // We don't want to fail the whole operation if this update fails
      // The territory has been created, which is the important part
    }

    // Update any territory request to mark it as processed
    try {
      await supabaseAdmin
        .from("territory_requests")
        .update({ 
          status: "completed",
          processed_at: now.toISOString(),
          admin_notes: "Automatically processed after successful payment"
        })
        .eq("zip_code", zipCode)
        .eq("user_id", userId)
        .eq("status", "pending");
    } catch (error) {
      console.error("Error updating territory request:", error);
      // Continue even if updating the request fails
    }

    return new Response(
      JSON.stringify({ success: true, territory }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in create-territory function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
