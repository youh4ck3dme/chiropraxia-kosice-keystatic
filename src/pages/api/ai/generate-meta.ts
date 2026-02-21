import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const prerender = false;

const genAI = new GoogleGenerativeAI(import.meta.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!import.meta.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'AI API key is missing' }),
        { status: 501, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { content, title } = await request.json();

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Napíš SEO meta description pre nasledujúci článok o chiropraktike/zdraví chrbtice. 
    
Požiadavky:
- Maximálne 155 znakov
- V slovenčine
- Zahrň hlavné kľúčové slová z článku
- Buď presvedčivý a použi výzvu k akcii
- Nepoužívaj úvodzovky okolo odpovede

Názov článku: ${title || 'N/A'}

Obsah článku:
${content.slice(0, 2000)}

Odpoveď (len meta description, nič iné):`;

    const result = await model.generateContent(prompt);
    const metaDescription = result.response.text().trim().slice(0, 160);

    return new Response(
      JSON.stringify({
        success: true,
        metaDescription,
        length: metaDescription.length
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI Meta generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate meta description' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};


