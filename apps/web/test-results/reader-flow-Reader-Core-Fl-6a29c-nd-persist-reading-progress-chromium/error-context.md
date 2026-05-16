# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reader-flow.spec.ts >> Reader Core Flow >> should load chapter and persist reading progress
- Location: e2e\reader-flow.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1').filter({ hasText: 'The Awakening' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1').filter({ hasText: 'The Awakening' })

```

```yaml
- link "Back":
  - /url: /
- 'heading "Chapter 1: The Storm" [level=1]'
- button "Chapter List"
- button "Toggle Bookmark"
- button "Display Settings"
- main:
  - paragraph: The rain hammered relentlessly against the grimy windowpane, each drop a tiny, frantic drumbeat against the glass. Elara sat in the dimly lit room, the glow of the holographic display casting sharp shadows across her face. She adjusted the neural link resting against her temple, ignoring the dull throb it always produced after hours of deep-dive data sifting.
  - paragraph: "\"There has to be something,\" she muttered to herself, her voice barely a whisper against the storm outside."
  - paragraph: She had been following the ghost signal for three days now. It was a chaotic, fragmented burst of code that appeared and vanished within the city's under-grid, a digital phantom that defied all tracking algorithms. Her employer, a shadowy syndicate known only as 'The Obsidian Order', was paying a small fortune for its capture. But Elara wasn't just in it for the credits. The code felt familiar, like a half-remembered dream.
  - paragraph: With a sigh, she leaned back, closing her eyes. The interface shifted, interpreting her brainwaves and displaying a sprawling, three-dimensional representation of the sector's data flows. It was a beautiful, terrifying maze of light and shadow, representing millions of lives, secrets, and transactions.
  - paragraph: Suddenly, a flicker. A disturbance in the deep net.
  - paragraph: Her eyes snapped open. It wasn't the ghost signal. It was something else. A massive, coordinated breach tearing through the Outer Sector's firewalls. The sheer volume of data being exfiltrated was staggering.
  - paragraph: Elara's fingers flew across the tactile interface, bringing up security feeds. The Outer Sector was a slum, a forgotten zone where the city's poorest lived in the shadows of the towering corporate spires. But right now, it was the epicenter of a massive cyber-attack.
  - text: End of Chapter
  - button "Next":
    - link "Next":
      - /url: /novel/the-awakening/chapter/2
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Reader Core Flow', () => {
  4  |   test('should load chapter and persist reading progress', async ({ page }) => {
  5  |     // Navigate to a chapter
  6  |     await page.goto('/novel/the-awakening/chapter/1');
  7  | 
  8  |     // Wait for the novel title to be visible
> 9  |     await expect(page.locator('h1', { hasText: 'The Awakening' })).toBeVisible();
     |                                                                    ^ Error: expect(locator).toBeVisible() failed
  10 | 
  11 |     // Scroll down slightly to trigger reading progress save
  12 |     await page.mouse.wheel(0, 1000);
  13 |     
  14 |     // Wait for the throttled progress to save (500ms throttle + some buffer)
  15 |     await page.waitForTimeout(1000);
  16 | 
  17 |     // Refresh the page
  18 |     await page.reload();
  19 | 
  20 |     // Verify that the page has restored the scroll position (not at the top)
  21 |     // We evaluate window.scrollY inside the browser
  22 |     const scrollY = await page.evaluate(() => window.scrollY);
  23 |     expect(scrollY).toBeGreaterThan(0);
  24 |   });
  25 | 
  26 |   test('should persist theme and typography settings', async ({ page }) => {
  27 |     await page.goto('/novel/the-awakening/chapter/1');
  28 | 
  29 |     // Open settings popover
  30 |     await page.getByRole('button', { name: 'Reader settings' }).click();
  31 | 
  32 |     // Change Theme to Sepia
  33 |     await page.getByRole('button', { name: 'Sepia' }).click();
  34 | 
  35 |     // Change Font Size (simulate slider or click minus)
  36 |     const decreaseFontBtn = page.locator('div').filter({ hasText: /^Font Size18px$/ }).getByRole('button').first();
  37 |     await decreaseFontBtn.click();
  38 | 
  39 |     // Verify localStorage or DOM changes (e.g. sepia class on html or body)
  40 |     await expect(page.locator('html')).toHaveClass(/sepia/);
  41 | 
  42 |     // Refresh
  43 |     await page.reload();
  44 | 
  45 |     // Verify settings persist
  46 |     await expect(page.locator('html')).toHaveClass(/sepia/);
  47 |   });
  48 | 
  49 |   test('should navigate to next chapter', async ({ page }) => {
  50 |     await page.goto('/novel/the-awakening/chapter/1');
  51 | 
  52 |     // Scroll to bottom
  53 |     await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  54 | 
  55 |     // Click Next Chapter
  56 |     await page.getByRole('link', { name: 'Next' }).click();
  57 | 
  58 |     // Verify we are on Chapter 2
  59 |     await expect(page).toHaveURL(/.*\/chapter\/2/);
  60 |     await expect(page.locator('h1', { hasText: 'The Awakening' })).toBeVisible();
  61 |     await expect(page.locator('div', { hasText: 'Chapter 2' })).toBeVisible();
  62 |   });
  63 | });
  64 | 
```