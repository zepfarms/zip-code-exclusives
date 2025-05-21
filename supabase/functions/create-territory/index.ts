
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Helper for logging steps in the function execution
const logStep = (step: string, details?: any) => {
  console.log(`[CREATE-TERRITORY] ${step}${details ? `: ${JSON.stringify(details)}` : ''}`);
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, zipCode, leadType } = await req.json();
    
    if (!userId || !zipCode) {
      throw new Error("userId and zipCode are required");
    }

    logStep("Processing request", { userId, zipCode, leadType });

    // Initialize Supabase client with service role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if territory already exists to prevent duplicate entries
    const { data: existingTerritories, error: checkError } = await supabaseAdmin
      .from('territories')
      .select('*')
      .eq('user_id', userId)
      .eq('zip_code', zipCode)
      .eq('active', true);
    
    if (checkError) {
      logStep("Error checking existing territories", checkError);
      throw new Error(`Failed to check territories: ${checkError.message}`);
    }
    
    // Only create if no active territory exists with this zip
    if (existingTerritories && existingTerritories.length > 0) {
      logStep("Territory already exists", existingTerritories[0]);
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Territory already exists", 
        territory: existingTerritories[0] 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Create new territory with explicit lead_type
    const territoryToCreate = {
      user_id: userId,
      zip_code: zipCode,
      lead_type: leadType || 'seller', // Default to 'seller' if not provided
      active: true,
      start_date: new Date().toISOString(),
      next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    };

    logStep("Creating new territory", territoryToCreate);

    const { data: territory, error: territoryError } = await supabaseAdmin
      .from('territories')
      .insert(territoryToCreate)
      .select()
      .single();

    if (territoryError) {
      logStep("Error creating territory", territoryError);
      throw new Error(`Failed to create territory: ${territoryError.message}`);
    }

    logStep("Successfully created territory", { id: territory.id });

    // Also update the zip_code availability in the zip_codes table if it exists
    try {
      await supabaseAdmin
        .from('zip_codes')
        .update({ is_available: false })
        .eq('code', zipCode);
      
      logStep("Updated zip code availability");
    } catch (zipUpdateError) {
      // Don't fail the whole operation if this fails
      logStep("Warning: Failed to update zip code availability", zipUpdateError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Territory created successfully", 
      territory 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("Error in create-territory function", { message: error.message });
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
