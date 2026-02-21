import { createBooking, getServices, getStaff, supabase } from '../../lib/supabase';
import { sendConfirmationEmail } from '../../lib/notifications.server';
import { generateCancellationToken } from '../../lib/tokens';
import type { APIRoute } from 'astro';
import { z } from 'zod';

const BookingSchema = z.object({
    name: z.string().min(2, 'Meno je príliš krátke'),
    phone: z.string().min(6, 'Telefónne číslo je neplatné'),
    email: z.string().email('Neplatný email'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Neplatný formát dátumu'),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Neplatný formát času'),
    service_id: z.string().min(1, 'Služba nie je vybraná'),
    website_url: z.string().max(0, 'Honeypot triggered').optional(), // Field must be empty
});

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();

        // 1. Zod Validation (including Honeypot check)
        const result = BookingSchema.safeParse(body);
        if (!result.success) {
            return new Response(JSON.stringify({
                error: result.error.issues[0]?.message || 'Neplatné údaje'
            }), { status: 400 });
        }

        const { name, phone, email, date, time, service_id } = result.data;

        // 2. Basic Rate Limiting (Prevent spam from same email/phone)
        const { data: recentBookings } = await supabase
            .from('bookings')
            .select('id')
            .or(`client_email.eq.${email},client_phone.eq.${phone}`)
            .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()); // Last 15 min

        if (recentBookings && recentBookings.length >= 3) {
            return new Response(JSON.stringify({
                error: 'Príliš veľa rezervácií za krátky čas. Skúste to prosím neskôr.'
            }), { status: 429 });
        }

        // Resolve service ID if it's a slug
        const services = await getServices();
        let targetServiceId = service_id;

        // If the ID doesn't look like a UUID or is 'chiropraxia', find the real one
        if (service_id === 'chiropraxia' || service_id.length < 30) {
            const foundService = services.find(s =>
                s.id === service_id ||
                s.name.toLowerCase().includes('chiropraxia')
            ) || services[0];
            if (foundService) targetServiceId = foundService.id;
        }

        // Default staff ID if not provided (get first active staff or null)
        const staffList = await getStaff();
        const staffId = staffList[0]?.id || '';

        // Create the booking using existing library function
        const bookingId = await createBooking({
            clientName: name,
            clientEmail: email,
            clientPhone: phone,
            staffId: staffId,
            serviceId: targetServiceId,
            bookingDate: date,
            startTime: `${time}:00`,
        });

        if (!bookingId) {
            return new Response(JSON.stringify({ error: 'Nepodarilo sa vytvoriť rezerváciu' }), { status: 500 });
        }

        // Optional: Send email and SMS confirmation (async)
        try {
            const service = services.find(s => s.id === targetServiceId);
            const staffMember = staffList.find(s => s.id === staffId);

            const cancelToken = generateCancellationToken(bookingId);
            const siteUrl = import.meta.env.SITE_URL || 'https://chiropraxiakosice.eu';
            const cancellationLink = `${siteUrl}/api/cancel-booking?token=${cancelToken}`;

            // 1. Email
            await sendConfirmationEmail(
                bookingId,
                {
                    clientName: name,
                    clientEmail: email,
                    serviceId: targetServiceId,
                    staffId: staffId,
                    bookingDate: date,
                    startTime: time,
                },
                service?.name || 'Chiropraxia',
                staffMember?.name || 'Terapeut'
            );

            // 2. SMS (new)
            try {
                const { sendSms } = await import('../../lib/sms');
                await sendSms(phone, {
                    name,
                    date,
                    time,
                    cancellationLink
                });
            } catch (smsErr) {
                console.error('SMS sending failed:', smsErr);
            }
        } catch (notifErr) {
            console.error('Confirmation (Email/SMS) failed:', notifErr);
        }

        return new Response(JSON.stringify({ success: true, bookingId }), { status: 200 });

    } catch (err: any) {
        console.error('Booking API Error:', err);
        return new Response(JSON.stringify({ error: err.message || 'Interná chyba servera' }), { status: 500 });
    }
};
