import type { APIRoute } from 'astro';
import { sendBookingEmail } from '../../../lib/notifications.server';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { bookingId, details, serviceName, staffName, status } = body;

        if (!bookingId || !details || !status) {
            return new Response(JSON.stringify({ error: 'Chýbajú povinné údaje' }), { status: 400 });
        }

        await sendBookingEmail(bookingId, details, serviceName, staffName, status);

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (err: any) {
        console.error('Admin Email API Error:', err);
        return new Response(JSON.stringify({ error: err.message || 'Chyba pri odosielaní emailu' }), { status: 500 });
    }
};
