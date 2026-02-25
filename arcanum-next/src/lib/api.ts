// ─── API Client for Gemini-powered Tarot Readings ────────────

import type { TarotCard, TarotSpread } from '@/types/tarot';

/**
 * Build user prompt for tarot reading
 */
function buildUserPrompt(question: string, spread: TarotSpread, cards: TarotCard[]): string {
  const positions = spread.positions || [];
  
  const cardsDescription = cards
    .map((c, i) => {
      const pos = positions[i] || `Card ${i + 1}`;
      return `${pos}: ${c.name}${c.reversed ? ' (Reversed)' : ''} — ${c.element}, ${c.arcana}`;
    })
    .join('\n');

  const userPrompt = `
Question from the seeker:
${question}

Spread: ${spread.name}
${spread.description}

Cards drawn:
${cardsDescription}

Please provide a comprehensive reading in JSON format:
{
  "oracle": "A mystical opening statement (1-2 sentences)",
  "overall": "The core narrative synthesizing all cards (3-4 sentences)",
  "theme": "Main energy/theme word (1-3 words)",
  "cards": [
    {
      "position": "Position name",
      "card": "Card name",
      "meaning": "What this card means in this position (2-3 sentences)"
    }
  ],
  "advice": "Practical guidance (2-3 sentences)",
  "confidence": number between 0-10
}
`;
  
  return userPrompt;
}

/**
 * Call Gemini API for tarot reading
 */
export async function getReading(
  question: string,
  spread: TarotSpread,
  cards: TarotCard[]
): Promise<any> {
  const userPrompt = buildUserPrompt(question, spread, cards);

  try {
    const res = await fetch('/api/reading', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userPrompt }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('[getReading] error:', error);
    throw error;
  }
}

/**
 * Detect tarot card from image using Gemini Vision
 */
export async function detectCardFromImage(
  base64Data: string,
  mimeType: string = 'image/jpeg'
): Promise<{
  card_name: string | null;
  reversed: boolean;
  confidence: 'high' | 'medium' | 'low';
  notes?: string;
}> {
  try {
    const res = await fetch('/api/vision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Data, mimeType }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('[detectCardFromImage] error:', error);
    throw error;
  }
}

/**
 * Mock reading for fallback (when API fails)
 */
export function getMockReading(cards: TarotCard[]): any {
  return {
    oracle: 'เส้นทางแห่งการเดินทางของคุณกำลังถูกเปิดเผย...',
    overall: 'พลังของจักรวาลกำลังส่งสัญญาณถึงคุณผ่านไพ่เหล่านี้ สิ่งที่คุณกำลังค้นหาอยู่นั้นใกล้เข้ามาแล้ว',
    theme: 'การเปลี่ยนแปลง',
    cards: cards.map((c, i) => ({
      position: `ตำแหน่งที่ ${i + 1}`,
      card: c.name,
      meaning: `${c.name} ${c.reversed ? '(กลับหัว)' : ''} กำลังบอกคุณถึงพลังของ${c.element}`,
    })),
    advice: 'จงเชื่อมั่นในเส้นทางของคุณ สิ่งที่ควรเกิดขึ้นจะเกิดขึ้นในเวลาที่เหมาะสม',
    confidence: 7,
  };
}
