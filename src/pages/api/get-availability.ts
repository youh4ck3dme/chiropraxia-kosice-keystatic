import type { APIRoute } from 'astro';

export const runtime = 'edge';

const SUSPENDED_MSG = 'Rezervácie sú dočasne nedostupné.';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ error: SUSPENDED_MSG }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' },
  });
};
