import { supabase } from '../../lib/supabase';
import type { APIRoute } from 'astro';

export const runtime = 'edge';

export const GET: APIRoute = async ({ url }) => {
    try {
        const dateStr = url.searchParams.get('date');
        if (!dateStr) {
            return new Response(JSON.stringify({ error: 'Dátum je povinný' }), { status: 400 });
        }

        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('start_time')
            .neq('status', 'cancelled')
            .eq('booking_date', dateStr);

        if (error) {
            console.error('Supabase error:', error);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        // Map booked times to HH:mm
        const bookedHours = (bookings || []).map(b => {
            // start_time is likely "HH:mm:ss"
            return b.start_time.slice(0, 5);
        });

        // Generate ONLY HOURLY intervals: 08:00 - 18:00
        const slots = [];
        const now = new Date();
        const isToday = now.toISOString().split('T')[0] === dateStr;
        const currentHour = now.getUTCHours();

        for (let h = 8; h <= 18; h++) {
            const time = `${h.toString().padStart(2, '0')}:00`;

            let available = !bookedHours.includes(time);

            // If it's today, disable slots that have already passed
            if (isToday && h <= currentHour) {
                available = false;
            }

            slots.push({
                time,
                available
            });
        }

        return new Response(JSON.stringify({ slots }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err: any) {
        console.error('Availability API Error:', err);
        return new Response(JSON.stringify({ error: err.message || 'Chyba servera' }), { status: 500 });
    }
};
