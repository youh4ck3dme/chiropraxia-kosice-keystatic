import type { APIRoute } from 'astro';

export const runtime = 'edge';
export const prerender = false;

const SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

export const GET: APIRoute = async () => {
    return new Response(JSON.stringify({
        slots: SLOTS.map((time) => ({ time, available: true })),
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
};
