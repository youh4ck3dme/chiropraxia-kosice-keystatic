import type { APIRoute } from 'astro';

export const runtime = 'edge';
export const prerender = false;

export const GET: APIRoute = async () => {
<<<<<<< HEAD
  return new Response(JSON.stringify({ error: SUSPENDED_MSG }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' },
  });
=======
    return new Response(JSON.stringify({
        error: 'Online rezervácia je dočasne nedostupná. Kontaktujte nás telefónom alebo e-mailom.',
    }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
    });
>>>>>>> origin/main
};
