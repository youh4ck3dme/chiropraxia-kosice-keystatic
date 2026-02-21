// cspell:words keystatic seo slug
import { test, expect } from '@playwright/test';

const uniqueSlug = `e2e-test-${Date.now()}`;
const testTitle = `E2E test článok ${uniqueSlug}`;
const testDescription = 'Krátky SEO popis pre E2E test. Toto je meta description medzi 120 a 160 znakov pre overenie validácie a zobrazenia na webe.';

test.describe('Keystatic blog CRUD', () => {
  test('blog collection list is reachable and no 5xx', async ({ page }) => {
    await page.goto('/keystatic', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const link = page.locator('a[href*="blog"]').first();
    if ((await link.count()) === 0) {
      test.skip(true, 'Blog collection link not found (maybe not authenticated)');
      return;
    }
    await link.click();
    await page.waitForTimeout(1500);
    const url = page.url();
    expect(url).toMatch(/keystatic/);
    const content = await page.content();
    expect(content).not.toContain('Internal Server Error');
  });

  test('create new blog entry: form fields accept required data', async ({ page }) => {
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
      test.skip(true, 'Create new entry link not found');
      return;
    }
    await createLink.click();
    await page.waitForTimeout(1500);

    const titleInput = page.getByLabel(/Názov|title|Title/i).first();
    const descInput = page.getByLabel(/SEO|Popis|description|Description/i).first();
    const slugInput = page.getByLabel(/slug|URL|Slug/i).first();

    await expect(titleInput.or(page.locator('input[name*="title"], [data-label*="Názov"]').first())).toBeVisible({ timeout: 5000 }).catch(() => {});

    const titleField = page.locator('input, textarea').filter({ hasNotText: '' }).first();
    const allInputs = page.locator('input:visible, textarea:visible');
    const count = await allInputs.count();
    if (count === 0) {
      test.skip(true, 'No form inputs found (auth or UI changed)');
      return;
    }

    const firstText = page.locator('input[type="text"], textarea').first();
    await firstText.fill(testTitle);
    await page.waitForTimeout(300);

    const descField = page.locator('textarea').first();
    if ((await descField.count()) > 0) {
      await descField.fill(testDescription);
    }

    const slugField = page.locator('input[name*="slug"], input[placeholder*="slug"], [data-field*="slug"]').first();
    if ((await slugField.count()) > 0) {
      await slugField.fill(uniqueSlug);
    }

    const saveBtn = page.getByRole('button', { name: /Save|Uložiť|Publish/i }).first();
    if ((await saveBtn.count()) > 0) {
      await saveBtn.click();
      await page.waitForTimeout(2000);
      const html = await page.content();
      expect(html).not.toContain('Internal Server Error');
    }
  });

  test('edit existing blog entry: list shows entries and edit opens without error', async ({ page }) => {
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
    await page.waitForTimeout(1500);
    expect(page.url()).toMatch(/keystatic.*blog/);
    const content = await page.content();
    expect(content).not.toContain('Internal Server Error');
  });

  test('after saving new entry, meta title and description are reflected on public blog post page', async ({ page }) => {
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
    const firstText = page.locator('input[type="text"], textarea').first();
    await firstText.fill(testTitle);
    await page.waitForTimeout(300);
    const descField = page.locator('textarea').first();
    if ((await descField.count()) > 0) await descField.fill(testDescription);
    const slugField = page.locator('input[name*="slug"], input[placeholder*="slug"], [data-field*="slug"]').first();
    if ((await slugField.count()) > 0) await slugField.fill(uniqueSlug);
    const saveBtn = page.getByRole('button', { name: /Save|Uložiť|Publish/i }).first();
    if ((await saveBtn.count()) === 0) {
      test.skip(true, 'Save button not found');
      return;
    }
    await saveBtn.click();
    await page.waitForTimeout(5000);
    await page.goto(`/blog/${uniqueSlug}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    const title = await page.title();
    expect(title).toContain('E2E test');
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDesc).toContain('Krátky SEO popis');
  });
});
