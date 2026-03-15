import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility & UI/UX', () => {
  test('homepage should not have any automatically detectable accessibility issues', async ({
    page,
  }) => {
    await page.goto('/');

    // Wait for content to allow animations to settle (if any)
    await page.waitForTimeout(1000);

    const accessibilityScanResults = await new AxeBuilder({ page })
      // Optional: Exclude certain known issues or third-party widgets if unfixable
      // .exclude('#some-element')
      .analyze();

    if (accessibilityScanResults.violations.length > 0) {
      console.log(
        'Accessibility Violations:',
        JSON.stringify(accessibilityScanResults.violations, null, 2)
      );
    }

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('booking flow page accessibility', async ({ page }) => {
    // Mock Supabase API calls to ensure content loads without real backend
    await page.route('**/rest/v1/services*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            name: 'Vstupné vyšetrenie',
            description: 'Komplexné vyšetrenie',
            duration_min: 30,
            price: 35,
            sort_order: 1,
          },
        ]),
      });
    });

    await page.route('**/rest/v1/staff*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', name: 'Dr. Test', role: 'Chiropraktor', is_active: true },
        ]),
      });
    });

    await page.goto('/rezervacia');

    // Wait for services to be rendered
    await page.waitForSelector('text=Vstupné vyšetrenie');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('visual contrast check (manual hint)', async ({ page }) => {
    await page.goto('/');

    // Check if critical elements are visible
    // Use first() or getByRole to avoid strict mode violations if multiple exist
    await expect(
      page
        .locator('h1')
        .filter({ hasText: /Zbavte sa|bolesti/i })
        .first()
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Rezervovať' }).first()).toBeVisible();
  });
});
