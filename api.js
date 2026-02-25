// ─── OpenAI API Integration ───────────────────────────────────────────────────
// All API calls are proxied through Vercel serverless functions (/api/reading, /api/vision).
// The OpenAI API key lives in Vercel Environment Variables — never in client code.

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
  try {
    const res = await fetch("/api/reading", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPrompt: buildUserPrompt(question, spread, cards) }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Reading API error:", err);
    // On localhost, fall back to mock (no serverless functions — run `vercel dev` for live API)
    if (["localhost", "127.0.0.1"].includes(location.hostname)) {
      console.warn("⚠ Local mode — returning mock reading.");
      return getMockReading(question, spread, cards);
    }
    throw err;
  }
}

// ─── OpenAI Vision: detect a Tarot card from a base-64 image ────────────────
async function detectCardFromImage(base64Data, mimeType = "image/jpeg") {
  const res = await fetch("/api/vision", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ base64Data, mimeType }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP ${res.status}`);
  }
  return await res.json();
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

  const cardReadings = cards.map((c, i) => {
    // drawCards() overwrites the `reversed` string with a boolean,
    // so look up the original card's reversed meaning from TAROT_CARDS.
    const origCard =
      typeof TAROT_CARDS !== "undefined"
        ? TAROT_CARDS.find((t) => t.name === c.name)
        : null;
    const reversedMeaning =
      origCard?.reversed ||
      "พลังงานของไพ่ใบนี้กำลังทำงานอยู่ภายใน — จงหันมาพิจารณาตัวเอง";
    return {
      position: spread.positions[i],
      card_name: c.name,
      orientation: c.reversed ? "Reversed" : "Upright",
      interpretation: c.reversed ? reversedMeaning : c.upright,
    };
  });

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
