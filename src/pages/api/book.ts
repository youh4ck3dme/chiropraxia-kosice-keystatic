import type { APIRoute } from 'astro';
import { z } from 'zod';
import { getClientId, rateLimit, rateLimitConfigs, rateLimitResponse } from '../../lib/rate-limit';
import { sendBookingNotificationEmail } from '../../lib/notifications.server';

export const prerender = false;

const bookingSchema = z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email(),
    phone: z.string().trim().min(0).max(40).optional().default(''),
    service_id: z.string().trim().min(1).max(120),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().regex(/^\d{2}:\d{2}$/),
    notes: z.string().trim().max(1000).optional().default(''),
    website_url: z.string().optional().default(''),
});

export const POST: APIRoute = async ({ request }) => {
    const clientId = getClientId(request);
    const { allowed, resetIn } = rateLimit(clientId, rateLimitConfigs.booking);
    if (!allowed) {
        return rateLimitResponse(resetIn);
    }

    try {
        const payload = bookingSchema.parse(await request.json());

        // Honeypot
        if (payload.website_url && payload.website_url.trim() !== '') {
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await sendBookingNotificationEmail({
            clientName: payload.name,
            clientEmail: payload.email,
            clientPhone: payload.phone,
            serviceId: payload.service_id,
            bookingDate: payload.date,
            startTime: payload.time,
            notes: payload.notes,
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify({ error: 'Neplatné údaje rezervácie' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        console.error('Booking API error:', error);
        return new Response(JSON.stringify({ error: 'Interná chyba servera' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
