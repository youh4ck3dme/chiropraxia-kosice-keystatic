// cspell:words keystatic domcontentloaded
import { test, expect } from '@playwright/test';

test.describe('Admin & Keystatic smoke', () => {
  test('Keystatic loads without 5xx and shows login or dashboard', async ({ page }) => {
    const res = await page.goto('/keystatic', { waitUntil: 'domcontentloaded' });
    expect(res).not.toBeNull();
    expect(res!.status()).toBeLessThan(500);
    const hasLogin =
      (await page.getByRole('button', { name: /GitHub/i }).count()) > 0 ||
      (await page.getByRole('link', { name: /GitHub/i }).count()) > 0;
    const hasNav = (await page.getByText(/Blog|Články|Recenzie|Dashboard/i).count()) > 0;
    expect(hasLogin || hasNav).toBe(true);
  });

  test('main Keystatic sections are reachable (Blog, Recenzie)', async ({ page }) => {
    await page.goto('/keystatic', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const blogLink = page
      .locator('a[href*="blog"], a:has-text("Blog"), a:has-text("Články")')
      .first();
    const recenzieLink = page.locator('a[href*="recenzie"], a:has-text("Recenzie")').first();
    const hasAny = (await blogLink.count()) > 0 || (await recenzieLink.count()) > 0;
    if (!hasAny) {
      test.skip(true, 'No collection links (not authenticated or UI changed)');
      return;
    }
    if ((await blogLink.count()) > 0) {
      await blogLink.click();
      await page.waitForTimeout(1000);
      expect(page.url()).toContain('keystatic');
      const html = await page.content();
      expect(html).not.toContain('Internal Server Error');
    }
  });

  test('Admin loads without 5xx and shows login or dashboard', async ({ page }) => {
    const res = await page.goto('/admin', { waitUntil: 'domcontentloaded' });
    expect(res).not.toBeNull();
    expect(res!.status()).toBeLessThan(500);
    await page.waitForTimeout(3000);
    const hasForm =
      (await page.getByPlaceholder(/@|email|e-mail/i).count()) > 0 ||
      (await page.getByPlaceholder(/••••••••/).count()) > 0;
    const hasDashboard = (await page.getByText(/Rezervácie|Bookings|Dashboard|Tab/i).count()) > 0;
    expect(hasForm || hasDashboard).toBe(true);
  });

  test('can open create new blog entry form when authenticated', async ({ page }) => {
    await page.goto('/keystatic', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const blogLink = page.locator('a[href*="blog"]').first();
    if ((await blogLink.count()) === 0) {
      test.skip(true, 'Blog link not found');
      return;
    }
    await blogLink.click();
    await page.waitForTimeout(1500);
    const createLink = page.getByRole('link', { name: /Create|Nový|Pridať/i }).first();
    if ((await createLink.count()) === 0) {
      test.skip(true, 'Create link not found');
      return;
    }
    await createLink.click();
    await page.waitForTimeout(1500);
    const titleField = page.getByLabel(/Názov|title|Title/i).first();
    await expect(titleField).toBeVisible({ timeout: 10000 });
  });

  test('can open existing blog entry edit form when authenticated', async ({ page }) => {
    await page.goto('/keystatic', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const blogLink = page.locator('a[href*="blog"]').first();
    if ((await blogLink.count()) === 0) {
      test.skip(true, 'Blog link not found');
      return;
    }
    await blogLink.click();
    await page.waitForTimeout(1500);
    const firstEntry = page.locator('a[href*="blog/"][href*="/"]').first();
    if ((await firstEntry.count()) === 0) {
      test.skip(true, 'No blog entries to edit');
      return;
    }
    await firstEntry.click();
    await page.waitForTimeout(2000);
    const titleField = page.getByLabel(/Názov|title|Title/i).first();
    await expect(titleField).toBeVisible({ timeout: 10000 });
  });
});
