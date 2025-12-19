import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a clinical trials intelligence AI. Generate realistic clinical trial data.
Return a JSON object with this structure:
{
  "trials": [
    {
      "id": "NCT0XXXXXXX",
      "title": "Phase X Study of Drug-XXX in Condition",
      "sponsor": "Pharma Company Name",
      "phase": "Phase I" | "Phase I/II" | "Phase II" | "Phase III",
      "status": "Recruiting" | "Active" | "Completed" | "Suspended",
      "indication": "Disease/Condition",
      "primaryEndpoint": "Primary endpoint description",
      "secondaryEndpoints": ["endpoint1", "endpoint2"],
      "enrollment": number,
      "startDate": "Month Year",
      "completionDate": "Month Year"
    }
  ]
}
Generate 6-8 realistic clinical trials covering oncology, immunotherapy, gene therapy, and rare diseases. Use realistic NCT IDs and company names.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate current clinical trial data for pharmaceutical industry monitoring. Return ONLY valid JSON, no markdown." }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    let parsedData;
    try {
      const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse trials data");
    }

    return new Response(JSON.stringify(parsedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in fetch-trials:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
