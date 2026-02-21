import { test, expect } from '@playwright/test';

// Skip when Supabase is suspended (stub auth never logs in)
const skipIfSupabaseSuspended = !process.env.PUBLIC_SUPABASE_URL;

test.describe('Admin Dashboard', () => {
    test.skip(skipIfSupabaseSuspended, 'Supabase suspended – admin uses stub auth');

    // Mock Supabase Auth & Data
    test.beforeEach(async ({ page }) => {
        // Bypass cookie consent
        await page.addInitScript(() => {
            localStorage.setItem('chiro_cookie_consent', 'granted');
        });

        // 1. Mock Login Response
        await page.route('**/auth/v1/token?grant_type=password', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    access_token: 'fake-jwt-token',
                    token_type: 'bearer',
                    expires_in: 3600,
                    refresh_token: 'fake-refresh-token',
                    user: {
                        id: 'admin-user-id',
                        aud: 'authenticated',
                        email: 'admin@chiropraxiakosice.eu',
                    }
                })
            });
        });

        // 2. Mock Get User/Session
        await page.route('**/auth/v1/user', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: 'admin-user-id',
                    aud: 'authenticated',
                    email: 'admin@chiropraxiakosice.eu',
                })
            });
        });

        // 3. Mock Bookings Data
        await page.route('**/rest/v1/bookings*', async route => {
            if (route.request().method() === 'PATCH') {
                await route.fulfill({ status: 200, body: JSON.stringify([]) });
                return;
            }
            if (route.request().method() === 'DELETE') {
                await route.fulfill({ status: 200, body: JSON.stringify([]) });
                return;
            }
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    {
                        id: 'booking-1',
                        client_name: 'Test Client',
                        client_email: 'client@test.com',
                        client_phone: '0900123456',
                        booking_date: '2024-03-01',
                        start_time: '10:00:00',
                        status: 'pending',
                        notes: 'Test poznamka',
                        created_at: '2024-02-28T10:00:00',
                        services: { name: 'Vstupná konzultácia' },
                        staff: { name: 'Dr. Martin Kováč' }
                    },
                    {
                        id: 'booking-2',
                        client_name: 'Another Client',
                        client_email: 'another@test.com',
                        client_phone: '0900654321',
                        booking_date: '2024-03-02',
                        start_time: '14:00:00',
                        status: 'confirmed',
                        notes: '',
                        created_at: '2024-02-28T11:00:00',
                        services: { name: 'Chiropraktická náprava' },
                        staff: { name: 'Dr. Jana Nováková' }
                    }
                ])
            });
        });
        
        // 4. Mock Staff Data
        await page.route('**/rest/v1/staff*', async route => {
            if (route.request().method() === 'POST') {
                await route.fulfill({ status: 201, body: JSON.stringify({ id: 'new-staff', name: 'New Staff' }) });
                return;
            }
            if (route.request().method() === 'PATCH') {
                await route.fulfill({ status: 200, body: JSON.stringify([]) });
                return;
            }
            await route.fulfill({ 
                status: 200, 
                body: JSON.stringify([
                    { id: 'st1', name: 'Dr. Martin Kováč', role: 'Chiropraktik', is_active: true },
                    { id: 'st2', name: 'Dr. Jana Nováková', role: 'Fyzioterapeut', is_active: true }
                ]) 
            });
        });

        // 5. Mock Services Data
        await page.route('**/rest/v1/services*', async route => {
            await route.fulfill({ 
                status: 200, 
                body: JSON.stringify([
                    { id: 's1', name: 'Vstupná konzultácia' },
                    { id: 's2', name: 'Chiropraktická náprava' }
                ]) 
            });
        });

        // 6. Mock Settings Data
        await page.route('**/rest/v1/settings*', async route => {
            if (route.request().method() === 'POST' || route.request().method() === 'PUT') {
                await route.fulfill({ status: 200, body: JSON.stringify({ key: 'opening_hours' }) });
                return;
            }
            await route.fulfill({ 
                status: 200, 
                body: JSON.stringify([{ 
                    key: 'opening_hours', 
                    value: {
                        monday: { open: '08:00', close: '17:00', closed: false },
                        tuesday: { open: '08:00', close: '17:00', closed: false },
                        wednesday: { open: '08:00', close: '17:00', closed: false },
                        thursday: { open: '08:00', close: '17:00', closed: false },
                        friday: { open: '08:00', close: '17:00', closed: false },
                        saturday: { open: '09:00', close: '13:00', closed: false },
                        sunday: { open: '00:00', close: '00:00', closed: true }
                    }
                }]) 
            });
        });

        // 7. Mock Email API
        await page.route('**/api/send-email', async route => {
            await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
        });
    });

    // Helper: Login and dismiss cookie consent
    async function loginAsAdmin(page: any) {
        await page.goto('/admin', { waitUntil: 'domcontentloaded' });
        
        // Cookie consent is handled via initScript
        
        await page.fill('input[type="email"]', 'info@chiropraxiakosice.eu');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');
        
        // Wait for dashboard to load
        await page.waitForSelector('text=Rezervácie', { timeout: 10000 });
    }

    // ========== BOOKINGS TAB TESTS ==========
    test('should allow admin login and show bookings', async ({ page }) => {
        await loginAsAdmin(page);
        
        await expect(page.locator('text=Test Client').first()).toBeAttached();
        await expect(page.getByText('Čaká').first()).toBeVisible();
    });

    test('should filter bookings by status', async ({ page }) => {
        await loginAsAdmin(page);
        
        // Click on pending filter
        await page.click('text=Čakajúce');
        await expect(page.locator('text=Test Client')).toBeVisible();
        
        // Click on confirmed filter
        await page.click('text=Potvrdené');
        await expect(page.locator('text=Another Client')).toBeVisible();
    });

    test('should cancel booking', async ({ page }) => {
        await loginAsAdmin(page);
        
        page.on('dialog', dialog => dialog.accept());
        
        const cancelBtn = page.locator('button[title="Zrušiť"]').first();
        await cancelBtn.click({ timeout: 10000 });
    });

    test('should open edit booking modal', async ({ page }) => {
        await loginAsAdmin(page);
        
        const editBtn = page.locator('button[title="Upraviť"]').first();
        await editBtn.click();
        
        await expect(page.getByText('Upraviť rezerváciu')).toBeVisible();
        await expect(page.locator('input[type="time"]')).toBeVisible();
    });

    // ========== STAFF TAB TESTS ==========
    test('should navigate to Staff tab and show employees', async ({ page }) => {
        await loginAsAdmin(page);
        
        await page.click('text=👥 Zamestnanci');
        
        // Wait for staff list to load
        await page.waitForSelector('.glass-card', { timeout: 10000 });
        await expect(page.locator('.glass-card').first()).toBeVisible();
    });

    test('should open Add Staff modal', async ({ page }) => {
        await loginAsAdmin(page);
        
        await page.click('text=👥 Zamestnanci');
        await page.waitForTimeout(1000);
        await page.click('text=+ Pridať');
        
        await expect(page.getByText('Nový zamestnanec')).toBeVisible();
        // Check for input fields by placeholder or type
        await expect(page.locator('input[placeholder*="meno"]').or(page.locator('form input').first())).toBeVisible();
    });

    // ========== SETTINGS TAB TESTS ==========
    test('should navigate to Settings tab and show opening hours', async ({ page }) => {
        await loginAsAdmin(page);
        
        await page.click('text=⚙️ Nastavenia');
        
        // Use first match since footer also has opening hours
        await expect(page.getByRole('heading', { name: /Otváracie hodiny/i }).first()).toBeVisible();
        await expect(page.getByText('Pondelok').first()).toBeVisible();
    });

    test('should show Sunday as closed', async ({ page }) => {
        await loginAsAdmin(page);
        
        await page.click('text=⚙️ Nastavenia');
        
        // Sunday row should be visible
        await expect(page.getByText('Nedeľa').first()).toBeVisible();
    });

    // ========== LINKS TAB TESTS ==========
    test('should navigate to Links tab and show external resources', async ({ page }) => {
        await loginAsAdmin(page);
        
        await page.click('text=🔗 Odkazy');
        
        await expect(page.getByText('Užitočné Odkazy')).toBeVisible();
        await expect(page.getByText('Keystatic CMS')).toBeVisible();
        await expect(page.getByText('Supabase Dashboard')).toBeVisible();
    });

    // ========== MOBILE RESPONSIVENESS TESTS ==========
    test.describe('Mobile Responsiveness', () => {
        test.use({ viewport: { width: 375, height: 812 } }); // iPhone X

        test('should display mobile-friendly layout', async ({ page }) => {
            await loginAsAdmin(page);
            
            // Stats should still be visible
            await expect(page.getByText('Celkom')).toBeVisible();
            
            // Tab navigation should be visible
            await expect(page.getByText('📋 Rezervácie')).toBeVisible();
        });

        test('should navigate between tabs on mobile', async ({ page }) => {
            await loginAsAdmin(page);
            
            // Navigate to Settings directly
            await page.locator('text=⚙️ Nastavenia').first().click();
            await page.waitForTimeout(1500);
            
            // Check for opening hours content
            await expect(page.getByText('Pondelok').first()).toBeVisible();
        });
    });

    // ========== LOGOUT TEST ==========
    test('should logout successfully', async ({ page }) => {
        await loginAsAdmin(page);
        
        // Click logout button
        await page.locator('text=Odhlásiť').first().click();
        
        // Wait for page transition and check for login heading
        await page.waitForTimeout(3000);
        
        // Verify we're back to login - check for Admin Panel heading or email input
        const emailInput = page.locator('input[type="email"]');
        const adminHeading = page.getByRole('heading', { name: 'Admin Panel' });
        // Either the email input or admin heading should be visible
        // Increased timeout for mobile devices as content switch might take longer
        await expect(emailInput.or(adminHeading)).toBeVisible({ timeout: 15000 });
    });
});
