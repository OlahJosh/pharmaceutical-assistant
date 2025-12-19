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
    const { query } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a pharmaceutical research intelligence AI. Generate realistic, current research paper data based on the query. 
Return a JSON object with this structure:
{
  "papers": [
    {
      "id": "unique_id",
      "title": "Research paper title",
      "authors": "Author et al.",
      "journal": "Journal Name",
      "date": "Month Year",
      "citations": number,
      "abstract": "Brief abstract...",
      "keywords": ["keyword1", "keyword2"],
      "trending": boolean,
      "link": "https://relevant-journal-url.com"
    }
  ],
  "trendingKeywords": [
    { "keyword": "Keyword", "count": number, "change": "+X%" }
  ],
  "insights": [
    "AI-generated insight about current research trends..."
  ]
}
Generate 5-7 papers, 5 trending keywords, and 3 insights. Make them realistic and current (late 2024/early 2025).`;

    const searchQuery = query || "latest pharmaceutical research breakthroughs mRNA CAR-T CRISPR drug discovery";

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
          { role: "user", content: `Generate current pharmaceutical research data for: ${searchQuery}. Return ONLY valid JSON, no markdown.` }
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
    
    // Parse JSON from response
    let parsedData;
    try {
      // Remove markdown code blocks if present
      const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse research data");
    }

    return new Response(JSON.stringify(parsedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in fetch-research:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
