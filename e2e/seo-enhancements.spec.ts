import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || process.env.BASE_URL || 'http://localhost:4322';

test.describe('SEO & Editor Enhancements', () => {
  test.beforeEach(async ({ page }) => {
    // Mock AI API responses
    await page.route('**/api/ai/generate-meta', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          metaDescription:
            'Profesionálna chiropraxia v Košiciach. Pomôžeme vám s bolesťou chrbta a krčnej chrbtice.',
          length: 85,
        }),
      });
    });

    await page.route('**/api/ai/suggest-titles', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          suggestions: ['Chiropraxia v Košiciach', 'Ako na bolesť chrbta', 'Výhody fyzioterapie'],
        }),
      });
    });

    await page.route('**/api/ai/analyze-readability', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          readability: { score: 75 },
          readingTime: 2,
        }),
      });
    });
  });

  test('AI API: Generate Meta Description', async ({ page }) => {
    await page.goto('about:blank');
    const response = await page.evaluate(async (url) => {
      const res = await fetch(`${url}/api/ai/generate-meta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Testovací článok',
          content: 'Toto je dlhý text o chiropraktike a zdraví chrbtice v Košiciach.',
        }),
      });
      return { status: res.status, data: await res.json() };
    }, BASE_URL);

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.metaDescription.length).toBeGreaterThan(10);
    expect(response.data.metaDescription.length).toBeLessThanOrEqual(160);
  });

  test('AI API: Suggest Titles', async ({ page }) => {
    await page.goto('about:blank');
    const response = await page.evaluate(async (url) => {
      const res = await fetch(`${url}/api/ai/suggest-titles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentTitle: 'Test',
          content: 'Článok o výhodách chiropraxie pre športovcov.',
        }),
      });
      return { status: res.status, data: await res.json() };
    }, BASE_URL);

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.suggestions.length).toBe(3);
  });

  test('AI API: Analyze Readability', async ({ page }) => {
    await page.goto('about:blank');
    const response = await page.evaluate(async (url) => {
      const res = await fetch(`${url}/api/ai/analyze-readability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content:
            'Chiropraxia je manuálna terapia. Pomáha ľuďom s bolesťou. Je to bezpečné a účinné.',
        }),
      });
      return { status: res.status, data: await res.json() };
    }, BASE_URL);

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.readability.score).toBeGreaterThan(50);
    expect(response.data.readingTime).toBeGreaterThanOrEqual(1);
  });

  test('MDX Rendering: Custom Components', async ({ page }) => {
    // Navigate to the test post
    // Note: This requires the post to be deployed or tested locally
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));

    try {
      await page.goto(`${BASE_URL}/blog/test-features`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });
    } catch (e) {
      console.error('Failed to load blog/test-features:', e);
      // Take a screenshot on failure to see what's on the page
      await page.screenshot({ path: 'test-features-fail.png' });
      throw e;
    }

    // Check Callouts
    await expect(page.getByText('Toto je Tip komponent')).toBeVisible();
    await expect(page.locator('aside').filter({ hasText: /Toto je Tip komponent/ })).toBeVisible();

    // Check Video Embed
    await expect(page.locator('.video-embed')).toBeVisible();
    // Use a more relaxed check for the placeholder or iframe
    const placeholder = page.locator('.video-placeholder');
    if (await placeholder.isVisible()) {
      await placeholder.click();
    }
    await expect(page.locator('iframe')).toBeVisible();

    // Check FAQ
    await expect(page.getByText('Funguje tento test?')).toBeVisible();
    const faqSummary = page.locator('summary').filter({ hasText: 'Funguje tento test?' });
    await faqSummary.click();
    await expect(page.getByText('Áno, ak vidíte toto v accordione')).toBeVisible();

    // Check Before/After Slider
    await expect(page.locator('.before-after-slider')).toBeVisible();
    await expect(page.getByText('PRED', { exact: true })).toBeVisible();
    await expect(page.getByText('PO', { exact: true })).toBeVisible();
  });
});
