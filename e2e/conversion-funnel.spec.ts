import { test, expect } from '@playwright/test';

test.describe('Conversion Funnel & Security', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the new API endpoint
    await page.route('/api/book', async (route) => {
      const body = route.request().postDataJSON();

      // Honeypot check
      if (body.website_url) {
        return route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Honeypot triggered' }),
        });
      }

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, bookingId: 'test-123' }),
      });
    });

    await page.goto('/');
  });

  test('User can complete the full booking funnel from homepage', async ({ page }) => {
    // 1. Perspective background and AI Chat check (implicit)
    await expect(page.locator('h1')).toContainText('bolesti chrbta');

    // 2. Interaction with Booking Widget
    const widget = page.locator('.glass-card').filter({ hasText: 'Vyberte službu' });
    await widget.scrollIntoViewIfNeeded();

    // Select service
    await page.getByText('Chiropraktická masáž').first().click();

    // Select date
    await page
      .locator('button')
      .filter({ hasText: /Po|Ut|St|Št|Pi|So/ })
      .first()
      .click();

    // Select time
    await page
      .locator('button')
      .filter({ hasText: /^\d{2}:00$/ })
      .first()
      .click();

    // Fill form
    await page.getByPlaceholder('Ján Novák').fill('Test User');
    await page.getByPlaceholder('jan@example.sk').fill('test@example.sk');
    await page.getByPlaceholder('+421 905 307 198').fill('0900000000');
    await page.getByLabel(/Súhlasím so spracovaním osobných údajov/i).check();

    // Confirm step
    await page.getByRole('button', { name: 'Pokračovať' }).click();
    await expect(page.getByText('Potvrďte rezerváciu')).toBeVisible();

    // Submit
    await page.getByRole('button', { name: 'Potvrdiť rezerváciu' }).click();

    // Result
    await expect(page.getByText('Rezervácia úspešná!')).toBeVisible({ timeout: 15000 });
  });

  test('Bot is trapped by honeypot', async ({ page }) => {
    await page.goto('/rezervacia'); // Use the dedicated page for variety

    // Choosing a date and time to get to the form
    await page
      .locator('button')
      .filter({ hasText: /^\d{2}:00$/ })
      .first()
      .click();

    await page.getByPlaceholder('Ján Novák').fill('I am a bot');
    await page.getByPlaceholder('jan@example.sk').fill('bot@spam.com');
    await page.getByPlaceholder('+421 9xx xxx xxx').fill('000000000');

    // Force fill the hidden honeypot
    await page.evaluate(() => {
      const input = document.querySelector('input[name="website_url"]') as HTMLInputElement;
      if (input) {
        input.value = 'http://spam.com';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    await page.getByRole('button', { name: 'Rezervovať' }).click();

    // Should show error from API
    await expect(page.getByText('Honeypot triggered')).toBeVisible();
  });

  test('Cancellation landing page is accessible', async ({ page }) => {
    await page.goto('/rezervacia/zrusene');
    await expect(page.getByText(/Rezervácia bola úspešne zrušená/i)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Nová rezervácia' })).toBeEnabled();
  });
});
