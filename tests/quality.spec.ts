import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

for (const [route, title] of [
  ['/', 'Onion Next Frame — Compare animation frames'],
  ['/?demo=1', 'Demo — Onion Next Frame'],
  ['/demo', 'Demo — Onion Next Frame'],
  ['/privacy', 'Privacy — Onion Next Frame'],
  ['/terms', 'Terms — Onion Next Frame'],
  ['/not-a-frame', 'Missing frame — Onion Next Frame']
] as const) {
  test(`${route} has its own title, one h1, and no serious accessibility findings`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(route);
    if (route === '/not-a-frame') expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
    // Chromium reports the intentionally non-2xx main document as a console
    // error. Keep that browser diagnostic separate from application errors.
    const applicationErrors = route === '/not-a-frame'
      ? errors.filter((message) => !message.includes('server responded with a status of 404'))
      : errors;
    expect(applicationErrors).toEqual([]);
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

test('the first-screen sample action opens the isolated query-string demo in one click', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.locator('h1')).toBeFocused();
});

test('the workbench fits a 390px phone without horizontal scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await expect(page.getByRole('button', { name: /Export contact sheet/ })).toBeVisible();
});

test('every visible landing-page link and button has a 44px touch target at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const undersized = await page.locator('a, button:not(:disabled)').evaluateAll((elements) => elements.flatMap((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const isVisible = style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
    return isVisible && (rect.width < 44 || rect.height < 44)
      ? [{ name: element.textContent?.trim() || element.getAttribute('aria-label'), width: rect.width, height: rect.height }]
      : [];
  }));

  expect(undersized).toEqual([]);
});

test('every enabled demo control, including all layer inputs, has a 44px touch target at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');

  const undersized = await page.locator('a[href], button:not(:disabled), input:not(:disabled):not(.sr-only)').evaluateAll((elements) =>
    elements.flatMap((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const isVisible = style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
      return isVisible && (rect.width < 44 || rect.height < 44)
        ? [{ tag: element.tagName, name: element.getAttribute('aria-label') ?? element.textContent?.trim(), type: element.getAttribute('type'), width: rect.width, height: rect.height }]
        : [];
    })
  );

  expect(undersized).toEqual([]);
  const opacityBoxes = await page.locator('[data-layer] input[data-field="opacity"]').evaluateAll((inputs) => inputs.map((input) => {
    const rect = input.getBoundingClientRect();
    return { layer: input.closest('[data-layer]')?.getAttribute('data-layer'), width: rect.width, height: rect.height };
  }));
  expect(opacityBoxes).toEqual([
    { layer: 'previous', width: expect.any(Number), height: expect.any(Number) },
    { layer: 'current', width: expect.any(Number), height: expect.any(Number) },
    { layer: 'next', width: expect.any(Number), height: expect.any(Number) }
  ]);
  expect(opacityBoxes.every(({ width, height }) => width >= 44 && height >= 44)).toBeTruthy();
});

test('unknown document routes return the designed page with a real HTTP 404', async ({ page, request }) => {
  for (const path of ['/definitely-missing', '/definitely-missing.html']) {
    const response = await request.get(path, { headers: { Accept: 'text/html' } });
    expect(response.status()).toBe(404);
  }
  const response = await page.goto('/definitely-missing');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Missing frame — Onion Next Frame');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This frame is missing.');

  const deployedConfig = JSON.parse(await readFile('public/staticwebapp.config.json', 'utf8')) as {
    navigationFallback?: unknown;
    responseOverrides: { '404': { rewrite: string } };
  };
  expect(deployedConfig.navigationFallback).toBeUndefined();
  expect(deployedConfig.responseOverrides['404'].rewrite).toBe('/404.html');
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

test('route metadata updates with client-side navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await expect(page).toHaveTitle('Privacy — Onion Next Frame');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://onion-next-frame.sociobot.in/privacy');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Privacy — Onion Next Frame');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://onion-next-frame.sociobot.in/privacy');
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', 'Privacy — Onion Next Frame');
});

test('strict CSP loads only same-origin emitted font assets without console errors', async ({ page }) => {
  const errors: string[] = [];
  const fontRequests: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('request', (request) => {
    if (request.resourceType() === 'font') fontRequests.push(request.url());
  });

  const response = await page.goto('/');
  await page.evaluate(async () => { await document.fonts.ready; });

  const deployedConfig = JSON.parse(await readFile('public/staticwebapp.config.json', 'utf8')) as {
    globalHeaders: { 'Content-Security-Policy': string };
  };
  const policy = deployedConfig.globalHeaders['Content-Security-Policy'];
  expect(policy).toContain("font-src 'self'");
  expect(response?.headers()['content-security-policy']).toBe(policy);
  expect(fontRequests).not.toHaveLength(0);
  const pageOrigin = new URL(page.url()).origin;
  expect(fontRequests.every((url) => new URL(url).origin === pageOrigin)).toBeTruthy();
  expect(fontRequests.every((url) => !url.startsWith('data:'))).toBeTruthy();
  expect(errors).toEqual([]);
});

test('hashed production assets have long-lived immutable caching', async ({ page, request }) => {
  await page.goto('/');
  const assetPaths = await page.locator('script[type="module"][src], link[rel="stylesheet"][href]').evaluateAll((elements) =>
    elements.map((element) => {
      const attribute = element instanceof HTMLScriptElement ? 'src' : 'href';
      return new URL(element.getAttribute(attribute) ?? '', location.href).pathname;
    })
  );

  expect(assetPaths).toHaveLength(2);
  for (const assetPath of assetPaths) {
    expect(assetPath).toMatch(/^\/assets\/.+-[A-Za-z0-9_-]{8,}\.(?:js|css)$/);
    const response = await request.get(assetPath);
    expect(response.ok()).toBeTruthy();
    const cacheControl = response.headers()['cache-control'] ?? '';
    const maxAge = Number(cacheControl.match(/max-age=(\d+)/)?.[1] ?? 0);
    expect(cacheControl).toContain('public');
    expect(cacheControl).toContain('immutable');
    expect(cacheControl).not.toContain('must-revalidate');
    expect(maxAge).toBeGreaterThanOrEqual(31_536_000);
  }

  const deployedConfig = JSON.parse(await readFile('public/staticwebapp.config.json', 'utf8')) as {
    routes: Array<{ route: string; headers?: Record<string, string> }>;
  };
  const assetRoute = deployedConfig.routes.find((route) => route.route === '/assets/*');
  expect(assetRoute?.headers?.['Cache-Control']).toBe('public, max-age=31536000, immutable');
});

test('service worker installs the current cache generation for updates', async ({ page }) => {
  await page.goto('/demo');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  const cacheNames = await page.evaluate(async () => caches.keys());
  expect(cacheNames).toContain('onion-next-frame-v4');
});
