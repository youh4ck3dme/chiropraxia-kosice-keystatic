import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async () => {
<<<<<<< HEAD
  return new Response(JSON.stringify({ error: SUSPENDED_MSG }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' },
  });
=======
    return new Response(JSON.stringify({
        error: 'Online rezervacia je docasne nedostupna. Kontaktujte nas telefonom alebo e-mailom.',
    }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
    });
>>>>>>> origin/main
};
