// ─── OpenAI API Integration ───────────────────────────────────────────────────
// OPENAI_API_KEY is loaded from config.js (not committed to git — see .gitignore)
const OPENAI_MODEL = "gpt-4o";
const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";

const SYSTEM_PROMPT = `You are 'The Arcana Oracle', a supremely knowledgeable Tarot reader specialising in the Rider-Waite-Smith tradition. You possess deep mastery over symbolism, numerology, Kabbalistic pathways, elemental correspondences (Fire, Water, Earth, Air), and astrological associations embedded in every card.

Your purpose is to deliver insightful, nuanced readings that honour both the classical meaning of each card and the personal context of the seeker.

Mandatory rules:
1. Never provide specific medical, legal, or financial advice. Frame all insights around energy, themes, and personal guidance.
2. Analyse the entire spread as a unified narrative, not as disconnected individual cards.
3. Your response MUST be a single valid JSON object — no markdown, no prose outside the JSON structure.
4. Be eloquent, atmospheric, and precise. Your language should feel intentional and meaningful.
5. Always respond in the same language the user's question is written in. If the question is in Thai, respond entirely in Thai.`;

function buildUserPrompt(question, spread, cards) {
  const spreadName = spread.name;
  const cardList = cards
    .map(
      (c, i) =>
        `  Position ${i + 1} — ${spread.positions[i]}: ${c.name}${c.reversed ? " (Reversed)" : " (Upright)"}`,
    )
    .join("\n");

  const schema = JSON.stringify(
    {
      summary:
        "A vivid 2–3 sentence narrative overview of the entire reading, addressing the seeker's question directly.",
      card_readings: cards.map((c, i) => ({
        position: spread.positions[i],
        card_name: c.name,
        orientation: c.reversed ? "Reversed" : "Upright",
        interpretation:
          "A rich 2–3 sentence interpretation of this card within the context of its position and the seeker's question.",
      })),
      visualization_data: {
        dominant_element:
          "The single dominant element of this spread (Fire | Water | Earth | Air)",
        overall_energy:
          "Single word assessment (Positive | Neutral | Challenging | Transformative)",
        energy_score:
          "A number from 1 to 10 reflecting the overall vitality and potential of this reading",
        element_distribution: {
          Fire: "count as integer",
          Water: "count as integer",
          Earth: "count as integer",
          Air: "count as integer",
        },
        key_themes: ["theme_1", "theme_2", "theme_3"],
      },
      advice:
        "A single, specific, actionable piece of guidance the seeker can apply to their situation starting today.",
      closing_message:
        "A brief, poetic closing sentence — an atmospheric farewell from the Oracle.",
    },
    null,
    2,
  );

  return `Please deliver a Tarot reading for the following:

Seeker's Question: "${question}"
Spread: ${spreadName}

Cards Drawn:
${cardList}

Respond using exactly this JSON schema:
${schema}`;
}

async function callOpenAIAPI(question, spread, cards) {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "YOUR_OPENAI_API_KEY_HERE") {
    return getMockReading(question, spread, cards);
  }

  const payload = {
    model: OPENAI_MODEL,
    temperature: 0.85,
    max_tokens: 2048,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(question, spread, cards) },
    ],
  };

  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("OpenAI API error:", err);
    throw err;
  }
}

// ─── OpenAI Vision: detect a Tarot card from a base-64 image ────────────────
async function detectCardFromImage(base64Data, mimeType = "image/jpeg") {
  const visionPrompt = `You are an expert in the Rider-Waite-Smith Tarot deck.
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

  const payload = {
    model: OPENAI_MODEL,
    temperature: 0.1,
    max_tokens: 256,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: visionPrompt },
          {
            type: "image_url",
            image_url: { url: `data:${mimeType};base64,${base64Data}` },
          },
        ],
      },
    ],
  };

  const response = await fetch(OPENAI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  return JSON.parse(cleaned);
}

// ─── Find a card in TAROT_CARDS by name (fuzzy) ───────────────────────────────
function findCardByName(name) {
  if (!name || typeof TAROT_CARDS === "undefined") return null;
  const normalise = (s) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .trim();
  const target = normalise(name);
  // Exact match first
  let found = TAROT_CARDS.find((c) => normalise(c.name) === target);
  if (found) return found;
  // Partial match
  found = TAROT_CARDS.find(
    (c) =>
      normalise(c.name).includes(target) || target.includes(normalise(c.name)),
  );
  return found || null;
}

// ─── Public entry point called by app.js ─────────────────────────────────────
// getTarotReading(question, drawnCards, spreadType)
//   spreadType: string key into the SPREADS object defined in cards.js
async function getTarotReading(question, drawnCards, spreadType) {
  const spread = typeof SPREADS !== "undefined" ? SPREADS[spreadType] : null;
  if (!spread) throw new Error(`Unknown spread type: ${spreadType}`);
  return callOpenAIAPI(question, spread, drawnCards);
}

// ─── Mock reading used when no API key is configured ─────────────────────────
function getMockReading(question, spread, cards) {
  const dominant = getDominantElement(cards);
  const scoreMap = { Fire: 8, Water: 7, Earth: 6, Air: 5 };
  const dist = { Fire: 0, Water: 0, Earth: 0, Air: 0 };
  cards.forEach((c) => {
    if (dist[c.element] !== undefined) dist[c.element]++;
  });

  const cardReadings = cards.map((c, i) => ({
    position: spread.positions[i],
    card_name: c.name,
    orientation: c.reversed ? "Reversed" : "Upright",
    interpretation: c.reversed ? c.reversed_meaning || c.reversed : c.upright,
  }));

  const energyMapTH = {
    Fire: "การเปลี่ยนแปลง",
    Water: "เชิงบวก",
    Earth: "สมดุล",
    Air: "ท้าทาย",
  };

  return {
    summary: `ไพ่ได้ตอบคำถาม "${question}" แล้ว การอ่านไพ่ชุดนี้เผยให้เห็นพลังงานของธาตุ ${dominant} ที่กำลังส่งผลต่อเส้นทางของคุณ นักพยากรณ์รับรู้ถึงทั้งความท้าทายและโอกาสอันยิ่งใหญ่ที่ซ่อนอยู่ในสถานการณ์นี้`,
    card_readings: cardReadings,
    visualization_data: {
      dominant_element: dominant,
      overall_energy: energyMapTH[dominant] || "สมดุล",
      energy_score: scoreMap[dominant] || 6,
      element_distribution: dist,
      key_themes: cards.flatMap((c) => c.keywords).slice(0, 3),
    },
    advice: `จงใคร่ครวญความหมายของ ${cards[0]?.name || "ไพ่ใบแรก"} อย่างลึกซึ้ง และให้ปัญญาของมันนำทางก้าวแรกของคุณ`,
    closing_message:
      "ม่านระหว่างสองโลกเริ่มบางลงแล้ว จงเชื่อมั่นในสิ่งที่ไพ่ได้เปิดเผย และก้าวเดินต่อไปด้วยความกล้าหาญ",
  };
}
