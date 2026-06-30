import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async () => {
    return new Response(JSON.stringify({
        error: 'Online rezervacia je docasne nedostupna. Kontaktujte nas telefonom alebo e-mailom.',
    }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
    });
};
