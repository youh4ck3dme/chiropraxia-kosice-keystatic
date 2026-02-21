import { test, expect, Page, Route } from '@playwright/test';

test.describe('Booking Flow UI/UX', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Mock Supabase API responses to ensure stable UI testing
    // 1. Mock GET Services
    await page.route('**/rest/v1/services*', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'service-1',
            name: 'Vstupná konzultácia',
            duration_min: 30,
            price: 50,
            description: 'Komplexné vyšetrenie'
          }
        ])
      });
    });

    // 2. Mock GET Staff
    await page.route('**/rest/v1/staff*', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'staff-1',
            name: 'Dr. Martin Kováč',
            role: 'Chiropraktik'
          }
        ])
      });
    });

    // 3. Mock RPC get_available_slots
    await page.route('**/rest/v1/rpc/get_available_slots', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            slot_time: '10:00:00',
            slot_end_time: '10:30:00',
            staff_id: 'staff-1',
            staff_name: 'Dr. Martin Kováč'
          },
          {
            slot_time: '14:00:00',
            slot_end_time: '14:30:00',
            staff_id: 'staff-1',
            staff_name: 'Dr. Martin Kováč'
          }
        ])
      });
    });

    // 4. Mock RPC create_booking (The submission)
    await page.route('**/rest/v1/rpc/create_booking', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify('booking-uuid-123') // Returns the new booking ID
      });
    });

    // 5. Mock Email API
    await page.route('**/api/send-email', async (route: Route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    // Freeze time to 2024-03-01 08:00:00 to ensure 10:00 slot is in the future
    await page.clock.install({ time: new Date('2024-03-01T08:00:00') });

    await page.goto('/rezervacia');
  });

  test('Complete booking journey (Happy Path)', async ({ page }: { page: Page }) => {
    console.log('Starting Happy Path test...');
    // Step 1: Service Selection
    // Wait for the heading to be visible (handles the initial isLoading state)
    await expect(page.getByRole('heading', { name: /Vyberte( si)? službu/i })).toBeVisible({ timeout: 10000 });
    console.log('Step 1: Services visible');
    await page.getByText('Vstupná konzultácia').first().click();
    console.log('Step 2: Service clicked');
    
    // Step 2: Date & Time Selection (Skipping Staff Selection as it's not in the flow)
    await expect(page.getByRole('heading', { name: /Vyberte termín/i })).toBeVisible();
    console.log('Step 3: Calendar visible');
    // Ensure date selection is visible
    await expect(page.getByText('Dátum', { exact: true })).toBeVisible();
    
    // Select first available date button
    // The buttons contain formatted dates like "Po 2. mar."
    console.log('Step 3.5: Selecting a date');
    const firstDateBtn = page.locator('button').filter({ has: page.locator('span') }).nth(1); // nth(0) might be the 'Back' button, let's be careful.
    // Actually, let's find buttons inside the container.
    await page.locator('div.flex.gap-2.overflow-x-auto button').first().click();
    
    // Click a time slot (mocked at 10:00)
    const slotBtn = page.getByRole('button', { name: '10:00' });
    await expect(slotBtn).toBeVisible();
    await slotBtn.click();
    console.log('Step 4: Slot clicked');
    
    // Step 4: Client Details Form
    await expect(page.locator('h2')).toContainText('Vaše údaje');
    console.log('Step 4: Form visible');
    await page.locator('input[name="name"]').fill('Jozef Tester');
    await page.locator('input[name="email"]').fill('jozef@example.com');
    await page.locator('input[name="phone"]').fill('+421948123456');
    
    // GDPR Consent
    await page.getByLabel(/Súhlasím so spracovaním osobných údajov/i).check();
    
    // Submit
    const submitBtn = page.getByRole('button', { name: 'Potvrdiť rezerváciu' });
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();
    console.log('Step 5: Submitted');
    
    // Step 5: Success State
    await expect(page.getByText('Rezervácia úspešná!')).toBeVisible({ timeout: 10000 });
    console.log('Test Complete: Success message seen');
    await expect(page.getByText('Potvrdenie sme poslali na email')).toBeVisible();
  });

  test('Validation errors (Missing required fields)', async ({ page }: { page: Page }) => {
    // Fast forward to form
    // Choose service
    await page.getByText('Vstupná konzultácia').first().click();
    
    // Select date first
    await page.locator('div.flex.gap-2.overflow-x-auto button').first().click();
    
    // Click slot
    await page.getByRole('button', { name: '10:00' }).click();
    
    // Try to submit without filling anything
    await page.getByRole('button', { name: 'Potvrdiť rezerváciu' }).click();
    
    // HTML5 native validation or custom validation check
    // Assuming browser validation prevents submission, or we check for specific error UI
    // In this specific component, the button might be disabled or simple no-op. 
    // Let's check if we remain on the same step (Form is still visible)
    await expect(page.locator('input[name="name"]')).toBeVisible(); 
  });
});
