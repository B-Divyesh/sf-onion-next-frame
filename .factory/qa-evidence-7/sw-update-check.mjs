import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const output = path.resolve('.factory/qa-evidence-7/sw-update.json');
const types = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json'],
  ['.webmanifest', 'application/manifest+json'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2']
]);
let currentGeneration = 'old';

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/sw.js') {
      const source = await readFile(path.join(dist, 'sw.js'), 'utf8');
      const body = currentGeneration === 'old' ? source.replace('onion-next-frame-v7', 'onion-next-frame-v6') : source;
      response.writeHead(200, { 'Content-Type': 'text/javascript', 'Cache-Control': 'no-store' });
      response.end(body);
      return;
    }
    if (['/', '/demo', '/privacy', '/terms'].includes(pathname)) pathname = '/index.html';
    const file = path.join(dist, pathname.replace(/^\//, ''));
    const info = await stat(file);
    if (!info.isFile()) throw new Error('not file');
    response.writeHead(200, { 'Content-Type': types.get(path.extname(file)) || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('not found');
  }
});

await new Promise((resolve) => server.listen(4174, '127.0.0.1', resolve));
const browser = await chromium.launch({ headless: true });
const result = { oldCaches: [], waitingVisible: false, cachesBeforeApply: [], newCaches: [], errors: [] };

try {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('console', (message) => { if (message.type() === 'error') result.errors.push(message.text()); });
  page.on('pageerror', (error) => result.errors.push(error.message));
  await page.goto('http://127.0.0.1:4174/demo');
  await page.evaluate(async () => {
    for (const registration of await navigator.serviceWorker.getRegistrations()) await registration.unregister();
    for (const key of await caches.keys()) await caches.delete(key);
    await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  result.oldCaches = await page.evaluate(() => caches.keys());
  currentGeneration = 'new';
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    await registration.update();
  });
  await page.getByText('An updated frame is ready.').waitFor({ state: 'visible' });
  result.waitingVisible = true;
  result.cachesBeforeApply = await page.evaluate(() => caches.keys());
  await Promise.all([
    page.waitForEvent('load'),
    page.getByRole('button', { name: 'Load update' }).click()
  ]);
  await page.locator('#current-counter').waitFor();
  result.newCaches = await page.evaluate(() => caches.keys());
  result.counterAfterUpdate = await page.locator('#current-counter').innerText();
  result.bannerAfterUpdate = await page.getByText('Demo — sample data, nothing is saved').isVisible();
  result.controllerAfterUpdate = await page.evaluate(() => !!navigator.serviceWorker.controller);
  await context.close();
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
  await writeFile(output, `${JSON.stringify(result, null, 2)}\n`);
}
