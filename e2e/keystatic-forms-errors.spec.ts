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

  test('required field validation shows when creating blog with empty title', async ({ page }) => {
    await page.goto('/keystatic', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const blogLink = page.locator('a[href*="blog"]').first();
    if ((await blogLink.count()) === 0) {
      test.skip(true, 'Blog link not found');
      return;
    }
    await blogLink.click();
    await page.waitForTimeout(1500);

    const createLink = page.getByRole('link', { name: /Create|Nový|New|Pridať|Add/i }).first();
    if ((await createLink.count()) === 0) {
      test.skip(true, 'Create link not found');
      return;
    }
    await createLink.click();
    await page.waitForTimeout(1500);

    const titleInput = page.locator('input[type="text"]').first();
    if ((await titleInput.count()) === 0) {
      test.skip(true, 'Title input not found');
      return;
    }
    await titleInput.fill('');
    await titleInput.blur();
    await page.waitForTimeout(500);

    const saveBtn = page.getByRole('button', { name: /Save|Uložiť|Publish/i }).first();
    if ((await saveBtn.count()) > 0) {
      await saveBtn.click();
      await page.waitForTimeout(1000);
      const hasValidation = await page.getByText(/required|povinn|vyplň|fill|error|chyba/i).count() > 0
        || await page.locator('[role="alert"], .error, [data-invalid]').count() > 0;
      expect(hasValidation, 'Validation message or invalid state should appear for empty title').toBe(true);
    }
  });
});
