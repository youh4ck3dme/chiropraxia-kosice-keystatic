import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { buildSystemPrompt, SYSTEM_PROMPT } from '../../lib/ai-knowledge';
import { rateLimit, rateLimitConfigs, getClientId, rateLimitResponse } from '../../lib/rate-limit';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Rate limit check
    const clientId = getClientId(request);
    const { allowed, remaining, resetIn } = rateLimit(clientId, rateLimitConfigs.chat);
    
    if (!allowed) {
      return rateLimitResponse(resetIn);
    }

    const { messages } = await request.json();

    if (!messages) {
      return new Response(JSON.stringify({ error: 'Chýbajú správy v požiadavke' }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': String(remaining),
        }
      });
    }

    // Check for API Key (Try import.meta.env and process.env fallback)
    const apiKey = import.meta.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      console.error('Missing GOOGLE_GENERATIVE_AI_API_KEY');
      return new Response(JSON.stringify({ error: 'Systémová chyba: Chýba AI kľúč' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build system prompt dynamically from CMS services
    let systemPrompt = SYSTEM_PROMPT;
    try {
      const servicesEntries = await getCollection('services');
      const activeServices = servicesEntries
        .filter(s => s.data.isActive)
        .sort((a, b) => a.data.sort_order - b.data.sort_order)
        .map(s => ({
          name: s.data.name,
          duration_min: s.data.duration_min,
          price: s.data.price,
        }));
      if (activeServices.length > 0) {
        systemPrompt = buildSystemPrompt(activeServices);
      }
    } catch {
      // If collection fails to load, fall back to static prompt
    }

    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    });

    const result = streamText({
      model: google('models/gemini-2.0-flash'),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};


