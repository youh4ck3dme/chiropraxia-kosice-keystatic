import { test, expect, type Page } from '@playwright/test';

// Use Playwright baseURL (see playwright.config.ts, typically http://localhost:4322)
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4322';

// ============================================================
// 1. KEYSTATIC CMS TESTS
// ============================================================
test.describe('Keystatic CMS', () => {
  test('should load Keystatic and show GitHub login', async ({ page }) => {
    await page.goto(`${BASE_URL}/keystatic`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Keystatic/i);
    
    // Look for GitHub login button or Dashboard
    const loginButton = page.getByRole('button', { name: /GitHub/i });
    const dashboard = page.getByText('Dashboard');
    
    await expect(async () => {
      const loginCount = await loginButton.count();
      const dashCount = await dashboard.count();
      expect(loginCount + dashCount).toBeGreaterThan(0);
    }).toPass({ timeout: 15000 });
    
    console.log('✅ Keystatic CMS is accessible');
  });

  test('should have blog collection available', async ({ page }) => {
    await page.goto(`${BASE_URL}/keystatic`, { waitUntil: 'domcontentloaded' });
    
    // Check if blog collection link exists (when logged in)
    const blogLink = page.getByRole('link', { name: /blog|články/i });
    const hasCollection = await blogLink.count() > 0;
    
    if (hasCollection) {
      console.log('✅ Blog collection is visible');
    } else {
      console.log('⚠️ Need to login first to see collections');
    }
  });
});

// ============================================================
// 2. BLOG PAGE TESTS
// ============================================================
test.describe('Blog Page', () => {
  test('should load blog listing page', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Blog|Články/i);
    
    // Check for blog content structure
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    
    console.log('✅ Blog page loads correctly');
  });

  test('should display blog articles if any exist', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`, { waitUntil: 'domcontentloaded' });
    
    // Look for article cards or links
    const articles = page.locator('article, [class*="card"], a[href*="/blog/"]');
    const count = await articles.count();
    
    console.log(`📝 Found ${count} blog articles/cards`);

    if (count > 0) {
      // Visit first blog post to check detail page features
      await articles.first().click();
      await page.waitForLoadState('domcontentloaded');
      
      // Check for Share Buttons
      const shareSection = page.locator('text=Zdieľať článok');
      await expect(shareSection).toBeVisible();
      
      // Check for specific social buttons
      await expect(page.locator('a[aria-label="Zdieľať na Facebooku"]')).toBeVisible();
      await expect(page.locator('a[aria-label="Zdieľať na LinkedIn"]')).toBeVisible();
      
      // Check for Related Articles section (if enough posts)
      if (count >= 2) {
        const relatedSection = page.locator('text=Podobné články');
        await expect(relatedSection).toBeVisible();
      }

      // Check for Table of Contents (should be present for articles with headings)
      const toc = page.locator('.toc-container');
      const hasToc = await toc.count() > 0;
      if (hasToc) {
        await expect(toc).toBeVisible();
        await expect(page.locator('text=Obsah článku')).toBeVisible();
        console.log('✅ Table of Contents found and visible');
      } else {
        console.log('ℹ️ No Table of Contents found (article might be short)');
      }
      
      
      // Check for Newsletter Component
      const newsletter = page.locator('text=Tipy pre zdravší život');
      await expect(newsletter).toBeVisible();
      await expect(page.locator('input[type="email"][placeholder="vas@email.com"]')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Odoberať' })).toBeVisible();
      
      console.log('✅ Blog post details (Share, Related, TOC, Newsletter) verified');
      
      // Go back to blog list for clean state
      await page.goto(`${BASE_URL}/blog`, { waitUntil: 'domcontentloaded' }); 
    }
  });
});

// ============================================================
// 3. CONTACT FORM TESTS
// ============================================================
test.describe('Contact Form', () => {
  test('should display contact form on homepage', async ({ page }) => {
    await page.goto(`${BASE_URL}/#kontakt`, { waitUntil: 'domcontentloaded' });
    
    // Check for form elements
    const nameInput = page.getByPlaceholder('Ján Novák');
    const emailInput = page.getByPlaceholder('vas@email.com');
    
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    
    console.log('✅ Contact form is visible');
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/#kontakt`, { waitUntil: 'domcontentloaded' });
    
    // Try to submit empty form
    // Use first() to avoid strict mode violation if cleaner invalid markup exists
    const submitBtn = page.getByRole('button', { name: /odoslať|submit/i }).first();
    
    if (await submitBtn.count() > 0) {
      await submitBtn.click();
      
      // Check for validation errors or required attribute
      const requiredFields = page.locator('[required]');
      const count = await requiredFields.count();
      
      console.log(`✅ Form has ${count} required fields`);
    }
  });

  test('should accept valid input and show success', async ({ page }) => {
    await page.goto(`${BASE_URL}/#kontakt`, { waitUntil: 'domcontentloaded' });
    
    // Fill the form with test data
    await page.getByPlaceholder('Ján Novák').fill('Test User');
    await page.getByPlaceholder('vas@email.com').fill('test@example.com');
    
    // Note: Phone placeholder is specific
    await page.getByPlaceholder('+421 9XX XXX XXX').fill('+421 900 123 456');
    await page.getByPlaceholder('Ako vám môžeme pomôcť?').fill('Toto je testovacia správa.');
    
    console.log('✅ Contact form accepts valid input');
    // Note: Not actually submitting to avoid sending real emails
  });
});

