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

    const systemPrompt = `You are a pharmaceutical intelligence AI that aggregates insights across research, clinical trials, and regulatory domains.
Generate a comprehensive summary of current pharmaceutical landscape.

Return a JSON object with this structure:
{
  "researchInsights": [
    {
      "title": "Insight title",
      "summary": "Brief summary",
      "impact": "high" | "medium" | "low",
      "category": "research"
    }
  ],
  "trialsInsights": [
    {
      "title": "Insight title", 
      "summary": "Brief summary",
      "impact": "high" | "medium" | "low",
      "category": "trials"
    }
  ],
  "regulatoryInsights": [
    {
      "title": "Insight title",
      "summary": "Brief summary", 
      "impact": "high" | "medium" | "low",
      "category": "regulatory"
    }
  ],
  "crossDomainRecommendations": [
    {
      "title": "Strategic recommendation",
      "description": "Detailed recommendation connecting multiple domains",
      "priority": "urgent" | "high" | "medium" | "low",
      "domains": ["research", "trials", "regulatory"]
    }
  ],
  "marketTrends": {
    "topTherapeuticAreas": ["Area 1", "Area 2", "Area 3"],
    "emergingTechnologies": ["Tech 1", "Tech 2"],
    "keyPlayers": ["Company 1", "Company 2", "Company 3"]
  },
  "executiveSummary": "2-3 sentence executive summary of the current pharmaceutical landscape"
}

Generate 3-4 insights per domain, 3-4 cross-domain recommendations, and relevant market trends. Make all data realistic and current (late 2024/early 2025).`;

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
          { role: "user", content: "Generate comprehensive pharmaceutical intelligence insights across research, trials, and regulatory domains. Return ONLY valid JSON, no markdown." }
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
      throw new Error("Failed to parse insights data");
    }

    return new Response(JSON.stringify(parsedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in aggregate-insights:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
