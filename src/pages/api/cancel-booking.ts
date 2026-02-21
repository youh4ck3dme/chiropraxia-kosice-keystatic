import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { verifyCancellationToken } from '../../lib/tokens';

export const GET: APIRoute = async ({ url, redirect }) => {
    const token = url.searchParams.get('token');

    if (!token) {
        return new Response('Chýba overovací token.', { status: 400 });
    }

    const bookingId = verifyCancellationToken(token);

    if (!bookingId) {
        return new Response('Neplatný alebo expirovaný odkaz na zrušenie.', { status: 400 });
    }

    try {
        const { data: booking, error: fetchError } = await supabase
            .from('bookings')
            .select('status')
            .eq('id', bookingId)
            .single();

        if (fetchError || !booking) {
            return new Response('Rezervácia nebola nájdená.', { status: 404 });
        }

        if (booking.status === 'cancelled') {
            return redirect(`/rezervacia/zrusene?id=${bookingId}&already=true`);
        }

        const { error: updateError } = await supabase
            .from('bookings')
            .update({
                status: 'cancelled',
                cancelled_at: new Date().toISOString(),
                notes: '[Zrušené zákazníkom cez odkaz]'
            })
            .eq('id', bookingId);

        if (updateError) {
            console.error('Cancellation error:', updateError);
            return new Response('Chyba pri rušení rezervácie.', { status: 500 });
        }

        return redirect(`/rezervacia/zrusene?id=${bookingId}`);

    } catch (err) {
        console.error('Cancellation API error:', err);
        return new Response('Interná chyba servera.', { status: 500 });
    }
};