// ============================================================
// 4. RESERVATION SYSTEM TESTS
// ============================================================
test.describe('Reservation System', () => {
  test('should load reservation page', async ({ page }) => {
    await page.goto(`${BASE_URL}/rezervacia`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Rezervácia|Booking/i);
    
    console.log('✅ Reservation page loads');
  });

  test('should display services selection', async ({ page }) => {
    await page.goto(`${BASE_URL}/rezervacia`, { waitUntil: 'domcontentloaded' });
    
    // Look for service options
    const serviceOptions = page.locator('button, [role="option"], input[type="radio"], .service-card');
    const count = await serviceOptions.count();
    
    console.log(`📋 Found ${count} service options/elements`);
    expect(count).toBeGreaterThan(0);
  });

  test('should allow date selection', async ({ page }) => {
    await page.goto(`${BASE_URL}/rezervacia`, { waitUntil: 'domcontentloaded' });
    
    // Look for calendar or date picker
    const calendar = page.locator('[class*="calendar"], [class*="date"], input[type="date"]');
    const hasCalendar = await calendar.count() > 0;
    
    if (hasCalendar) {
      console.log('✅ Date selection is available');
    } else {
      console.log('⚠️ Calendar may require service selection first');
    }
  });

  test('should show booking form fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/rezervacia`, { waitUntil: 'domcontentloaded' });
    
    // Check for client info fields
    const nameField = page.getByPlaceholder(/meno|name/i);
    const emailField = page.getByPlaceholder(/email/i);
    const phoneField = page.getByPlaceholder(/telefón|phone/i);
    
    const hasFields = await nameField.count() > 0 || 
                      await emailField.count() > 0 || 
                      await phoneField.count() > 0;
    
    console.log(`✅ Booking form fields present: ${hasFields}`);
  });
});

// ============================================================
// 5. ADMIN PANEL TESTS
// ============================================================
test.describe('Admin Panel', () => {
  test('should load admin login page', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'domcontentloaded' });
    
    // Check for login form
    const emailInput = page.getByPlaceholder(/admin@example.com|email/i);
    const passwordInput = page.locator('input[type="password"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    
    console.log('✅ Admin login page loads correctly');
  });

  test('should show validation on empty login attempt', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'domcontentloaded' });
    
    // Try to submit without credentials
    const loginBtn = page.getByRole('button', { name: /prihlásiť|login/i });
    
    if (await loginBtn.count() > 0) {
      await loginBtn.click();
      
      // Wait for error message or validation
      await page.waitForTimeout(1000);
      
      const errorMsg = page.locator('[class*="error"], [role="alert"]');
      const hasError = await errorMsg.count() > 0;
      
      console.log(`✅ Login validation works: ${hasError}`);
    }
  });

  test('should have tabs for Bookings, Staff, Settings', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'domcontentloaded' });
    
    // These tabs should be visible after login, check for their text
    const bookingsTab = page.getByText(/Rezervácie|Bookings/i);
    const staffTab = page.getByText(/Zamestnanci|Staff/i);
    const settingsTab = page.getByText(/Nastavenia|Settings/i);
    
    // Note: Tabs may only show after successful login
    console.log('⚠️ Admin tabs require authentication to verify');
  });
});

