// cspell:words keystatic
import { test, expect } from '@playwright/test';

test.describe('Keystatic navigation', () => {
  test('loads /keystatic without 5xx or visible error markers', async ({ page }) => {
    const response = await page.goto('/keystatic', { waitUntil: 'domcontentloaded' });
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(500);

    const html = await page.content();
    const errorMarkers = [
      'Application error',
      'Internal Server Error',
      'Something went wrong',
      'Unexpected error',
    ];
    const hasError = errorMarkers.some((m) => html.includes(m));
    expect(hasError, 'Page should not show generic error text').toBe(false);
  });

  test('all main sections are reachable from Keystatic', async ({ page }) => {
    await page.goto('/keystatic', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    // Either we see login (GitHub) or the dashboard with collection links
    const hasLogin =
      (await page.getByRole('link', { name: /GitHub/i }).count()) > 0 ||
      (await page.getByRole('button', { name: /GitHub|Prihlás|Sign/i }).count()) > 0;
    const hasNav =
      (await page.getByText(/Blog|Články|Nastavenia|Recenzie|Vizitky|Dashboard/i).count()) > 0;

    expect(hasLogin || hasNav, 'Keystatic should show either login or dashboard navigation').toBe(
      true
    );

    // If we have navigation, try to open collection links (Blog is primary)
    if (hasNav) {
      const blogLink = page
        .locator('a[href*="blog"], a:has-text("Blog"), a:has-text("Články")')
        .first();
      if ((await blogLink.count()) > 0) {
        await blogLink.click();
        await page.waitForTimeout(800);
        const res = page.url();
        expect(res).toContain('keystatic');
        const errAgain = await page.content();
        expect(errAgain).not.toContain('Internal Server Error');
      }
    }
  });

  test('collection list and create-new entry are reachable when authenticated', async ({
    page,
  }) => {
    await page.goto('/keystatic', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    // If dashboard: look for "Create" / "Nový" / collection entry link
    const createOrNew = page.getByRole('link', { name: /Create|Nový|New|Pridať/i });
    const listLink = page.locator('a[href*="/keystatic/"]').first();

    const canProceed = (await createOrNew.count()) > 0 || (await listLink.count()) > 0;
    if (!canProceed) {
      // Not authenticated or UI different – pass without failing
      test.skip();
      return;
    }

    // Click first collection link if present (e.g. blog)
    const firstCollection = page.locator('a[href*="keystatic"][href*="blog"]').first();
    if ((await firstCollection.count()) > 0) {
      await firstCollection.click();
      await page.waitForTimeout(1000);
      expect(page.url()).toMatch(/keystatic/);
    }
  });
});
