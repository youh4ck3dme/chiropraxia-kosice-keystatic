import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const prerender = false;

const genAI = new GoogleGenerativeAI(import.meta.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export const POST: APIRoute = async ({ request }) => {
  try {
    const { content, currentSlug } = await request.json();

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get all existing blog posts
    const allPosts = await getCollection('blog');
    const otherPosts = allPosts.filter(post => post.slug !== currentSlug);

    if (otherPosts.length === 0) {
      return new Response(
        JSON.stringify({ success: true, suggestions: [] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create context of existing articles
    const existingArticles = otherPosts.map(post => ({
      slug: post.slug,
      title: post.data.title,
      category: post.data.category,
    }));

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyzuj nasledujúci obsah článku a navrhni interné odkazy na existujúce články.

Obsah aktuálneho článku:
${content.slice(0, 1500)}

Existujúce články:
${existingArticles.map(a => `- ${a.title} (/${a.slug})`).join('\n')}

Navrhni maximálne 3 relevantné interné odkazy. Pre každý uveď:
1. Slug článku
2. Krátke odôvodnenie prečo je relevantný

Formát odpovede (JSON array):
[{"slug": "slug-clanku", "reason": "Dôvod prečo prelinkovať"}]

Odpoveď (len JSON):`;

    const result = await model.generateContent(prompt);
    let suggestions = [];
    
    try {
      const text = result.response.text().trim();
      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        suggestions: suggestions.slice(0, 3)
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Internal linking suggestions error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate link suggestions' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};


