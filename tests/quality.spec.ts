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

test('browser Back restores the previous route scroll position and focused control', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  });
  const expectedScroll = await page.evaluate(() => {
    document.querySelector<HTMLButtonElement>('#import-hero')?.focus();
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 1_500, behavior: 'auto' });
    const savedScroll = window.scrollY;
    document.querySelector<HTMLAnchorElement>('header a[href="/privacy"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    return savedScroll;
  });
  expect(expectedScroll).toBeGreaterThan(0);
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.locator('h1')).toBeFocused();

  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(expectedScroll);
  await expect(page.locator('#import-hero')).toBeFocused();
});

test('the first-screen sample action opens the isolated query-string demo in one click', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.locator('h1')).toBeFocused();
});

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`the demo shows its seeded canvas and frame controls without scrolling at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/?demo=1');
    await expect(page.locator('#current-counter')).toHaveText('FRAME 03 / 06');
    const bounds = await page.locator('#onion-canvas, #current-counter, #previous-frame, #next-frame').evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { id: element.id, top: rect.top, bottom: rect.bottom, height: rect.height };
      })
    );
    const byId = Object.fromEntries(bounds.map((bound) => [bound.id, bound]));
    expect(byId['onion-canvas'].top).toBeGreaterThanOrEqual(0);
    expect(byId['onion-canvas'].height).toBeGreaterThanOrEqual(250);
    expect(byId['onion-canvas'].bottom).toBeLessThanOrEqual(viewport.height);
    for (const id of ['current-counter', 'previous-frame', 'next-frame']) {
      expect(byId[id].top).toBeGreaterThanOrEqual(0);
      expect(byId[id].bottom).toBeLessThanOrEqual(viewport.height);
    }
  });
}

test('the hero has no decorative lettering and keeps its useful description in HTML', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('.hero-art img');
  await expect(hero).toHaveAttribute('src', '/assets/hero-1200.webp');
  await expect(hero).toHaveAttribute('alt', 'Three pixel creature poses show the previous, current, and next animation frames.');
  await expect(page.locator('.hero-art')).not.toContainText(/FRAME STUDY/i);
  await expect(page.locator('.hero-art').evaluate((element) => getComputedStyle(element, '::before').content)).resolves.toBe('none');
  await expect(page.locator('.hero-art figcaption')).toHaveText(/PREVIOUS[\s\S]*CURRENT[\s\S]*NEXT/);
});

test('review-three copy uses one plain name for each task and storage boundary', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Your frame comparison appears here.')).toBeVisible();
  await expect(page.getByText('Adjust the frame layers')).toBeVisible();
  await expect(page.getByText('Export a contact sheet')).toBeVisible();
  await expect(page.locator('.console-top')).toHaveText(/LAYERS[\s\S]*COLOR \/ OPACITY/);
  await expect(page.locator('main')).not.toContainText('Your onion preview appears here.');
  await expect(page.locator('main')).not.toContainText('Tune each neighbour');
  await expect(page.locator('main')).not.toContainText('Export the sheet');
  await expect(page.locator('main')).not.toContainText('RGB / ALPHA');

  const readme = await readFile('README.md', 'utf8');
  for (const copy of [
    'Imports numbered PNG files in number order and imports animated GIF frames.',
    'Real projects stay in this browser.',
    'The demo banner remains visible while demo mode is active.',
    'Open `/?demo=1` to load the sample.',
    "Very large sequences can exceed this browser's storage limit."
  ]) expect(readme).toContain(copy);
  for (const oldCopy of ['naturally sorted', 'Real projects use IndexedDB.', 'The cyan banner', 'seeded path', "IndexedDB quota"]) {
    expect(readme).not.toContain(oldCopy);
  }
});

test('the workbench fits a 390px phone without horizontal scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await expect(page.getByRole('button', { name: /Export contact sheet/ })).toBeVisible();
});

test('the desktop first screen keeps all three product facts beside the primary action', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const facts = await page.locator('.fact-list').boundingBox();
  expect(facts).not.toBeNull();
  expect(facts!.y).toBeGreaterThanOrEqual(0);
  expect(facts!.y + facts!.height).toBeLessThanOrEqual(900);
});

test('the mobile first screen keeps all three product facts readable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const facts = await page.locator('.fact-list').boundingBox();
  expect(facts).not.toBeNull();
  expect(facts!.y).toBeGreaterThanOrEqual(0);
  expect(facts!.y + facts!.height).toBeLessThanOrEqual(844);
  await expect(page.locator('.fact-list')).toContainText('Free to use');
  await expect(page.locator('.fact-list')).toContainText('Works offline after the first visit');
  await expect(page.locator('.fact-list')).toContainText('Images stay on this device');
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
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This frame is missing');
  await expect(page.locator('header.site-header')).toHaveCount(1);
  await expect(page.locator('footer.site-footer')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Privacy', exact: true })).toHaveCount(2);
  await expect(page.getByRole('link', { name: 'Terms', exact: true })).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Return home' })).toHaveCount(1);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Return home/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://onion-next-frame.sociobot.in/404.html');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Missing frame — Onion Next Frame');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');

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

test('unversioned product images revalidate instead of being cached as immutable', async ({ request }) => {
  const imagePaths = [
    '/assets/hero-640.webp',
    '/assets/hero-1200.webp',
    '/assets/onion-next-frame-og.webp'
  ];
  for (const imagePath of imagePaths) {
    const response = await request.get(imagePath);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['cache-control']).toBe('public, max-age=0, must-revalidate');
  }

  const deployedConfig = JSON.parse(await readFile('public/staticwebapp.config.json', 'utf8')) as {
    routes: Array<{ route: string; headers?: Record<string, string> }>;
  };
  const immutableIndex = deployedConfig.routes.findIndex((route) => route.route === '/assets/*');
  for (const imagePath of imagePaths) {
    const routeIndex = deployedConfig.routes.findIndex((route) => route.route === imagePath);
    expect(routeIndex).toBeGreaterThanOrEqual(0);
    expect(routeIndex).toBeLessThan(immutableIndex);
    expect(deployedConfig.routes[routeIndex].headers?.['Cache-Control']).toBe('public, max-age=0, must-revalidate');
  }
});

test('service worker installs the current cache generation for updates', async ({ page }) => {
  await page.goto('/demo');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  const cacheNames = await page.evaluate(async () => caches.keys());
  expect(cacheNames).toContain('onion-next-frame-v8');
});
