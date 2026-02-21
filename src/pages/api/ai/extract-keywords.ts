import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const prerender = false;

const genAI = new GoogleGenerativeAI(import.meta.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export const POST: APIRoute = async ({ request }) => {
  try {
    const { content } = await request.json();

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Extrahuj 5-8 najdôležitejších kľúčových slov z nasledujúceho článku.

Požiadavky:
- V slovenčine
- Obsahuj dlhé aj krátke kľúčové slová (long-tail keywords)
- Jedno kľúčové slovo na riadok
- Zoraď podľa dôležitosti (najdôležitejšie prvé)
- Bez číslovania

Obsah článku:
${content.slice(0, 2500)}

Odpoveď (kľúčové slová, jedno na riadok):`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const keywords = text.split('\n')
      .map(k => k.trim())
      .filter(k => k && !k.match(/^\d+\./))
      .slice(0, 8);

    return new Response(
      JSON.stringify({ 
        success: true, 
        keywords,
        keywordsString: keywords.join(', ')
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Keyword extraction error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to extract keywords' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};


