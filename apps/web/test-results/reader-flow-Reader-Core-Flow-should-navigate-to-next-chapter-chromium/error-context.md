# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reader-flow.spec.ts >> Reader Core Flow >> should navigate to next chapter
- Location: e2e\reader-flow.spec.ts:49:7

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
- alert: "Reading | Chapter 2: The Breach"
- link "Back":
  - /url: /
- 'heading "Chapter 2: The Breach" [level=1]'
- button "Chapter List"
- button "Toggle Bookmark"
- button "Display Settings"
- main:
  - paragraph: "\"What are they after?\" she wondered, a cold knot of dread tightening in her stomach."
  - paragraph: The feeds showed chaotic scenes. Automated defense drones were spinning wildly out of control, targeting civilian structures. The local enforcer units were paralyzed, their systems locked down by the unknown attackers.
  - paragraph: She had a choice. Ignore it, focus on her highly paid contract, or intervene. It wasn't her sector. It wasn't her problem. But as she watched the feeds, she saw a child crying in the street, an automated drone hovering menacingly above him.
  - paragraph: Elara cursed softly. "Alright," she said, her voice hard. "Let's see what you've got."
  - paragraph: She shifted her focus, diving headfirst into the chaotic data stream. The interface dissolved around her, replaced by a swirling vortex of code and light. She was no longer sitting in her grimy apartment; she was a digital entity, slicing through firewalls and bypassing security protocols with practiced ease.
  - paragraph: The attackers were good, their code elegant and brutal. But Elara was better. She was a legend in the under-grid, a phantom hacker known as 'Cipher'. And right now, she was pissed off.
  - paragraph: She deployed counter-measures, a series of viral algorithms designed to disrupt the attackers' command and control structures. It was a risky move, one that could expose her own position, but she didn't care.
  - paragraph: The impact was immediate. The attackers' code shuddered, their exfiltration stalling. The automated drones in the Outer Sector hesitated, their targeting systems confused by the sudden influx of junk data.
  - text: End of Chapter
  - button "Previous":
    - link "Previous":
      - /url: /novel/the-awakening/chapter/1
  - button "Next":
    - link "Next":
      - /url: /novel/the-awakening/chapter/3
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
  9  |     await expect(page.locator('h1', { hasText: 'The Awakening' })).toBeVisible();
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
> 60 |     await expect(page.locator('h1', { hasText: 'The Awakening' })).toBeVisible();
     |                                                                    ^ Error: expect(locator).toBeVisible() failed
  61 |     await expect(page.locator('div', { hasText: 'Chapter 2' })).toBeVisible();
  62 |   });
  63 | });
  64 | 
```