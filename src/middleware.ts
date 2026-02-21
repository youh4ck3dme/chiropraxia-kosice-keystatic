import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
    const { url } = context;

    // 1. Secure Headers
    const response = await next();

    // Apply headers to all responses
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    // 2. Admin Protection Logic (Future implementation)
    if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/admin')) {
        // Placeholder for server-side auth check
    }

    return response;
});
