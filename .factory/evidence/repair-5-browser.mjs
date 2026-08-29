import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const base = process.env.BASE_URL ?? 'http://127.0.0.1:4174';
const evidenceDir = process.env.EVIDENCE_DIR ?? '.factory/evidence/repair-5-local';
const png = await readFile('tests/fixtures/frame-2.png');
const gif = await readFile('tests/fixtures/two-frame.gif');
await mkdir(evidenceDir, { recursive: true });

function assert(value, message) {
  if (!value) throw new Error(message);
}

async function downloadBytes(download) {
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

const browser = await chromium.launch({ headless: true });
const evidence = { base };

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page = await context.newPage();
  const requests = [];
  const consoleErrors = [];
  const pageErrors = [];
  page.on('request', (request) => requests.push(request.url()));
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${evidenceDir}/demo-desktop.png`, fullPage: true });
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export project' }).click();
  const validBytes = await downloadBytes(await downloadPromise);
  const valid = JSON.parse(validBytes.toString());
  const invalidCases = [
    ['missing', (project) => { delete project.settings; }],
    ['malformed', (project) => { project.settings.current.visible = 'yes'; }],
    ['outOfRange', (project) => { project.settings.next.opacity = 1.2; }]
  ];
  const rejection = {};
  for (const [name, change] of invalidCases) {
    const payload = structuredClone(valid);
    change(payload.project);
    await page.locator('#project-input').setInputFiles({
      name: `${name}.json`,
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(payload))
    });
    rejection[name] = {
      status: await page.locator('#viewer-status').innerText(),
      counter: await page.locator('#current-counter').innerText(),
      frameButtons: await page.locator('#frame-strip button').count()
    };
  }
  await page.locator('[data-layer="current"] [data-field="opacity"]').evaluate((input) => {
    input.value = '50';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.getByRole('button', { name: 'Show next frame' }).click();
  const continuedUse = {
    opacity: await page.locator('[data-layer="current"] [data-output="opacity"]').innerText(),
    counter: await page.locator('#current-counter').innerText()
  };
  await page.locator('#project-input').setInputFiles({ name: 'valid-project.json', mimeType: 'application/json', buffer: validBytes });
  const validRecovery = await page.locator('#viewer-status').innerText();

  await page.goto(`${base}/`);
  const input = page.locator('#file-input');
  await input.setInputFiles({ name: 'broken.gif', mimeType: 'image/gif', buffer: Buffer.from('not a GIF') });
  await page.waitForFunction(() => document.querySelector('#viewer-status')?.textContent !== 'Reading frames in this browser…');
  const corruptGif = await page.locator('#viewer-status').innerText();
  await input.setInputFiles({ name: 'two-frame.gif', mimeType: 'image/gif', buffer: gif });
  const gifRecovery = await page.locator('#viewer-status').innerText();
  await input.setInputFiles({ name: 'single.png', mimeType: 'image/png', buffer: png });
  await page.waitForTimeout(300);
  await page.reload();
  const singularRestore = await page.locator('#viewer-status').innerText();

  evidence.desktop = {
    rejection,
    continuedUse,
    validRecovery,
    corruptGif,
    gifRecovery,
    singularRestore,
    requestOrigins: [...new Set(requests.map((url) => new URL(url).origin))],
    consoleErrors,
    pageErrors
  };
  assert(pageErrors.length === 0 && consoleErrors.length === 0, 'desktop browser errors were recorded');
  await context.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`${base}/demo`);
  const mobileAxe = await new AxeBuilder({ page: mobilePage }).analyze();
  const undersized = await mobilePage.locator('a[href], button:not(:disabled), input:not(:disabled):not(.sr-only)').evaluateAll((elements) => elements.flatMap((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const visible = style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
    return visible && (rect.width < 44 || rect.height < 44)
      ? [{ name: element.getAttribute('aria-label') || element.textContent?.trim(), width: rect.width, height: rect.height }]
      : [];
  }));
  await mobilePage.screenshot({ path: `${evidenceDir}/demo-mobile.png`, fullPage: true });
  evidence.mobile = {
    viewport: { width: 390, height: 844 },
    scrollWidth: await mobilePage.evaluate(() => document.documentElement.scrollWidth),
    undersized,
    axeSeriousCritical: mobileAxe.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')).map((item) => item.id)
  };
  await mobileContext.close();

  const keyboardContext = await browser.newContext({ reducedMotion: 'reduce', acceptDownloads: true });
  const keyboardPage = await keyboardContext.newPage();
  await keyboardPage.goto(`${base}/`);
  await keyboardPage.keyboard.press('Tab');
  await keyboardPage.waitForTimeout(100);
  const skipLink = await keyboardPage.evaluate(() => {
    const element = document.activeElement;
    const style = getComputedStyle(element);
    return { text: element?.textContent?.trim(), outlineWidth: style.outlineWidth, outlineColor: style.outlineColor };
  });
  let tabs = 0;
  while (tabs < 12 && (await keyboardPage.evaluate(() => document.activeElement?.textContent?.trim())) !== 'Demo') {
    await keyboardPage.keyboard.press('Tab');
    tabs += 1;
  }
  await keyboardPage.keyboard.press('Enter');
  await keyboardPage.locator('[data-layer="current"] [data-field="visible"]').focus();
  await keyboardPage.keyboard.press('Space');
  const layerVisible = await keyboardPage.locator('[data-layer="current"] [data-field="visible"]').isChecked();
  await keyboardPage.locator('[data-layer="current"] [data-field="opacity"]').focus();
  await keyboardPage.keyboard.press('Home');
  const homeOpacity = await keyboardPage.locator('[data-layer="current"] [data-output="opacity"]').innerText();
  await keyboardPage.locator('#onion-canvas').click({ position: { x: 10, y: 10 } });
  await keyboardPage.keyboard.press('ArrowRight');
  const arrowCounter = await keyboardPage.locator('#current-counter').innerText();
  const keyboardDownload = keyboardPage.waitForEvent('download');
  await keyboardPage.keyboard.press('e');
  const keyboardExport = (await keyboardDownload).suggestedFilename();
  evidence.keyboard = {
    skipLink,
    demoActivated: keyboardPage.url().endsWith('/demo'),
    layerVisibleAfterSpace: layerVisible,
    opacityAfterHome: homeOpacity,
    arrowCounter,
    keyboardExport,
    reducedDuration: await keyboardPage.locator('.key').first().evaluate((element) => getComputedStyle(element).transitionDuration)
  };
  await keyboardContext.close();

  const offlineContext = await browser.newContext();
  const offlinePage = await offlineContext.newPage();
  await offlinePage.goto(`${base}/demo`);
  await offlinePage.evaluate(async () => { await navigator.serviceWorker.ready; });
  await offlineContext.setOffline(true);
  await offlinePage.reload({ waitUntil: 'domcontentloaded' });
  evidence.offline = {
    counter: await offlinePage.locator('#current-counter').innerText(),
    networkState: await offlinePage.locator('#network-state').innerText(),
    caches: await offlinePage.evaluate(async () => caches.keys())
  };
  await offlineContext.close();

  await writeFile(`${evidenceDir}/manual-audit.json`, JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify(evidence, null, 2));
} finally {
  await browser.close();
}
