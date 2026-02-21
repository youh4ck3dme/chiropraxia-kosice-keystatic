import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { getEntry } from 'astro:content';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages, slug } = await request.json();
    
    if (!messages || !slug) {
      return new Response(JSON.stringify({ error: 'Chýbajú správy alebo slug v požiadavke' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const card = await getEntry('digital-cards', slug);
    if (!card) {
      return new Response(JSON.stringify({ error: 'Vizitka nenájdená' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check for API Key
    const apiKey = import.meta.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Systémová chyba: Chýba AI kľúč' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    });

    const systemPrompt = card.data.aiAssistant.prompt || 'Si profesionálny AI asistent. Odpovedaj stručne a v slovenčine.';

    const result = streamText({
      model: google('models/gemini-2.0-flash-exp'), // Or gemini-1.5-flash
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('AI Card Chat Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};


