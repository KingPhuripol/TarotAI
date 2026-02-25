// ─── Vercel Serverless Function — Vision Card Detection Proxy ────────────────
// Keeps OPENAI_API_KEY server-side. Set it in Vercel → Project → Environment Variables.

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
// Vision requires gpt-4o (not mini) for image understanding
const VISION_MODEL = process.env.OPENAI_VISION_MODEL || "gpt-4o";

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

  const { base64Data, mimeType = "image/jpeg" } = req.body;
  if (!base64Data) {
    return res.status(400).json({ error: "Missing base64Data in request body." });
  }

  const payload = {
    model: VISION_MODEL,
    temperature: 0.1,
    max_tokens: 256,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: [
          { type: "text",      text: VISION_PROMPT },
          { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Data}` } },
        ],
      },
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
    console.error("[api/vision] error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
