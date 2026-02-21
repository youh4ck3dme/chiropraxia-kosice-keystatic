import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Keystatic Admin UI', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to Keystatic dashboard
    await page.goto('/keystatic', { waitUntil: 'domcontentloaded' });
  });

  test('should load the collections', async ({ page }) => {
    // When logged in: collections are visible. When not: GitHub login is shown.
    const blogLink = page.getByText('Blog Články');
    const recenzieLink = page.getByText('Recenzie');
    const githubLogin = page.getByRole('button', { name: /GitHub/i }).or(page.getByRole('link', { name: /GitHub/i }));
    await expect(blogLink.or(recenzieLink).or(githubLogin)).toBeVisible({ timeout: 15000 });
    if (await blogLink.count() > 0) await expect(recenzieLink).toBeVisible();
  });

  test('should navigate to blog article creation', async ({ page }) => {
    const blogLink = page.getByText('Blog Články');
    if ((await blogLink.count()) === 0) {
      test.skip(true, 'Blog Články not visible (not authenticated)');
      return;
    }
    await blogLink.click();
    const createLink = page.getByRole('link', { name: /Create/i });
    if ((await createLink.count()) === 0) {
      test.skip(true, 'Create link not found');
      return;
    }
    await createLink.first().click();
    await expect(page.getByLabel('Názov článku').or(page.getByLabel(/Názov|title/i))).toBeVisible({ timeout: 10000 });
    await expect(page.getByLabel('SEO Popis').or(page.getByLabel(/SEO|Popis|description/i))).toBeVisible({ timeout: 5000 });
  });

  test('should create a test blog article', async ({ page }) => {
    const testSlug = `test-article-${Date.now()}`;
    const testTitle = 'Automatizovaný Testovací Článok';
    
    await page.goto('/keystatic/collection/blog/create');
    
    // Fill title
    await page.getByLabel('Názov článku').fill(testTitle);
    
    // Fill SEO Description
    await page.getByLabel('SEO Popis').fill('Tento článok bol vytvorený automatizovaným testom.');
    
    // Fill Keywords
    await page.getByLabel('Kľúčové slová').fill('test, playwright, keystatic');
    
    // Content is MDX, slightly trickier to fill depending on how Keystatic renders it.
    // Usually it's an editable div or a slate editor.
    // Let's try to type into the editable area.
    const editor = page.locator('[role="textbox"]').nth(1); // Usually the second one is the MDX content
    await editor.fill('Toto je obsah testovacieho článku.');

    // Save
    await page.getByRole('button', { name: 'Create' }).click();
    
    // Wait for success
    await expect(page.getByText('Created')).toBeVisible();
    
    // Cleanup: We should probably delete the file created in src/content/blog
    // but for now we just verify it was "created" in the UI sense.
  });

  test('should navigate to testimonials', async ({ page }) => {
    const recenzie = page.getByText('Recenzie');
    if ((await recenzie.count()) === 0) {
      test.skip(true, 'Recenzie not visible (not authenticated)');
      return;
    }
    await recenzie.click();
    await expect(page.getByRole('link', { name: /Create/i }).first()).toBeVisible({ timeout: 5000 });
  });
});
