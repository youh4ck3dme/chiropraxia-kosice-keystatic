import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './book';

vi.mock('../../lib/notifications.server', () => ({
  sendBookingNotificationEmail: vi.fn(),
}));

describe('POST /api/book', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('accepts valid booking payload', async () => {
    const request = new Request('http://localhost/api/book', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '1.2.3.4',
      },
      body: JSON.stringify({
        name: 'Ján Novák',
        email: 'jan@example.com',
        phone: '+421900000000',
        service_id: 'chiroprakticka-masaz',
        date: '2026-03-21',
        time: '10:00',
        notes: 'Test rezervácia',
        website_url: '',
      }),
    });

    const response = await POST({ request } as any);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
  });

  it('rejects invalid payload', async () => {
    const request = new Request('http://localhost/api/book', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '5.6.7.8',
      },
      body: JSON.stringify({
        name: 'A',
        email: 'bad-email',
        service_id: '',
        date: 'invalid',
        time: 'invalid',
      }),
    });

    const response = await POST({ request } as any);
    expect(response.status).toBe(400);
  });
});