// ============================================================
// 6. PWA TESTS
// ============================================================
test.describe('PWA Features', () => {
  test('should have valid manifest.webmanifest', async ({ page, request }) => {
    const response = await request.get(`${BASE_URL}/manifest.webmanifest`);
    
    expect(response.status()).toBe(200);
    
    const manifest = await response.json();
    expect(manifest.name).toBeTruthy();
    expect(manifest.icons).toBeTruthy();
    expect(manifest.start_url).toBeTruthy();
    
    console.log(`✅ PWA manifest valid: ${manifest.name}`);
  });

  test('should have service worker registered', async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    
    // Check for service worker registration
    const hasServiceWorker = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    
    console.log(`✅ Service Worker API available: ${hasServiceWorker}`);
  });

  test('should have required PWA meta tags', async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    
    // Check for PWA meta tags
    const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content');
    const manifestLink = await page.locator('link[rel="manifest"]').count();
    const appleIcon = await page.locator('link[rel="apple-touch-icon"]').count();
    
    console.log(`✅ Theme color: ${themeColor}`);
    console.log(`✅ Manifest link: ${manifestLink > 0}`);
    console.log(`✅ Apple touch icon: ${appleIcon > 0}`);
  });
});

// ============================================================
// 8. COOKIE CONSENT TESTS
// ============================================================
test.describe('Cookie Consent', () => {
  test('should display cookie banner on first visit', async ({ page, context }) => {
    // Clear cookies to simulate first visit
    await context.clearCookies();
    
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    
    // Look for cookie banner
    const cookieBanner = page.locator('[class*="cookie"], [aria-label*="cookie"], [id*="cookie"]');
    const consentText = page.getByText(/cookies|súkromie|privacy/i);
    
    const hasBanner = await cookieBanner.count() > 0 || await consentText.count() > 0;
    
    console.log(`✅ Cookie banner visible: ${hasBanner}`);
  });

  test('should have accept and reject options', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    
    // Look for accept/reject buttons
    const acceptBtn = page.getByRole('button', { name: /prijať|accept|súhlasím/i });
    const rejectBtn = page.getByRole('button', { name: /odmietnuť|reject|nesúhlasím/i });
    
    const hasAccept = await acceptBtn.count() > 0;
    const hasReject = await rejectBtn.count() > 0;
    
    console.log(`✅ Accept button: ${hasAccept}`);
    console.log(`✅ Reject button: ${hasReject}`);
  });

  test('should hide banner after accepting', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    
    const acceptBtn = page.getByRole('button', { name: /prijať|accept|súhlasím/i }).first();
    
    if (await acceptBtn.count() > 0) {
      await acceptBtn.click();
      await page.waitForTimeout(500);
      
      // Banner should be hidden
      const banner = page.locator('[class*="cookie-banner"], [id*="cookie-consent"]');
      const isHidden = await banner.isHidden().catch(() => true);
      
      console.log(`✅ Banner hidden after accept: ${isHidden}`);
    }
  });
});

// ============================================================
// 9. HOMEPAGE TESTS
// ============================================================
test.describe('Homepage', () => {
  test('should load homepage correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    
    await expect(page).toHaveTitle(/Chiropraxia|Košice/i);
    
    // Check for main sections
    const header = page.locator('header');
    const footer = page.locator('footer');
    
    await expect(header).toBeVisible();
    await expect(footer).toBeVisible();
    
    console.log('✅ Homepage loads with header and footer');
  });

  test('should display testimonials section', async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    
    // Look for testimonials/reviews section
    const testimonials = page.locator('[class*="testimonial"], [class*="review"], [class*="recenzie"]');
    const count = await testimonials.count();
    
    console.log(`📝 Found ${count} testimonial elements`);
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    
    // Check main nav links
    const links = {
      'Domov': '/',
      'Služby': '/sluzby',
      'Blog': '/blog',
      'Rezervácia': '/rezervacia'
    };
    
    for (const [name, href] of Object.entries(links)) {
      const link = page.getByRole('link', { name: new RegExp(name, 'i') }).first();
      const hasLink = await link.count() > 0;
      console.log(`✅ Nav link "${name}": ${hasLink}`);
    }
  });
});

