
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
      console.error("Missing required parameters:", { zipCode, userId });
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log request details for debugging
    console.log(`Creating territory for user ${userId} with zip code ${zipCode} and lead type ${leadType || 'investor'}`);

    // Initialize the admin service client to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Check if this territory is already active for any user (important to prevent duplicates)
    console.log(`Checking if territory with zip ${zipCode} already exists and is active`);
    const { data: activeTerritory, error: activeCheckError } = await supabaseAdmin
      .from("territories")
      .select("*")
      .eq("zip_code", zipCode)
      .eq("active", true)
      .maybeSingle();

    if (activeCheckError) {
      console.error("Error checking active territory:", activeCheckError);
      return new Response(
        JSON.stringify({ error: "Error checking territory status: " + activeCheckError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If territory is active and assigned to a different user, return an error
    if (activeTerritory && activeTerritory.user_id !== userId) {
      console.error(`Territory ${zipCode} is already active and assigned to user ${activeTerritory.user_id}`);
      return new Response(
        JSON.stringify({ error: "This territory is already active and assigned to another user" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Next, check any existing territory (active or inactive)
    console.log(`Checking if territory with zip ${zipCode} exists in database (active or inactive)`);
    const { data: existingTerritory, error: territoryError } = await supabaseAdmin
      .from("territories")
      .select("*")
      .eq("zip_code", zipCode)
      .maybeSingle();
      
    if (territoryError && territoryError.code !== "PGRST116") {
      console.error("Error checking existing territory:", territoryError);
      return new Response(
        JSON.stringify({ error: "Error checking existing territory: " + territoryError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a new territory record or update existing one
    const now = new Date();
    const thirtySevenDaysLater = new Date(now);
    thirtySevenDaysLater.setDate(now.getDate() + 37); // 30 days + 7 days initial lead delivery period
    
    // Convert the leadType to match database constraints (only 'investor' or 'agent' is allowed)
    // Default to 'investor' if the leadType is not valid
    const validLeadType = leadType === 'agent' ? 'agent' : 'investor';
    
    let territory;

    if (existingTerritory) {
      // Update existing territory
      console.log(`Updating existing territory for zip ${zipCode}, setting user_id to ${userId}`);
      const { data: updatedTerritory, error: updateError } = await supabaseAdmin
        .from("territories")
        .update({
          user_id: userId,
          active: true,
          lead_type: validLeadType,
          start_date: now.toISOString(),
          next_billing_date: thirtySevenDaysLater.toISOString()
        })
        .eq("id", existingTerritory.id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating territory:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update territory: " + updateError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      territory = updatedTerritory;
    } else {
      // Create new territory
      console.log(`Creating new territory for user ${userId} with zip code ${zipCode}`);
      const { data: newTerritory, error: insertError } = await supabaseAdmin
        .from("territories")
        .insert({
          user_id: userId,
          zip_code: zipCode,
          lead_type: validLeadType,
          active: true,
          start_date: now.toISOString(),
          next_billing_date: thirtySevenDaysLater.toISOString()
        })
        .select()
        .single();
        
      if (insertError) {
        console.error("Error creating territory:", insertError);
        return new Response(
          JSON.stringify({ error: "Failed to create territory: " + insertError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      territory = newTerritory;
    }
    
    // Look up the zip_code entry
    const { data: zipCodeEntry, error: zipLookupError } = await supabaseAdmin
      .from("zip_codes")
      .select("*")
      .eq("zip_code", zipCode)
      .maybeSingle();

    if (zipLookupError && zipLookupError.code !== 'PGRST116') {
      console.error("Error looking up zip code:", zipLookupError);
    }
    
    // Mark the zip code as no longer available by updating or creating the zip_codes record
    console.log(`Marking zip code ${zipCode} as unavailable and assigned to user ${userId}`);
    const { error: upsertError } = await supabaseAdmin
      .from("zip_codes")
      .upsert({ 
        zip_code: zipCode,
        available: false, 
        user_id: userId,
        claimed_at: now.toISOString(),
        id: zipCodeEntry?.id // Use existing ID if found, otherwise new one will be generated
      });
      
    if (upsertError) {
      console.error("Error updating zip code availability:", upsertError);
      // We don't want to fail the whole operation if this update fails
      // The territory has been created, which is the important part
    }

    // Update any territory request to mark it as processed
    try {
      console.log(`Updating territory request for user ${userId}, zip code ${zipCode}`);
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

    // Create welcome lead
    try {
      console.log(`Creating welcome lead for territory ${zipCode}, user ${userId}`);
      const { data: leadData, error: leadError } = await supabaseAdmin
        .from("leads")
        .insert({
          name: "Welcome Lead",
          territory_zip_code: zipCode,
          user_id: userId,
          status: "New",
          notes: "This is a welcome lead created when your territory was activated.",
          address: `Zip Code: ${zipCode}`,
          phone: "",
          email: ""
        })
        .select();
        
      if (leadError) {
        console.error("Error creating welcome lead:", leadError);
      } else {
        console.log("Welcome lead created:", leadData);
      }
    } catch (error) {
      console.error("Error in welcome lead creation:", error);
    }

    console.log(`Territory creation successful for user ${userId}, zip code ${zipCode}`);
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
