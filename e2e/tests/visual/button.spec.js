import { test, expect } from '@playwright/test';

test.describe('Button visual', () => {
  test('primary/secondary button screenshot', async ({ page }) => {
    await page.goto('/visual/button');
    await expect(page).toHaveScreenshot('buttons.png', { fullPage: false });
  });
});