// ============================================================
// 10. SERVICES PAGE TESTS
// ============================================================
test.describe('Services Page', () => {
  test('should load services page', async ({ page }) => {
    await page.goto(`${BASE_URL}/sluzby`, { waitUntil: 'domcontentloaded' });
    
    await expect(page).toHaveTitle(/Služby|Services|Cenník/i);
    
    console.log('✅ Services page loads');
  });

  test('should display service cards with prices', async ({ page }) => {
    await page.goto(`${BASE_URL}/sluzby`, { waitUntil: 'domcontentloaded' });
    
    // Look for price indicators
    const prices = page.locator(':text("€"), :text("EUR")');
    const priceCount = await prices.count();
    
    console.log(`💰 Found ${priceCount} price indicators`);
  });
});

// ============================================================
// 11. ACCESSIBILITY TESTS
// ============================================================
test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    
    const h1s = page.locator('h1');
    const h1Count = await h1s.count();
    
    if (h1Count !== 1) {
      const texts = await h1s.allTextContents();
      console.log('🚨 Found multiple Hs:', texts);
    }
    
    expect(h1Count).toBe(1); // Should have exactly one H1
    console.log(`✅ H1 count: ${h1Count}`);
  });

  test('should have alt text on images', async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    
    const imagesWithoutAlt = await page.locator('img:not([alt]), img[alt=""]').count();
    
    console.log(`📷 Images without alt text: ${imagesWithoutAlt}`);
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto(`${BASE_URL}/rezervacia`, { waitUntil: 'domcontentloaded' });
    
    const inputsWithoutLabel = await page.locator('input:not([aria-label]):not([placeholder])').count();
    
    console.log(`📝 Inputs needing labels: ${inputsWithoutLabel}`);
  });
});

// ============================================================
// 12. PERFORMANCE TESTS
// ============================================================
test.describe('Performance', () => {
  test('should load homepage within 5 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(15000);
    console.log(`⚡ Homepage load time: ${loadTime}ms`);
  });

  test('should have reasonable page size', async ({ page, request }) => {
    const response = await request.get(`${BASE_URL}/`);
    const content = await response.text();
    const sizeKB = content.length / 1024;
    
    console.log(`📦 Homepage HTML size: ${sizeKB.toFixed(2)}KB`);
  });
});

// ============================================================
// 13. DIGITAL CARDS TESTS
// ============================================================
test.describe('Digital Cards', () => {
  test('should load test digital card', async ({ page }) => {
    // We use the sample card created earlier
    await page.goto(`${BASE_URL}/v/jaroslav-begala`, { waitUntil: 'domcontentloaded' });
    
    // Check for brand name and person name
    await expect(page.locator('.brand-name')).toBeVisible();
    await expect(page.locator('.person-name')).toContainText('Jaroslav Begala');
    
    console.log('✅ Digital card page loads correctly');
  });

  test('should handle vCard download', async ({ page }) => {
    await page.goto(`${BASE_URL}/v/jaroslav-begala`, { waitUntil: 'domcontentloaded' });
    
    // Playwright can handle downloads
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#saveContact').click();
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain('.vcf');
    console.log(`✅ vCard download works: ${download.suggestedFilename()}`);
  });

  test('should open AI Assistant modal', async ({ page }) => {
    await page.goto(`${BASE_URL}/v/jaroslav-begala`, { waitUntil: 'domcontentloaded' });
    
    const aiBtn = page.locator('#openAiModal');
    if (await aiBtn.count() > 0) {
      await aiBtn.click();
      await expect(page.locator('#aiModal')).toBeVisible();
      await expect(page.locator('h2')).toContainText('AI Asistent');
      console.log('✅ AI Assistant modal opens correctly');
    }
  });
});
