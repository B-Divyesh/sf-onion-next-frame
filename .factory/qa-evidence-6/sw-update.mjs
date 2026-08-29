import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { chromium } from '@playwright/test';

const root = join(process.cwd(), 'dist');
let generation = 5;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2' };
const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://127.0.0.1:4181');
  if (url.pathname === '/advance') {
    generation = 6;
    response.writeHead(200, { 'Cache-Control': 'no-store' });
    response.end('advanced');
    return;
  }
  let pathname = url.pathname;
  if (['/', '/demo', '/privacy', '/terms'].includes(pathname)) pathname = '/index.html';
  try {
    let body = await readFile(join(root, pathname));
    if (pathname === '/sw.js') body = Buffer.from(body.toString().replaceAll('onion-next-frame-v5', `onion-next-frame-v${generation}`));
    response.writeHead(200, { 'Content-Type': types[extname(pathname)] ?? 'application/octet-stream', 'Cache-Control': pathname === '/sw.js' ? 'no-store' : 'public, max-age=60' });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end('not found');
  }
});

await new Promise(resolve => server.listen(4181, '127.0.0.1', resolve));
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const consoleErrors = [];
const pageErrors = [];
page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', error => pageErrors.push(error.message));
let result;
try {
  await page.goto('http://127.0.0.1:4181/demo');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
  });
  const before = await page.evaluate(async () => ({ controlled: Boolean(navigator.serviceWorker.controller), caches: await caches.keys(), counter: document.querySelector('#current-counter')?.textContent }));
  await context.request.get('http://127.0.0.1:4181/advance');
  await page.evaluate(async () => (await navigator.serviceWorker.ready).update());
  await page.getByText('An updated frame is ready.').waitFor({ state: 'visible' });
  const toastVisible = await page.getByText('An updated frame is ready.').isVisible();
  await page.getByRole('button', { name: 'Load update' }).click();
  await page.waitForLoadState('domcontentloaded');
  await page.locator('#current-counter').waitFor({ state: 'visible' });
  const after = await page.evaluate(async () => ({ controlled: Boolean(navigator.serviceWorker.controller), caches: await caches.keys(), counter: document.querySelector('#current-counter')?.textContent, url: location.href }));
  result = { result: before.controlled && toastVisible && after.controlled && after.caches.includes('onion-next-frame-v6') && !after.caches.includes('onion-next-frame-v5') && after.counter === 'FRAME 03 / 06' && consoleErrors.length === 0 && pageErrors.length === 0 ? 'PASS' : 'FAIL', before, toastVisible, after, consoleErrors, pageErrors };
  console.log(JSON.stringify(result, null, 2));
} finally {
  await writeFile('.factory/qa-evidence-6/sw-update.json', JSON.stringify(result, null, 2));
  await context.close();
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
if (result.result !== 'PASS') process.exit(1);
