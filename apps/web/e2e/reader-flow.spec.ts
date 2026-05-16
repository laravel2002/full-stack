import { test, expect } from '@playwright/test';

test.describe('Reader Core Flow', () => {
  test('should load chapter and persist reading progress', async ({ page }) => {
    // Navigate to a chapter
    await page.goto('/novel/the-awakening/chapter/1');

    // Wait for the novel title to be visible
    await expect(page.locator('h1', { hasText: 'The Awakening' })).toBeVisible();

    // Scroll down slightly to trigger reading progress save
    await page.mouse.wheel(0, 1000);
    
    // Wait for the throttled progress to save (500ms throttle + some buffer)
    await page.waitForTimeout(1000);

    // Refresh the page
    await page.reload();

    // Verify that the page has restored the scroll position (not at the top)
    // We evaluate window.scrollY inside the browser
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });

  test('should persist theme and typography settings', async ({ page }) => {
    await page.goto('/novel/the-awakening/chapter/1');

    // Open settings popover
    await page.getByRole('button', { name: 'Reader settings' }).click();

    // Change Theme to Sepia
    await page.getByRole('button', { name: 'Sepia' }).click();

    // Change Font Size (simulate slider or click minus)
    const decreaseFontBtn = page.locator('div').filter({ hasText: /^Font Size18px$/ }).getByRole('button').first();
    await decreaseFontBtn.click();

    // Verify localStorage or DOM changes (e.g. sepia class on html or body)
    await expect(page.locator('html')).toHaveClass(/sepia/);

    // Refresh
    await page.reload();

    // Verify settings persist
    await expect(page.locator('html')).toHaveClass(/sepia/);
  });

  test('should navigate to next chapter', async ({ page }) => {
    await page.goto('/novel/the-awakening/chapter/1');

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Click Next Chapter
    await page.getByRole('link', { name: 'Next' }).click();

    // Verify we are on Chapter 2
    await expect(page).toHaveURL(/.*\/chapter\/2/);
    await expect(page.locator('h1', { hasText: 'The Awakening' })).toBeVisible();
    await expect(page.locator('div', { hasText: 'Chapter 2' })).toBeVisible();
  });
});
