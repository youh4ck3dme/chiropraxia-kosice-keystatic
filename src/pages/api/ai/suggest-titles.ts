import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const prerender = false;

const genAI = new GoogleGenerativeAI(import.meta.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!import.meta.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI API key is missing' }), {
        status: 501,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { content, currentTitle } = await request.json();

    if (!content) {
      return new Response(JSON.stringify({ error: 'Content is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Navrhni 3 alternatívne titulky pre nasledujúci článok o chiropraktike/zdraví.

Požiadavky:
- V slovenčine
- Maximálne 60 znakov každý
- Optimalizované pre CTR (click-through rate)
- Použij čísla alebo power words kde to dáva zmysel
- Každý titulok na novom riadku, bez číslovania

Aktuálny názov: ${currentTitle || 'N/A'}

Obsah článku:
${content.slice(0, 1500)}

Odpoveď (3 titulky, jeden na riadok):`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const titles = text
      .split('\n')
      .filter((t: string) => t.trim())
      .slice(0, 3);

    return new Response(
      JSON.stringify({
        success: true,
        suggestions: titles.map((t: string) => t.trim()),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('AI Title suggestions error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate title suggestions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
