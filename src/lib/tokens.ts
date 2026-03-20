import { createHmac } from 'node:crypto';

const JWT_SECRET = import.meta.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required but not set.');
}

export function generateCancellationToken(bookingId: string): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payload = JSON.stringify({ id: bookingId, exp: expiresAt });
  const payloadBase64 = Buffer.from(payload).toString('base64url');

  const hmac = createHmac('sha256', JWT_SECRET);
  hmac.update(payloadBase64);
  const signature = hmac.digest('base64url');

  return `${payloadBase64}.${signature}`;
}

export function verifyCancellationToken(token: string): string | null {
  try {
    const [payloadBase64, signature] = token.split('.');
    if (!payloadBase64 || !signature) return null;

    const hmac = createHmac('sha256', JWT_SECRET);
    hmac.update(payloadBase64);
    const expectedSignature = hmac.digest('base64url');

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString());

    if (Date.now() > payload.exp) return null;

    return payload.id;
  } catch {
    return null;
  }
}
