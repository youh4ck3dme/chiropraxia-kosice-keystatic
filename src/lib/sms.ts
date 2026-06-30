import twilio from 'twilio';

// SMS settings from env (Supabase suspended – no DB settings)
const accountSid = import.meta.env.TWILIO_ACCOUNT_SID;
const authToken = import.meta.env.TWILIO_AUTH_TOKEN;
const fromNumber = import.meta.env.TWILIO_PHONE_NUMBER;
const smsEnabled = import.meta.env.SMS_ENABLED === 'true' || import.meta.env.SMS_ENABLED === '1';
const smsTemplate = import.meta.env.SMS_TEMPLATE || "Dobrý deň {name}, vaša rezervácia v Chiropraxia Košice na termín {date} o {time} bola úspešne potvrdená. Tešíme sa na vás.";

/**
 * Send SMS notification.
 * When Supabase is suspended, SMS is controlled by env: SMS_ENABLED, SMS_TEMPLATE.
 * Default: SMS vypnuté (disabled).
 */
export async function sendSms(
    to: string,
    data: { name: string; date: string; time: string; cancellationLink?: string }
): Promise<{ success: boolean; error?: string }> {

    if (!accountSid || !authToken || !fromNumber) {
        console.warn('Twilio credentials missing. SMS skipped.');
        return { success: false, error: 'Credentials missing' };
    }

    if (!smsEnabled) {
        return { success: true };
    }

    try {
        let message = smsTemplate
            .replaceAll('{name}', data.name)
            .replaceAll('{date}', data.date)
            .replaceAll('{time}', data.time);

        if (data.cancellationLink) {
            message = message.replaceAll('{cancel_link}', data.cancellationLink);
            if (!smsTemplate.includes('{cancel_link}')) {
                message += `\nZrušenie: ${data.cancellationLink}`;
            }
        }

        const client = twilio(accountSid, authToken);
        let phone = to.replace(/\s+/g, '');
        if (!phone.startsWith('+')) {
            if (phone.startsWith('09')) {
                phone = '+421' + phone.substring(1);
            } else if (phone.startsWith('00')) {
                phone = '+' + phone.substring(2);
            }
        }

        await client.messages.create({
            body: message,
            from: fromNumber,
            to: phone,
        });

        return { success: true };

    } catch (err: any) {
        console.error('Error sending SMS:', err);
        return { success: false, error: err.message };
    }
}
