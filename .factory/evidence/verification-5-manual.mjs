import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const base = 'https://onion-next-frame.sociobot.in';
const fixturePng = await readFile('tests/fixtures/frame-2.png');
const fixtureGif = await readFile('tests/fixtures/two-frame.gif');
const evidence = {};
const browser = await chromium.launch({ headless: true });

function assert(value, message) {
  if (!value) throw new Error(message);
}

async function downloadBytes(download) {
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page = await context.newPage();
  const requests = [];
  const failedRequests = [];
  const consoleErrors = [];
  const pageErrors = [];
  page.on('request', request => requests.push({ url: request.url(), method: request.method(), type: request.resourceType() }));
  page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));

  const firstResponse = await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  const firstRead = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelector('h1')?.textContent?.trim(),
    lede: document.querySelector('.lede')?.textContent?.trim(),
    primary: document.querySelector('.hero-actions a')?.textContent?.trim(),
    primaryHint: document.querySelector('.hero-actions span')?.textContent?.trim(),
    primaryVisible: !!document.querySelector('.hero-actions a') && document.querySelector('.hero-actions a').getBoundingClientRect().bottom <= innerHeight
  }));
  assert(firstRead.primaryVisible, 'sample action is not in the first viewport');
  await page.screenshot({ path: '.factory/evidence/verification-5-live/first-read-desktop.png' });

  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await page.waitForLoadState('networkidle');
  const demoInitial = {
    url: page.url(),
    banner: await page.getByText('Demo — sample data, nothing is saved').isVisible(),
    counter: await page.locator('#current-counter').innerText(),
    frameButtons: await page.locator('#frame-strip button').count(),
    status: await page.locator('#viewer-status').innerText()
  };
  assert(demoInitial.banner && demoInitial.frameButtons === 6, 'one-click demo did not load six frames');
  const canvasBefore = await page.locator('#onion-canvas').evaluate(canvas => canvas.toDataURL());
  await page.locator('main').click({ position: { x: 2, y: 2 } });
  await page.keyboard.press('ArrowRight');
  const afterRight = await page.locator('#current-counter').innerText();
  await page.keyboard.press('Shift+ArrowRight');
  const afterShiftRight = await page.locator('#current-counter').innerText();
  await page.locator('[data-layer="current"] [data-field="opacity"]').evaluate(input => {
    input.value = '0';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(100);
  const canvasAfter = await page.locator('#onion-canvas').evaluate(canvas => canvas.toDataURL());
  assert(canvasBefore !== canvasAfter, 'opacity change did not alter the canvas');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  const reset = {
    counter: await page.locator('#current-counter').innerText(),
    previousOpacity: await page.locator('[data-layer="previous"] [data-output="opacity"]').innerText(),
    currentOpacity: await page.locator('[data-layer="current"] [data-output="opacity"]').innerText(),
    nextOpacity: await page.locator('[data-layer="next"] [data-output="opacity"]').innerText()
  };

  const sheetDownloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Export contact sheet/ }).click();
  const sheetDownload = await sheetDownloadPromise;
  const sheet = await downloadBytes(sheetDownload);
  const sheetEvidence = {
    filename: sheetDownload.suggestedFilename(),
    bytes: sheet.byteLength,
    signature: sheet.subarray(1, 4).toString(),
    width: sheet.readUInt32BE(16),
    height: sheet.readUInt32BE(20),
    sha256: createHash('sha256').update(sheet).digest('hex')
  };

  const projectDownloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export project' }).click();
  const projectDownload = await projectDownloadPromise;
  const projectBytes = await downloadBytes(projectDownload);
  const project = JSON.parse(projectBytes.toString());
  const projectEvidence = {
    filename: projectDownload.suggestedFilename(),
    format: project.format,
    version: project.version,
    frames: project.project.frames.length
  };

  await page.locator('#project-input').setInputFiles({ name: 'not-json.json', mimeType: 'application/json', buffer: Buffer.from('{no') });
  const invalidJsonStatus = await page.locator('#viewer-status').innerText();
  await page.locator('#project-input').setInputFiles({
    name: 'missing-settings.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({
      format: 'onion-next-frame',
      version: 1,
      project: { id: 'latest', name: 'bad settings', savedAt: 0, current: 0, frames: project.project.frames.slice(0, 1), settings: {} }
    }))
  });
  const missingSettingsStatus = await page.locator('#viewer-status').innerText();
  await page.locator('#project-input').setInputFiles({ name: 'valid-project.json', mimeType: 'application/json', buffer: projectBytes });
  const validProjectRecovery = await page.locator('#viewer-status').innerText();

  await page.goto(`${base}/`);
  const input = page.locator('#file-input');
  await input.setInputFiles({ name: 'single-001.png', mimeType: 'image/png', buffer: fixturePng });
  await page.waitForTimeout(300);
  const oneFrame = {
    status: await page.locator('#viewer-status').innerText(),
    counter: await page.locator('#current-counter').innerText(),
    previousDisabled: await page.locator('#previous-frame').isDisabled(),
    nextDisabled: await page.locator('#next-frame').isDisabled()
  };
  await input.setInputFiles({ name: 'broken.gif', mimeType: 'image/gif', buffer: Buffer.from('not a gif') });
  await page.waitForTimeout(500);
  const corruptGifStatus = await page.locator('#viewer-status').innerText();
  await input.setInputFiles({ name: 'two-frame.gif', mimeType: 'image/gif', buffer: fixtureGif });
  const gifRecovery = {
    status: await page.locator('#viewer-status').innerText(),
    counter: await page.locator('#current-counter').innerText()
  };

  const hundredInputs = Array.from({ length: 100 }, (_, index) => ({
    name: `run-${String(100 - index).padStart(3, '0')}.png`,
    mimeType: 'image/png',
    buffer: fixturePng
  }));
  await input.setInputFiles(hundredInputs);
  await page.waitForTimeout(500);
  const hundredCounter = await page.locator('#current-counter').innerText();
  const hundredButtons = await page.locator('#frame-strip button').count();
  const hundredFirstLabel = await page.locator('#frame-strip button').first().getAttribute('aria-label');
  const hundredLastLabel = await page.locator('#frame-strip button').last().getAttribute('aria-label');
  const hundredDownloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Export contact sheet/ }).click();
  const hundredDownload = await hundredDownloadPromise;
  const hundredSheet = await downloadBytes(hundredDownload);
  const hundredEvidence = {
    counter: hundredCounter,
    buttons: hundredButtons,
    firstLabel: hundredFirstLabel,
    lastLabel: hundredLastLabel,
    bytes: hundredSheet.byteLength,
    width: hundredSheet.readUInt32BE(16),
    height: hundredSheet.readUInt32BE(20),
    status: await page.locator('#viewer-status').innerText()
  };

  const axeRoutes = {};
  for (const route of ['/', '/demo', '/privacy', '/terms']) {
    await page.goto(`${base}${route}`);
    const results = await new AxeBuilder({ page }).analyze();
    axeRoutes[route] = results.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? '')).map(item => item.id);
  }

  const links = {};
  for (const route of ['/', '/demo', '/privacy', '/terms']) {
    await page.goto(`${base}${route}`);
    const hrefs = await page.locator('a[href]').evaluateAll(anchors => [...new Set(anchors.map(anchor => anchor.href))]);
    for (const href of hrefs) {
      if (href.startsWith(base) && !href.includes('#')) {
        const response = await context.request.get(href);
        links[new URL(href).pathname + new URL(href).search] = response.status();
      }
    }
  }

  evidence.desktopFlow = {
    firstRead,
    mainResponse: { status: firstResponse.status(), headers: firstResponse.headers() },
    demoInitial,
    keyboard: { afterRight, afterShiftRight },
    reset,
    sheet: sheetEvidence,
    project: projectEvidence,
    invalidJsonStatus,
    missingSettingsStatus,
    validProjectRecovery,
    oneFrame,
    corruptGifStatus,
    gifRecovery,
    hundredFrames: hundredEvidence,
    axeSeriousCritical: axeRoutes,
    links,
    requests: {
      total: requests.length,
      origins: [...new Set(requests.filter(item => item.url.startsWith('http')).map(item => new URL(item.url).origin))],
      unique: [...new Set(requests.map(item => item.url))],
      failed: failedRequests
    },
    consoleErrors,
    pageErrors
  };
  await context.close();

  const invalidContext = await browser.newContext();
  const invalidPage = await invalidContext.newPage();
  const invalidPageErrors = [];
  const invalidConsoleErrors = [];
  invalidPage.on('pageerror', error => invalidPageErrors.push(error.message));
  invalidPage.on('console', message => { if (message.type() === 'error') invalidConsoleErrors.push(message.text()); });
  await invalidPage.goto(`${base}/demo`);
  await invalidPage.locator('#project-input').setInputFiles({
    name: 'missing-settings.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({
      format: 'onion-next-frame',
      version: 1,
      project: { id: 'latest', name: 'bad settings', savedAt: 0, current: 0, frames: project.project.frames.slice(0, 1), settings: {} }
    }))
  });
  await invalidPage.waitForTimeout(100);
  const malformedStatus = await invalidPage.locator('#viewer-status').innerText();
  const staleCounter = await invalidPage.locator('#current-counter').innerText();
  const staleButtons = await invalidPage.locator('#frame-strip button').count();
  await invalidPage.locator('[data-layer="current"] [data-field="opacity"]').evaluate(input => {
    input.value = '50';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await invalidPage.waitForTimeout(100);
  await invalidPage.locator('#project-input').setInputFiles({ name: 'valid-project.json', mimeType: 'application/json', buffer: projectBytes });
  evidence.invalidProject = {
    malformedStatus,
    staleCounter,
    staleButtons,
    pageErrors: invalidPageErrors,
    consoleErrors: invalidConsoleErrors,
    validImportRecovery: await invalidPage.locator('#viewer-status').innerText()
  };
  await invalidContext.close();

  const isolationContext = await browser.newContext();
  await isolationContext.addInitScript(() => {
    const original = indexedDB.open.bind(indexedDB);
    window.__idbOpens = [];
    indexedDB.open = (...args) => {
      window.__idbOpens.push(String(args[0]));
      return original(...args);
    };
  });
  const isolationPage = await isolationContext.newPage();
  await isolationPage.goto(`${base}/`);
  await isolationPage.locator('#file-input').setInputFiles({ name: 'real-001.png', mimeType: 'image/png', buffer: fixturePng });
  await isolationPage.waitForTimeout(500);
  await isolationPage.goto(`${base}/demo`);
  await isolationPage.waitForTimeout(200);
  const opensInDemo = await isolationPage.evaluate(() => window.__idbOpens);
  const demoCounter = await isolationPage.locator('#current-counter').innerText();
  await isolationPage.getByRole('link', { name: 'Start for real' }).click();
  await isolationPage.waitForTimeout(300);
  evidence.demoIsolation = {
    opensInDemo,
    demoCounter,
    afterLeavingCounter: await isolationPage.locator('#current-counter').innerText(),
    afterLeavingStatus: await isolationPage.locator('#viewer-status').innerText()
  };
  await isolationContext.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`${base}/demo`);
  const undersized = await mobilePage.locator('a[href], button:not(:disabled), input:not(:disabled):not(.sr-only)').evaluateAll(elements => elements.flatMap(element => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const visible = style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
    return visible && (rect.width < 44 || rect.height < 44)
      ? [{ tag: element.tagName, name: element.getAttribute('aria-label') || element.textContent?.trim(), width: rect.width, height: rect.height }]
      : [];
  }));
  const opacityBoxes = await mobilePage.locator('[data-layer] input[data-field="opacity"]').evaluateAll(inputs => inputs.map(input => {
    const rect = input.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }));
  const mobileAxe = await new AxeBuilder({ page: mobilePage }).analyze();
  await mobilePage.screenshot({ path: '.factory/evidence/verification-5-live/demo-mobile.png', fullPage: true });
  evidence.mobile = {
    viewport: { width: 390, height: 844 },
    scrollWidth: await mobilePage.evaluate(() => document.documentElement.scrollWidth),
    undersized,
    opacityBoxes,
    axeSeriousCritical: mobileAxe.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? '')).map(item => item.id)
  };
  await mobileContext.close();

  const keyboardContext = await browser.newContext({ reducedMotion: 'reduce' });
  const keyboardPage = await keyboardContext.newPage();
  await keyboardPage.goto(`${base}/`);
  await keyboardPage.keyboard.press('Tab');
  await keyboardPage.waitForTimeout(100);
  const skip = await keyboardPage.evaluate(() => {
    const element = document.activeElement;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return { text: element.textContent?.trim(), outlineWidth: style.outlineWidth, outlineColor: style.outlineColor, visible: rect.top >= 0 && rect.height >= 44 };
  });
  let tabCount = 0;
  while (tabCount < 12 && (await keyboardPage.evaluate(() => document.activeElement?.textContent?.trim())) !== 'Demo') {
    await keyboardPage.keyboard.press('Tab');
    tabCount += 1;
  }
  await keyboardPage.keyboard.press('Enter');
  await keyboardPage.waitForTimeout(200);
  const reducedDuration = await keyboardPage.locator('.key').first().evaluate(element => getComputedStyle(element).transitionDuration);
  evidence.keyboardReducedMotion = {
    skip,
    demoActivated: keyboardPage.url().endsWith('/demo'),
    headingFocused: await keyboardPage.locator('h1').evaluate(element => document.activeElement === element),
    reducedDuration
  };
  await keyboardContext.close();

  const offlineContext = await browser.newContext();
  const offlinePage = await offlineContext.newPage();
  await offlinePage.goto(`${base}/demo`);
  await offlinePage.evaluate(async () => { await navigator.serviceWorker.ready; });
  await offlineContext.setOffline(true);
  await offlinePage.reload({ waitUntil: 'domcontentloaded' });
  evidence.offline = {
    heading: await offlinePage.locator('h1').innerText(),
    counter: await offlinePage.locator('#current-counter').innerText(),
    networkState: await offlinePage.locator('#network-state').innerText(),
    cacheNames: await offlinePage.evaluate(async () => caches.keys())
  };
  await offlineContext.setOffline(false);
  await offlineContext.close();
} finally {
  await browser.close();
  await writeFile('.factory/evidence/verification-5-live/manual-audit.json', JSON.stringify(evidence, null, 2));
}

console.log(JSON.stringify(evidence, null, 2));
