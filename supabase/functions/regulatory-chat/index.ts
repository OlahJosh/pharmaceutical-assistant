import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, attachments } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build system prompt for regulatory assistant
    const systemPrompt = `You are PharmaLens Regulatory & GMP Assistant, an expert AI specialized in pharmaceutical regulatory affairs and compliance.

Your expertise includes:
- FDA regulations (21 CFR Parts 210, 211, 600, etc.)
- EMA guidelines and Marketing Authorization Applications
- ICH guidelines (Q1-Q14, E6, E8, E9, etc.)
- GMP/GLP/GCP requirements
- Drug development regulatory pathways
- Clinical trial regulations
- CMC (Chemistry, Manufacturing, and Controls) requirements
- ATMP/cell and gene therapy regulations
- Quality systems and compliance

Guidelines for responses:
1. Provide accurate, up-to-date regulatory information
2. Cite specific regulations, guidelines, or guidance documents when relevant
3. Use clear formatting with headers and bullet points for complex answers
4. If uncertain, acknowledge limitations and suggest consulting official sources
5. Be concise but thorough
6. For document analysis, extract key regulatory implications

If the user provides images/documents, analyze them for regulatory relevance.`;

    // Format messages for the API
    const formattedMessages = messages.map((msg: any) => {
      if (msg.attachments && msg.attachments.length > 0) {
        // Handle multimodal content
        const content: any[] = [{ type: "text", text: msg.content }];
        
        for (const attachment of msg.attachments) {
          if (attachment.type === "image") {
            content.push({
              type: "image_url",
              image_url: { url: attachment.url }
            });
          }
        }
        
        return { role: msg.role, content };
      }
      
      return { role: msg.role, content: msg.content };
    });

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
          ...formattedMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("regulatory-chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
