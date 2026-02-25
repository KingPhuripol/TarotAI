// ─── Vercel Serverless Function — Tarot Reading Proxy (Gemini 2.5 Flash) ────────────
// Set GEMINI_API_KEY in Vercel → Project → Environment Variables.

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const SYSTEM_PROMPT = `You are 'The Arcana Oracle', a supremely knowledgeable Tarot reader specialising in the Rider-Waite-Smith tradition. You possess deep mastery over symbolism, numerology, Kabbalistic pathways, elemental correspondences (Fire, Water, Earth, Air), and astrological associations embedded in every card.

Your purpose is to deliver insightful, nuanced readings that honour both the classical meaning of each card and the personal context of the seeker.

Mandatory rules:
1. Never provide specific medical, legal, or financial advice. Frame all insights around energy, themes, and personal guidance.
2. Analyse the entire spread as a unified narrative, not as disconnected individual cards.
3. Your response MUST be a single valid JSON object — no markdown, no prose outside the JSON structure.
4. Be eloquent, atmospheric, and precise. Your language should feel intentional and meaningful.
5. Always respond in the same language the user's question is written in. If the question is in Thai, respond entirely in Thai.`;

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not set in environment variables." });

  const { userPrompt } = req.body;
  if (!userPrompt) return res.status(400).json({ error: "Missing userPrompt in request body." });

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

  const payload = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: { responseMimeType: "application/json", temperature: 0.85, maxOutputTokens: 8192 },
  };

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!upstream.ok) {
      const err = await upstream.json();
      return res.status(upstream.status).json({ error: err.error?.message || "Gemini error" });
    }
    const data  = await upstream.json();
    const raw   = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const clean = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    try {
      return res.status(200).json(JSON.parse(clean));
    } catch (parseErr) {
      console.error("[api/reading] JSON parse error:", parseErr.message, "| raw[:200]:", raw.slice(0, 200));
      return res.status(500).json({ error: "AI response was incomplete. Please try again." });
    }
  } catch (err) {
    console.error("[api/reading] error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
};
