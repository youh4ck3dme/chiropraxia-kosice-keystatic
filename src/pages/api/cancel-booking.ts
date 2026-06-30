import type { APIRoute } from 'astro';
import { verifyCancellationToken } from '../../lib/tokens';

const SUCCESS_MSG = 'Žiadosť o zrušenie rezervácie bola prijatá.';
const INVALID_MSG = 'Neplatný alebo expirovaný odkaz na zrušenie rezervácie.';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
    const token = url.searchParams.get('token');
    if (!token || !verifyCancellationToken(token)) {
        return new Response(INVALID_MSG, { status: 400 });
    }

    return new Response(SUCCESS_MSG, { status: 200 });
};
