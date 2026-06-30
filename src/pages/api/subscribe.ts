import type { APIRoute } from 'astro';
import { wrapEmailLayout } from '../../lib/email-templates';

export const prerender = false;

interface SubscribePayload {
  email: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: SubscribePayload = await request.json();

    // Validate email
    if (!data.email || !data.email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Neplatná emailová adresa' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Resend Configuration
    const apiKey = import.meta.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn('RESEND_API_KEY missing - logging subscription (simulation):', data.email);
      return new Response(JSON.stringify({ success: true, message: 'Subscribed (Mock)' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    // Notify Admin
    await resend.emails.send({
      from: 'Newsletter Bot <booking@fyzioafit.sk>',
      to: ['booking@fyzioafit.sk'],
      subject: `🔔 Nový odberateľ newslettera: ${data.email}`,
      html: wrapEmailLayout(
        'Nový záujemca o newsletter',
        `
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #14b8a6; margin: 0;">+1 Nový Odberateľ</h2>
        </div>
        
        <div style="background-color: #1a1a1a; border: 1px solid #333; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="color: #a1a1aa; font-size: 12px; text-transform: uppercase;">EMAIL</div>
          <div style="color: #ffffff; font-size: 20px; font-weight: bold; margin-top: 5px;">${data.email}</div>
        </div>

        <p style="color: #a1a1aa; font-size: 13px; text-align: center; margin-top: 20px;">
          Tento email slúži ako automatická notifikácia pre manuálne pridanie do databázy.
        </p>
        `
      ),
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return new Response(JSON.stringify({ error: 'Interná chyba servera' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
