// cspell:words keystatic domcontentloaded
import { test, expect } from '@playwright/test';

test.describe('Keystatic content reflection on public site', () => {
  test('validácia obsahu: verejná stránka blogu má title a meta description', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded' });
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    const count = await firstPostLink.count();
    if (count === 0) {
      test.skip(true, 'No blog posts to check');
      return;
    }
    const href = await firstPostLink.getAttribute('href');
    if (!href || href === '/blog') return;
    await page.goto(href, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/.+/);
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDesc).toBeTruthy();
    expect(metaDesc!.trim().length).toBeGreaterThan(0);
  });

  test('meta title and description are reflected on public blog post page', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded' });
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    if ((await firstPostLink.count()) === 0) {
      test.skip(true, 'No blog posts');
      return;
    }
    const href = await firstPostLink.getAttribute('href');
    if (!href || href === '/blog') return;
    await page.goto(href, { waitUntil: 'domcontentloaded' });
    const title = await page.title();
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(title).toBeTruthy();
    expect(title!.trim().length).toBeGreaterThan(0);
    expect(metaDesc).toBeTruthy();
    expect(metaDesc!.trim().length).toBeGreaterThan(0);
  });
});
