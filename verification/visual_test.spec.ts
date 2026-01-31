import { test, expect } from '@playwright/test';

test('visual verification of dashboard layout', async ({ page }) => {
  // Go directly to dashboard (enabled via temporary public path)
  await page.goto('/#/dashboard');
  // Note: Using HashRouter, so /#/dashboard

  await page.waitForTimeout(3000); // Wait for animations

  await page.screenshot({ path: 'verification/dashboard_layout.png', fullPage: true });
});
