// cspell:words keystatic
import { test, expect } from '@playwright/test';

test.describe('Keystatic forms and errors', () => {
  test('no 5xx on Keystatic collection and singleton pages', async ({ page, request }) => {
    const base = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4322';
    const urls = [
      `${base}/keystatic`,
      `${base}/keystatic/collection/blog`,
      `${base}/keystatic/singleton/siteSettings`,
      `${base}/keystatic/collection/testimonials`,
      `${base}/keystatic/collection/digital-cards`,
    ];
    for (const url of urls) {
      const res = await request.get(url, { maxRedirects: 5 });
      if (res.status() === 404) continue;
      expect(res.status(), `${url} should not be 5xx`).toBeLessThan(500);
    }
  });

  test('no JS runtime errors on /keystatic load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const t = msg.text();
        if (!/Failed to load resource.*4\d\d/i.test(t)) errors.push(t);
      }
    });
    await page.goto('/keystatic', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    expect(errors, `No runtime/console errors: ${errors.join('; ')}`).toHaveLength(0);
  });

});
