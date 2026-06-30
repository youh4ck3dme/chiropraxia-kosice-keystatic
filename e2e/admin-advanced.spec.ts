import { test, expect } from '@playwright/test';

test.describe('Admin Advanced & Security', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('chiro_cookie_consent', 'granted');
    });

    // Mock Supabase Auth
    await page.route('**/auth/v1/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-admin-id',
          aud: 'authenticated',
          role: 'authenticated',
          email: 'info@chiropraxiakosice.eu',
          app_metadata: { provider: 'email' },
          user_metadata: {},
          created_at: new Date().toISOString(),
        }),
      });
    });
  });

  test.describe('Security', () => {
    test('should redirect unauthenticated users to login', async ({ page }) => {
      // Mock unauthenticated
      await page.route('**/auth/v1/user', async (route) => {
        await route.fulfill({ status: 401, body: JSON.stringify({ error: 'unauthorized' }) });
      });
      await page.goto('/admin');
      await expect(page.locator('input[type="email"]')).toBeVisible(); // Should show login form
    });
  });

  test.describe('Settings Validation', () => {
    test.beforeEach(async ({ page }) => {
<<<<<<< HEAD
      await page.goto('/admin');
      await page.fill('input[type="email"]', 'info@chiropraxiakosice.eu');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.click('text=⚙️ Nastavenia');
=======
        await page.addInitScript(() => {
            localStorage.setItem('chiro_cookie_consent', 'granted');
        });
        
        // Mock Supabase Auth
         await page.route('**/auth/v1/user', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: 'test-admin-id',
                    aud: 'authenticated',
                    role: 'authenticated',
                    email: 'booking@fyzioafit.sk',
                    app_metadata: { provider: 'email' },
                    user_metadata: {},
                    created_at: new Date().toISOString()
                })
            });
        });
>>>>>>> origin/main
    });

    test('should save valid settings', async ({ page }) => {
      // Mock settings save
      await page.route('**/rest/v1/settings*', async (route) => {
        if (route.request().method() === 'POST' || route.request().method() === 'PATCH') {
          await route.fulfill({ status: 200, body: JSON.stringify([]) });
        } else {
          await route.continue();
        }
      });

      await page.click('button:has-text("Uložiť nastavenia")');
      // Expect alert or visual confirmation
      // Since we use window.alert, we should handle dialog
      page.on('dialog', (dialog) => dialog.accept());
    });
  });

  test.describe('Staff Management Edge Cases', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin');
      await page.fill('input[type="email"]', 'info@chiropraxiakosice.eu');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.click('text=👥 Zamestnanci');
    });

<<<<<<< HEAD
    test('should not add staff with empty name', async ({ page }) => {
      await page.click('text=Pridať zamestnanca');
      await page.click('button:has-text("Uložiť")');
      // Browser validation prevents submission if required
      // We can check if modal is still open or error message
      await expect(page.locator('text=Pridať zamestnanca')).toBeVisible(); // Modal title still visible
=======
    test.describe('Settings Validation', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/admin');
            await page.fill('input[type="email"]', 'booking@fyzioafit.sk');
            await page.fill('input[type="password"]', 'admin123');
            await page.click('button[type="submit"]');
            await page.click('text=⚙️ Nastavenia');
        });

        test('should save valid settings', async ({ page }) => {
             // Mock settings save
             await page.route('**/rest/v1/settings*', async route => {
                if(route.request().method() === 'POST' || route.request().method() === 'PATCH') {
                     await route.fulfill({ status: 200, body: JSON.stringify([]) });
                } else {
                     await route.continue();
                }
             });
             
             await page.click('button:has-text("Uložiť nastavenia")');
             // Expect alert or visual confirmation
             // Since we use window.alert, we should handle dialog
             page.on('dialog', dialog => dialog.accept());
        });
    });

    test.describe('Staff Management Edge Cases', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/admin');
            await page.fill('input[type="email"]', 'booking@fyzioafit.sk');
            await page.fill('input[type="password"]', 'admin123');
            await page.click('button[type="submit"]');
            await page.click('text=👥 Zamestnanci');
        });

        test('should not add staff with empty name', async ({ page }) => {
            await page.click('text=Pridať zamestnanca');
            await page.click('button:has-text("Uložiť")'); 
            // Browser validation prevents submission if required
            // We can check if modal is still open or error message
            await expect(page.locator('text=Pridať zamestnanca')).toBeVisible(); // Modal title still visible
        });
>>>>>>> origin/main
    });
  });
});
