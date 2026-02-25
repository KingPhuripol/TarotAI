// ─── Vercel Serverless Function — Tarot Reading Proxy ────────────────────────
// Keeps OPENAI_API_KEY server-side. Set it in Vercel → Project → Environment Variables.

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const SYSTEM_PROMPT = `You are 'The Arcana Oracle', a supremely knowledgeable Tarot reader specialising in the Rider-Waite-Smith tradition. You possess deep mastery over symbolism, numerology, Kabbalistic pathways, elemental correspondences (Fire, Water, Earth, Air), and astrological associations embedded in every card.

Your purpose is to deliver insightful, nuanced readings that honour both the classical meaning of each card and the personal context of the seeker.

Mandatory rules:
1. Never provide specific medical, legal, or financial advice. Frame all insights around energy, themes, and personal guidance.
2. Analyse the entire spread as a unified narrative, not as disconnected individual cards.
3. Your response MUST be a single valid JSON object — no markdown, no prose outside the JSON structure.
4. Be eloquent, atmospheric, and precise. Your language should feel intentional and meaningful.
5. Always respond in the same language the user's question is written in. If the question is in Thai, respond entirely in Thai.`;

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server configuration error: API key not set." });
  }

  const { userPrompt } = req.body;
  if (!userPrompt) {
    return res.status(400).json({ error: "Missing userPrompt in request body." });
  }

  const payload = {
    model: MODEL,
    temperature: 0.85,
    max_tokens: 2048,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user",   content: userPrompt },
    ],
  };

  try {
    const upstream = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!upstream.ok) {
      const err = await upstream.json();
      return res.status(upstream.status).json({ error: err.error?.message || "OpenAI error" });
    }

    const data  = await upstream.json();
    const text  = data.choices?.[0]?.message?.content || "{}";
    const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return res.status(200).json(JSON.parse(clean));
  } catch (err) {
    console.error("[api/reading] error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
