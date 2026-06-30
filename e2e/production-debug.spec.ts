// cspell:words Keystatic domcontentloaded
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.chiropraxiakosice.eu';

test.describe('Production Debug Suite', () => {
  // 1. Test Keystatic Availability
  test('Keystatic should load and show GitHub login button', async ({ page }) => {
    console.log('Testing Keystatic URL...');
    const response = await page.goto(`${BASE_URL}/keystatic`, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBeLessThan(500);
    await expect(page).toHaveURL(/\/keystatic/);

    // Wait for either the login button or dashboard
    const loginButton = page.getByRole('button', { name: /GitHub/i });
    const loginLink = page.getByRole('link', { name: /GitHub/i });
    const dashboard = page.getByText('Dashboard');

    // We expect at least one of these to be visible after some time
    await expect(async () => {
      const loginCount = await loginButton.count();
      const loginLinkCount = await loginLink.count();
      const dashCount = await dashboard.count();
      expect(loginCount + loginLinkCount + dashCount).toBeGreaterThan(0);
    }).toPass({ timeout: 15000 });

    if ((await loginButton.count()) > 0 || (await loginLink.count()) > 0) {
      console.log('✅ Keystatic Login page loaded, GitHub button found.');
    } else {
      console.log('✅ Already logged in to Keystatic.');
    }
  });

  // 2. Test Staff Management (simulated)
  // We need credentials for this. Skipping actual login if credentials aren't provided,
  // but checking if /admin loads the login form.
  test('Admin page should load login form', async ({ page }) => {
    console.log('Testing Admin URL...');
    await page.goto(`${BASE_URL}/admin`);
<<<<<<< HEAD

    // Check for email/password inputs (AdminDashboard uses info@chiropraxiakosice.eu + ••••••••)
    await expect(
      page
        .getByPlaceholder(/@.*\.(eu|com|sk)/i)
        .or(page.getByRole('textbox', { name: /e-mail|email/i }))
    ).toBeVisible({ timeout: 15000 });
=======
    
    // Check for email/password inputs (AdminDashboard uses booking@fyzioafit.sk + ••••••••)
    await expect(page.getByPlaceholder(/@.*\.(eu|com|sk)/i).or(page.getByRole('textbox', { name: /e-mail|email/i }))).toBeVisible({ timeout: 15000 });
>>>>>>> origin/main
    await expect(page.getByPlaceholder(/••••••••/i)).toBeVisible({ timeout: 5000 });
    console.log('✅ Admin login form is visible.');
  });

  // 3. Test API Endpoint for Keystatic
  test('Keystatic API endpoint should return 404 or redirect, not 500', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/keystatic/github/login`);
    console.log(`API Response status: ${response.status()}`);
    // It should be a redirect (307/302) or 200, but definitely not 500
    expect(response.status()).not.toBe(500);
  });
});
