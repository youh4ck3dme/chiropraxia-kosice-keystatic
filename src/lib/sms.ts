import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';

// Init Supabase (to check settings)
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Init Twilio
const accountSid = import.meta.env.TWILIO_ACCOUNT_SID;
const authToken = import.meta.env.TWILIO_AUTH_TOKEN;
const fromNumber = import.meta.env.TWILIO_PHONE_NUMBER;

// Types
interface SmsConfig {
    enabled: boolean;
    template: string; // e.g. "Dobrý deň {name}, vaša rezervácia na {date} o {time} bola potvrdená."
}

const DEFAULT_TEMPLATE = "Dobrý deň {name}, vaša rezervácia v Chiropraxia Košice na termín {date} o {time} bola úspešne potvrdená. Tešíme sa na vás.";

/**
 * Send SMS notification
 * Checks if SMS is enabled in DB settings first.
 */
export async function sendSms(
    to: string,
    data: { name: string; date: string; time: string; cancellationLink?: string }
): Promise<{ success: boolean; error?: string }> {

    if (!accountSid || !authToken || !fromNumber) {
        console.warn('Twilio credentials missing. SMS skipped.');
        return { success: false, error: 'Credentials missing' };
    }

    try {
        // 1. Check if SMS is enabled in DB
        const { data: settings } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'sms_config')
            .single();

        const config: SmsConfig = settings?.value || { enabled: false, template: DEFAULT_TEMPLATE };

        if (!config.enabled) {
            console.log('SMS notifications are disabled in settings.');
            return { success: true }; // Not an error, just customized pref
        }

        // 2. Format message
        let message = config.template || DEFAULT_TEMPLATE;
        message = message.replace('{name}', data.name);
        message = message.replace('{date}', data.date);
        message = message.replace('{time}', data.time);

        if (data.cancellationLink) {
            message = message.replace('{cancel_link}', data.cancellationLink);
            // If placeholder not present but link exists, append it
            if (!config.template?.includes('{cancel_link}')) {
                message += `\nZrušenie: ${data.cancellationLink}`;
            }
        }

        // 3. Send via Twilio
        const client = twilio(accountSid, authToken);

        // Normalize phone number (Slovak prefix default)
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

        console.log(`SMS sent to ${phone}`);
        return { success: true };

    } catch (err: any) {
        console.error('Error sending SMS:', err);
        return { success: false, error: err.message };
    }
}
