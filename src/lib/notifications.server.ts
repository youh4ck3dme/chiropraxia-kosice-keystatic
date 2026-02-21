import { Resend } from 'resend';
import { wrapEmailLayout } from './email-templates';
import { generateCancellationToken } from './tokens';

export async function sendConfirmationEmail(
    bookingId: string,
    details: {
        clientName: string;
        clientEmail: string;
        serviceId: string;
        staffId: string;
        bookingDate: string;
        startTime: string;
    },
    serviceName: string,
    staffName: string
) {
    const apiKey = import.meta.env.RESEND_API_KEY;
    const siteUrl = import.meta.env.SITE_URL || 'https://chiropraxiakosice.eu';
    if (!apiKey) return;

    const resend = new Resend(apiKey);
    const formattedDate = new Date(details.bookingDate).toLocaleDateString('sk-SK');
    const time = details.startTime.slice(0, 5);

    const cancelToken = generateCancellationToken(bookingId);
    const cancelLink = `${siteUrl}/api/cancel-booking?token=${cancelToken}`;

    await resend.emails.send({
        from: 'Chiropraxia Košice <info@chiropraxiakosice.eu>',
        to: [details.clientEmail],
        subject: `✅ Potvrdenie rezervácie: ${formattedDate} o ${time}`,
        html: wrapEmailLayout(
            'Vaša rezervácia je potvrdená',
            `
      <p style="margin-bottom: 30px;">
        Vážený klient <strong>${details.clientName}</strong>,<br><br>
        radi by sme vám potvrdili váš termín u nás. Tešíme sa na vašu návštevu.
      </p>

      <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #1a1a1a; border-radius: 8px; border: 1px solid #333; margin-bottom: 30px;">
        <tr>
          <td width="30%" style="color: #a1a1aa; font-size: 12px; text-transform: uppercase;">DÁTUM</td>
          <td style="color: #ffffff; font-weight: bold;">${formattedDate}</td>
        </tr>
        <tr>
          <td style="color: #a1a1aa; font-size: 12px; text-transform: uppercase;">ČAS</td>
          <td style="color: #ffffff; font-weight: bold;">${time}</td>
        </tr>
        <tr>
          <td style="color: #a1a1aa; font-size: 12px; text-transform: uppercase;">SLUŽBA</td>
          <td style="color: #14b8a6;">${serviceName}</td>
        </tr>
        <tr>
          <td style="color: #a1a1aa; font-size: 12px; text-transform: uppercase;">TERAPEUT</td>
          <td style="color: #ffffff;">${staffName}</td>
        </tr>
      </table>

      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${siteUrl}" style="display: inline-block; background-color: #14b8a6; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
          Otvoriť webstránku
        </a>
      </div>
      
      <div style="text-align: center; padding: 20px; border-top: 1px solid #333;">
        <p style="color: #a1a1aa; font-size: 13px; margin-bottom: 15px;">
          Ak sa nemôžete dostaviť, prosím informujte nás aspoň 24 hodín vopred.
        </p>
        <a href="${cancelLink}" style="color: #ef4444; font-size: 13px; text-decoration: underline;">
          Zrušiť rezerváciu online
        </a>
      </div>
      `
        )
    });
}

export async function sendBookingEmail(
  _bookingId: string,
    details: {
        clientName: string;
        clientEmail: string;
        bookingDate: string;
        startTime: string;
    },
    serviceName: string,
    staffName: string,
    status: 'confirmed' | 'cancelled' | 'updated'
) {
    const apiKey = import.meta.env.RESEND_API_KEY;
    if (!apiKey) return;

    const resend = new Resend(apiKey);
    const formattedDate = new Date(details.bookingDate).toLocaleDateString('sk-SK');
    const time = details.startTime.slice(0, 5);

    let subject = '';
    let title = '';
    let message = '';
    let color = '#14b8a6';

    switch (status) {
        case 'confirmed':
            subject = `✅ Termín potvrdený: ${formattedDate}`;
            title = 'Rezervácia potvrdená';
            message = 'Váš termín bol úspešne schválený.';
            break;
        case 'cancelled':
            subject = `❌ Termín zrušený: ${formattedDate}`;
            title = 'Rezervácia zrušená';
            message = 'Je nám ľúto, ale váš termín bol zrušený.';
            color = '#ef4444';
            break;
        case 'updated':
            subject = `✏️ Zmena termínu: ${formattedDate}`;
            title = 'Aktualizácia rezervácie';
            message = 'Detaily vašej rezervácie boli zmenené.';
            color = '#3b82f6';
            break;
    }

    await resend.emails.send({
        from: 'Chiropraxia Košice <info@chiropraxiakosice.eu>',
        to: [details.clientEmail],
        subject: subject,
        html: wrapEmailLayout(
            title,
            `
      <p style="margin-bottom: 20px;">Vážený klient <strong>${details.clientName}</strong>,</p>
      
      <div style="background-color: #1a1a1a; border-left: 4px solid ${color}; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
        <p style="margin: 0; color: #ffffff;">${message}</p>
      </div>

      <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #111; border: 1px solid #333; border-radius: 8px;">
         <tr><td width="30%" style="color:#aaa;font-size:12px;">DÁTUM:</td><td style="color:#fff;">${formattedDate}</td></tr>
         <tr><td style="color:#aaa;font-size:12px;">ČAS:</td><td style="color:#fff;">${time}</td></tr>
         <tr><td style="color:#aaa;font-size:12px;">SLUŽBA:</td><td style="color:#fff;">${serviceName}</td></tr>
         <tr><td style="color:#aaa;font-size:12px;">TERAPEUT:</td><td style="color:#fff;">${staffName}</td></tr>
      </table>
      `
        )
    });
}
