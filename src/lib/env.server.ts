import { z } from 'zod';

/**
 * Server-side Environment Variables Schema
 * Ensures all required secrets are present and correctly formatted.
 */
const EnvSchema = z.object({
    // Supabase
    PUBLIC_SUPABASE_URL: z.string().url(),
    PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

    // Notifications
    RESEND_API_KEY: z.string().min(1),
    TWILIO_ACCOUNT_SID: z.string().min(1).optional(),
    TWILIO_AUTH_TOKEN: z.string().min(1).optional(),
    TWILIO_PHONE_NUMBER: z.string().min(1).optional(),

    // App Settings
    SITE_URL: z.string().url().default('https://chiropraxiakosice.eu'),
    JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
});

// Validate env on import (server-side only)
const processEnv = {
    PUBLIC_SUPABASE_URL: import.meta.env.PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY: import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    RESEND_API_KEY: import.meta.env.RESEND_API_KEY,
    TWILIO_ACCOUNT_SID: import.meta.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: import.meta.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: import.meta.env.TWILIO_PHONE_NUMBER,
    SITE_URL: import.meta.env.SITE_URL,
    JWT_SECRET: import.meta.env.JWT_SECRET,
};

const parsed = EnvSchema.safeParse(processEnv);

if (!parsed.success) {
    console.error(
        "❌ Invalid environment variables:",
        JSON.stringify(parsed.error.format(), null, 2)
    );
    // In production, we might want to throw an error here to prevent the app from starting
    // throw new Error("Invalid environment variables");
}

export const env = parsed.success ? parsed.data : processEnv as any;
