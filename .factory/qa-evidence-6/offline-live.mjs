import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', error => errors.push(error.message));
let report;
try {
  await page.goto('https://onion-next-frame.sociobot.in/demo', { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
      location.reload();
    }
  });
  await page.waitForLoadState('networkidle');
  const before = await page.evaluate(async () => ({ controlled: Boolean(navigator.serviceWorker.controller), caches: await caches.keys(), counter: document.querySelector('#current-counter')?.textContent }));
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('#current-counter').waitFor({ state: 'visible' });
  const after = await page.evaluate(() => ({ title: document.title, counter: document.querySelector('#current-counter')?.textContent, network: document.querySelector('#network-state')?.textContent, banner: document.querySelector('.demo-banner')?.textContent?.replace(/\s+/g, ' ').trim() }));
  report = { result: before.controlled && before.caches.includes('onion-next-frame-v5') && after.counter === 'FRAME 03 / 06' && after.network === 'Offline mode' && errors.length === 0 ? 'PASS' : 'FAIL', before, after, errors };
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile('.factory/qa-evidence-6/offline-live.json', JSON.stringify(report, null, 2));
  await context.close();
  await browser.close();
}
if (report.result !== 'PASS') process.exit(1);
