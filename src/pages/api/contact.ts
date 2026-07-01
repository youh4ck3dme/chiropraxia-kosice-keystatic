import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { wrapEmailLayout } from '../../lib/email-templates';

export const prerender = false;

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  phone?: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: ContactPayload = await request.json();

    // Validate
    if (!data.name || !data.email || !data.message) {
      return new Response(JSON.stringify({ error: 'Chýbajúce povinné polia' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = import.meta.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn('RESEND_API_KEY missing - skipping email send (simulation)');
      return new Response(
        JSON.stringify({ success: true, message: 'Simulation: API key missing' }),
        { status: 200 }
      );
    }

    const resend = new Resend(apiKey);
    const toEmail = import.meta.env.BOOKING_EMAIL || 'booking@fyzioafit.sk';
    const fromEmail = import.meta.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    // Send email using Resend
    const { error } = await resend.emails.send({
      from: `Web Formulár <${fromEmail}>`,
      to: [toEmail],
      replyTo: data.email,
      subject: `📩 Nová správa: ${data.name}`,
      html: wrapEmailLayout(
        'Nová správa z webu',
        `
        <div style="margin-bottom: 25px;">
          <div style="color: #a1a1aa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">ODOSIELATEĽ</div>
          <div style="color: #ffffff; font-size: 16px; font-weight: bold;">${data.name}</div>
        </div>

        <div style="margin-bottom: 25px;">
          <div style="color: #a1a1aa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">KONTAKT</div>
          <div style="color: #ffffff; font-size: 16px;">
            <a href="mailto:${data.email}" style="color: #14b8a6; text-decoration: none;">${data.email}</a>
            <br>
            <span style="color: #e5e5e5;">${data.phone || 'Bez telefónneho čísla'}</span>
          </div>
        </div>

        <div style="background-color: #1a1a1a; padding: 20px; border-radius: 8px; border-left: 4px solid #14b8a6;">
          <div style="color: #a1a1aa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">SPRÁVA</div>
          <div style="color: #e5e5e5; font-style: italic; line-height: 1.6;">
            "${data.message.replace(/\n/g, '<br/>')}"
          </div>
        </div>
        `
      ),
    });

    if (error) {
      console.error('Resend API error FULL DETAILS:', JSON.stringify(error, null, 2));
      return new Response(
        JSON.stringify({ error: `Chyba Resend: ${error.message || 'Unknown'}` }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Contact error:', error);
    return new Response(JSON.stringify({ error: 'Interná chyba servera' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
