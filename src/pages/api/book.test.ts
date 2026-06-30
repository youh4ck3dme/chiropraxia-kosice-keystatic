import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './book';

vi.mock('../../lib/notifications.server', () => ({
  sendBookingNotificationEmail: vi.fn(),
}));

describe('POST /api/book', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 503 with error message (booking temporarily disabled)', async () => {
    const request = new Request('http://localhost/api/book', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'Ján Novák',
        email: 'jan@example.com',
        phone: '+421900000000',
        service_id: 'chiroprakticka-masaz',
        date: '2026-03-21',
        time: '10:00',
      }),
    });

    const response = await POST({ request } as any);
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  it('also returns 503 for invalid payload (booking temporarily disabled)', async () => {
    const request = new Request('http://localhost/api/book', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'A', email: 'bad-email' }),
    });

    const response = await POST({ request } as any);
    expect(response.status).toBe(503);
  });
});
