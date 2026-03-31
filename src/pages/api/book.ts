import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async () => {
    return new Response(JSON.stringify({
        error: 'Online rezervácia je dočasne nedostupná. Kontaktujte nás telefónom alebo e-mailom.',
    }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
    });
};
