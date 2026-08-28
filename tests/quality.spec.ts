import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const [route, title] of [
  ['/', 'Onion Next Frame — Compare animation frames'],
  ['/demo', 'Demo — Onion Next Frame'],
  ['/privacy', 'Privacy — Onion Next Frame'],
  ['/terms', 'Terms — Onion Next Frame'],
  ['/not-a-frame', 'Missing frame — Onion Next Frame']
] as const) {
  test(`${route} has its own title, one h1, and no serious accessibility findings`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('history, keyboard frame controls, and focus all work', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Demo', exact: true }).first().click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.locator('h1')).toBeFocused();
  await page.locator('main').click({ position: { x: 2, y: 2 } });
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#current-counter')).toHaveText('FRAME 04 / 06');
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
});

test('the workbench fits a 390px phone without horizontal scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await expect(page.getByRole('button', { name: /Export contact sheet/ })).toBeVisible();
});

test('metadata, manifest, and original social image are reachable', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /previous and next/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://onion-next-frame.sociobot.in/');
  for (const path of ['/manifest.webmanifest', '/assets/onion-next-frame-og.webp', '/robots.txt', '/sitemap.xml']) {
    expect((await request.get(path)).ok()).toBeTruthy();
  }
});
