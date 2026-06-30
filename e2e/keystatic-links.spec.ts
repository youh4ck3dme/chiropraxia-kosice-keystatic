// cspell:words keystatic domcontentloaded hrefs
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.chiropraxiakosice.eu';

function normalizeHref(rawHref: string): string | null {
  if (!rawHref) return null;
  if (rawHref.startsWith('#')) return null;
  if (
    rawHref.startsWith('mailto:') ||
    rawHref.startsWith('tel:') ||
    rawHref.startsWith('javascript:')
  )
    return null;

  if (rawHref.startsWith('http://') || rawHref.startsWith('https://')) {
    return rawHref;
  }

  if (rawHref.startsWith('/')) {
    return `${BASE_URL}${rawHref}`;
  }

  return `${BASE_URL}/${rawHref.replace(/^\/+/, '')}`;
}

test.describe('Keystatic link health', () => {
  test('all links on /keystatic should avoid 5xx and visible error pages', async ({
    page,
    request,
  }) => {
    const pageErrors: string[] = [];

    page.on('pageerror', (error) => {
      pageErrors.push(`pageerror: ${error.message}`);
    });

    page.on('console', (message) => {
      if (message.type() === 'error') {
        const text = message.text();
        if (!/Failed to load resource: the server responded with a status of 4\d\d/i.test(text)) {
          pageErrors.push(`console.error: ${text}`);
        }
      }
    });

    const response = await page.goto(`${BASE_URL}/keystatic`, { waitUntil: 'domcontentloaded' });
    expect(response, 'Keystatic page did not return a response').not.toBeNull();
    expect(response!.status(), 'Keystatic page returned server error').toBeLessThan(500);

    await page.waitForTimeout(1200);

    const hrefs = await page
      .locator('a[href]')
      .evaluateAll((anchors) =>
        anchors
          .map((anchor) => (anchor as HTMLAnchorElement).getAttribute('href') || '')
          .filter(Boolean)
      );

    const normalizedLinks = Array.from(
      new Set(
        hrefs.map((href) => normalizeHref(href)).filter((href): href is string => Boolean(href))
      )
    );

    expect(normalizedLinks.length, 'No links found on /keystatic').toBeGreaterThan(0);

    const failingLinks: Array<{ url: string; status: number }> = [];

    for (const url of normalizedLinks) {
      const linkResponse = await request.get(url, { maxRedirects: 10, timeout: 30000 });
      const status = linkResponse.status();

      if (status >= 500) {
        failingLinks.push({ url, status });
      }
    }

    const html = await page.content();
    const knownErrorMarkers = [
      'Application error',
      'Internal Server Error',
      'Something went wrong',
      'Unexpected error',
    ];

    const hasVisibleErrorMarker = knownErrorMarkers.some((marker) => html.includes(marker));

    expect(
      failingLinks,
      `Links with server errors:\n${failingLinks.map((item) => `${item.status} -> ${item.url}`).join('\n')}`
    ).toHaveLength(0);

    expect(hasVisibleErrorMarker, 'Keystatic page contains visible generic error marker text').toBe(
      false
    );

    expect(pageErrors, `Runtime errors on /keystatic:\n${pageErrors.join('\n')}`).toHaveLength(0);
  });
});
