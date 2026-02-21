import type { APIRoute } from 'astro';

const SUSPENDED_MSG = 'Rezervácie sú dočasne nedostupné.';

export const POST: APIRoute = async () => {
    return new Response(JSON.stringify({ error: SUSPENDED_MSG }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
    });
};
