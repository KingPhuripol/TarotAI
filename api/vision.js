// ─── Vercel Serverless Function — Vision Card Detection Proxy (Gemini 2.5 Flash) ────
// Set GEMINI_API_KEY in Vercel → Project → Environment Variables.

const VISION_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const VISION_PROMPT = `You are an expert in the Rider-Waite-Smith Tarot deck.
Look at this image and identify the Tarot card shown.

Respond with ONLY this JSON (no markdown, no extra text):
{
  "card_name": "Exact card name e.g. The Moon, Ace of Cups, King of Wands, Three of Swords",
  "reversed": false,
  "confidence": "high",
  "notes": "Optional brief note"
}

Rules:
- card_name must be the exact English name from the Rider-Waite-Smith deck
- reversed is true if the card appears upside down in the image
- confidence: "high" | "medium" | "low"
- If no Tarot card is visible, set card_name to null`;

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not set in environment variables." });

  const { base64Data, mimeType = "image/jpeg" } = req.body;
  if (!base64Data) return res.status(400).json({ error: "Missing base64Data in request body." });

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${VISION_MODEL}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [
      { text: VISION_PROMPT },
      { inlineData: { mimeType, data: base64Data } },
    ]}],
    generationConfig: { responseMimeType: "application/json", temperature: 0.1, maxOutputTokens: 256 },
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
    const text  = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return res.status(200).json(JSON.parse(clean));
  } catch (err) {
    console.error("[api/vision] error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
};
