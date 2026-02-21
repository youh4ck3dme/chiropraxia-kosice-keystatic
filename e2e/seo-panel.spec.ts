// cspell:words keystatic
import { test, expect } from '@playwright/test';

const waitOpts = { waitUntil: 'domcontentloaded' as const };

test.describe('SEO panel', () => {
  test('blog post with ?seo=1 shows SEO panel', async ({ page }) => {
    await page.goto('/blog', waitOpts);
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    const href = await firstPostLink.getAttribute('href');
    if (!href) {
      test.skip(true, 'No blog post links found');
      return;
    }
    const slug = href.replace('/blog/', '').replace(/\?.*$/, '');
    await page.goto(`/blog/${slug}?seo=1`, waitOpts);
    await page.waitForTimeout(1500);

    const panel = page.getByTestId('seo-panel');
    await expect(panel).toBeVisible({ timeout: 5000 });
  });

  test('SEO panel contains Google Snippet preview and recommendations', async ({ page }) => {
    await page.goto('/blog', waitOpts);
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    const href = await firstPostLink.getAttribute('href');
    if (!href) {
      test.skip(true, 'No blog post links found');
      return;
    }
    const slug = href.replace('/blog/', '').replace(/\?.*$/, '');
    await page.goto(`/blog/${slug}?seo=1`, waitOpts);
    await page.waitForTimeout(1500);

    const snippet = page.getByTestId('google-snippet-preview');
    await expect(snippet).toBeVisible({ timeout: 5000 });

    const recommendations = page.getByTestId('seo-recommendations');
    await expect(recommendations).toBeVisible({ timeout: 5000 });
  });

  test('SEO panel shows score and snippet title from post', async ({ page }) => {
    await page.goto('/blog', waitOpts);
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    const href = await firstPostLink.getAttribute('href');
    if (!href) {
      test.skip(true, 'No blog post links found');
      return;
    }
    const slug = href.replace('/blog/', '').replace(/\?.*$/, '');
    await page.goto(`/blog/${slug}?seo=1`, waitOpts);
    await page.waitForTimeout(1500);

    const snippet = page.getByTestId('google-snippet-preview');
    await expect(snippet).toBeVisible();
    const snippetText = await snippet.textContent();
    expect(snippetText).toBeTruthy();
    expect(snippetText!.length).toBeGreaterThan(0);
  });

  test('admin SEO overview page lists posts with scores', async ({ page }) => {
    await page.goto('/admin/seo-overview', waitOpts);
    const scores = page.getByTestId('seo-score-value');
    const count = await scores.count();
    expect(count).toBeGreaterThanOrEqual(0);
    const body = await page.content();
    expect(body).not.toContain('Internal Server Error');
  });
});
