import type { APIRoute } from 'astro';
import { calculateReadability, calculateReadingTime } from '../../../lib/readability';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { content } = await request.json();
    const GOOGLE_GENERATIVE_AI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'AI API key is missing. Component cannot generate content.' }),
        { status: 501, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const readability = calculateReadability(content);
    const readingTime = calculateReadingTime(content);

    return new Response(
      JSON.stringify({
        success: true,
        readability,
        readingTime,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Readability analysis error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to analyze readability' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};


