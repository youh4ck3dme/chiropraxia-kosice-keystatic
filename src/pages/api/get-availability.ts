import type { APIRoute } from 'astro';

export const runtime = 'edge';
export const prerender = false;

export const GET: APIRoute = async () => {
    return new Response(JSON.stringify({
        error: 'Online rezervácia je dočasne nedostupná. Kontaktujte nás telefónom alebo e-mailom.',
    }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
    });
};
