// ─── Next.js API Route — Tarot Reading Proxy (Gemini 2.5 Flash) ────────────
// Set GEMINI_API_KEY in Vercel → Project → Environment Variables or .env.local

import { NextRequest, NextResponse } from 'next/server';

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const SYSTEM_PROMPT = `You are 'The Arcana Oracle', a supremely knowledgeable Tarot reader specialising in the Rider-Waite-Smith tradition. You possess deep mastery over symbolism, numerology, Kabbalistic pathways, elemental correspondences (Fire, Water, Earth, Air), and astrological associations embedded in every card.

Your purpose is to deliver insightful, nuanced readings that honour both the classical meaning of each card and the personal context of the seeker.

Mandatory rules:
1. Never provide specific medical, legal, or financial advice. Frame all insights around energy, themes, and personal guidance.
2. Analyse the entire spread as a unified narrative, not as disconnected individual cards.
3. Your response MUST be a single valid JSON object — no markdown, no prose outside the JSON structure.
4. Be eloquent, atmospheric, and precise. Your language should feel intentional and meaningful.
5. Always respond in the same language the user's question is written in. If the question is in Thai, respond entirely in Thai.`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not set in environment variables.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { userPrompt } = body;

    if (!userPrompt) {
      return NextResponse.json(
        { error: 'Missing userPrompt in request body.' },
        { status: 400 }
      );
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

    const payload = {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.85,
        maxOutputTokens: 2048,
      },
    };

    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!upstream.ok) {
      const err = await upstream.json();
      return NextResponse.json(
        { error: err.error?.message || 'Gemini error' },
        { status: upstream.status }
      );
    }

    const data = await upstream.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    return NextResponse.json(JSON.parse(clean), {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    console.error('[api/reading] error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
