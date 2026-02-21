import type { APIRoute } from 'astro';

const SUSPENDED_MSG = 'Rezervácie sú dočasne nedostupné. Kontaktujte nás telefónom alebo e-mailom.';

export const GET: APIRoute = async () => {
    return new Response(SUSPENDED_MSG, { status: 503 });
};
