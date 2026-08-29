import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const base = 'https://onion-next-frame.sociobot.in';
const evidenceDir = path.resolve('.factory/qa-evidence-7');
const fixture = (name) => path.resolve('tests/fixtures', name);
const result = {
  checkedAt: new Date().toISOString(),
  base,
  cold: {},
  normalFlow: {},
  invalidRecovery: {},
  boundary: {},
  privacy: {},
  accessibility: {},
  mobile: {},
  pwa: {},
  headers: {},
  errors: []
};

const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page = await context.newPage();
  const requests = [];
  const failedRequests = [];
  const consoleErrors = [];
  const pageErrors = [];
  page.on('request', (request) => requests.push({ method: request.method(), url: request.url(), type: request.resourceType() }));
  page.on('requestfailed', (request) => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  const response = await page.goto(base, { waitUntil: 'networkidle' });
  result.headers.rootStatus = response.status();
  result.headers.root = await response.allHeaders();
  result.cold.title = await page.title();
  result.cold.h1 = (await page.locator('h1').innerText()).trim();
  result.cold.audience = (await page.locator('.hero-copy .lede').innerText()).trim();
  result.cold.primaryAction = (await page.getByRole('link', { name: 'Try it with sample data' }).innerText()).trim();
  result.cold.actionOutcome = (await page.locator('.hero-actions span').innerText()).trim();
  result.cold.facts = await page.locator('.fact-list li').allInnerTexts();
  await page.screenshot({ path: path.join(evidenceDir, 'live-cold-independent.png'), fullPage: false });

  const axeHome = await new AxeBuilder({ page }).analyze();
  result.accessibility.homeSeriousCritical = axeHome.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')).map((v) => v.id);

  const focusOrder = [];
  for (let index = 0; index < 8; index += 1) {
    await page.keyboard.press('Tab');
    focusOrder.push(await page.evaluate(() => {
      const el = document.activeElement;
      if (!(el instanceof HTMLElement)) return null;
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return {
        tag: el.tagName,
        name: el.getAttribute('aria-label') || el.textContent?.trim().replace(/\s+/g, ' '),
        width: rect.width,
        height: rect.height,
        outline: style.outline,
        outlineColor: style.outlineColor
      };
    }));
  }
  result.accessibility.focusOrder = focusOrder;

  await page.goto(`${base}/`);
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await page.waitForLoadState('networkidle');
  result.normalFlow.urlAfterOneClick = page.url();
  result.normalFlow.banner = (await page.getByText('Demo — sample data, nothing is saved').innerText()).trim();
  result.normalFlow.initialCounter = await page.locator('#current-counter').innerText();
  result.normalFlow.frameButtons = await page.locator('#frame-strip button').count();
  result.normalFlow.initialStatus = await page.locator('#viewer-status').innerText();
  result.normalFlow.indexedDbNamesAfterLandingThenDemo = await page.evaluate(async () => (await indexedDB.databases()).map((db) => db.name));
  await page.locator('main').click({ position: { x: 3, y: 3 } });
  await page.keyboard.press('ArrowRight');
  result.normalFlow.afterArrowRight = await page.locator('#current-counter').innerText();
  await page.keyboard.press('Shift+ArrowRight');
  result.normalFlow.afterShiftArrowRight = await page.locator('#current-counter').innerText();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  result.normalFlow.afterReset = await page.locator('#current-counter').innerText();
  await page.locator('main').click({ position: { x: 3, y: 3 } });
  const contactDownload = page.waitForEvent('download');
  await page.keyboard.press('e');
  const contact = await contactDownload;
  const contactPath = path.join(evidenceDir, 'manual-contact-sheet.png');
  await contact.saveAs(contactPath);
  const contactBytes = await readFile(contactPath);
  result.normalFlow.contactSheet = {
    filename: contact.suggestedFilename(),
    bytes: contactBytes.byteLength,
    pngSignature: contactBytes.subarray(1, 4).toString(),
    width: contactBytes.readUInt32BE(16),
    height: contactBytes.readUInt32BE(20),
    status: await page.locator('#viewer-status').innerText()
  };
  const canvasBefore = await page.locator('#onion-canvas').screenshot();
  await page.locator('[data-layer="previous"] [data-field="opacity"]').evaluate((input) => {
    input.value = '41';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(100);
  const canvasAfter = await page.locator('#onion-canvas').screenshot();
  result.normalFlow.previousOpacity = await page.locator('[data-layer="previous"] [data-output="opacity"]').innerText();
  result.normalFlow.layerAdjustmentChangedPixels = !canvasBefore.equals(canvasAfter);
  const projectDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export project' }).click();
  const projectFile = await projectDownload;
  const projectPath = path.join(evidenceDir, 'manual-project.json');
  await projectFile.saveAs(projectPath);
  const projectBytes = await readFile(projectPath);
  const projectJson = JSON.parse(projectBytes.toString());
  result.normalFlow.projectExport = {
    filename: projectFile.suggestedFilename(),
    format: projectJson.format,
    version: projectJson.version,
    frames: projectJson.project.frames.length
  };
  const malformedProject = structuredClone(projectJson);
  malformedProject.project.settings.next.opacity = -1;
  await page.locator('#project-input').setInputFiles({ name: 'negative-opacity.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(malformedProject)) });
  result.invalidRecovery.invalidSettings = await page.locator('#viewer-status').innerText();
  result.invalidRecovery.counterAfterInvalidSettings = await page.locator('#current-counter').innerText();
  await page.locator('#project-input').setInputFiles({ name: 'valid-project.json', mimeType: 'application/json', buffer: projectBytes });
  result.normalFlow.projectImportStatus = await page.locator('#viewer-status').innerText();

  const axeDemo = await new AxeBuilder({ page }).analyze();
  result.accessibility.demoSeriousCritical = axeDemo.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')).map((v) => v.id);
  result.accessibility.semanticCounts = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    h1: document.querySelectorAll('h1').length,
    main: document.querySelectorAll('main').length,
    header: document.querySelectorAll('header').length,
    footer: document.querySelectorAll('footer').length,
    unlabeledButtons: [...document.querySelectorAll('button')].filter((button) => !button.getAttribute('aria-label') && !button.textContent?.trim()).length,
    imagesWithoutAlt: [...document.querySelectorAll('img')].filter((image) => !image.hasAttribute('alt')).length
  }));
  result.accessibility.reducedMotion = await page.emulateMedia({ reducedMotion: 'reduce' }).then(() => page.evaluate(() => {
    const elements = [...document.querySelectorAll('*')];
    const timings = elements.map((element) => {
      const style = getComputedStyle(element);
      const toMs = (value) => Math.max(...value.split(',').map((part) => parseFloat(part) * (part.trim().endsWith('ms') ? 1 : 1000)));
      return { animationMs: toMs(style.animationDuration), transitionMs: toMs(style.transitionDuration) };
    });
    return {
      maxAnimationMs: Math.max(...timings.map((timing) => timing.animationMs)),
      maxTransitionMs: Math.max(...timings.map((timing) => timing.transitionMs))
    };
  }));

  await page.goto(base);
  const fileInput = page.locator('#file-input');
  await fileInput.setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('not artwork') });
  result.invalidRecovery.badExtension = await page.locator('#viewer-status').innerText();
  await fileInput.setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('not a png') });
  result.invalidRecovery.corruptPng = await page.locator('#viewer-status').innerText();
  await fileInput.setInputFiles(fixture('two-frame.gif'));
  result.invalidRecovery.afterValidGif = await page.locator('#viewer-status').innerText();
  result.invalidRecovery.gifCounter = await page.locator('#current-counter').innerText();

  const invalidProject = Buffer.from('{ definitely not json');
  await page.locator('#project-input').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: invalidProject });
  await page.waitForFunction(() => document.querySelector('#viewer-status')?.textContent?.includes('not valid JSON'));
  result.invalidRecovery.badProject = await page.locator('#viewer-status').innerText();
  result.invalidRecovery.counterAfterBadProject = await page.locator('#current-counter').innerText();

  const pngFixture = await readFile(fixture('frame-2.png'));
  const hundredFrames = Array.from({ length: 100 }, (_, index) => ({
    name: `run-${String(index + 1).padStart(3, '0')}.png`,
    mimeType: 'image/png',
    buffer: pngFixture
  })).reverse();
  await fileInput.setInputFiles(hundredFrames);
  await page.waitForFunction(() => document.querySelector('#viewer-status')?.textContent === 'Loaded 100 frames.');
  result.boundary.largeSequence = {
    status: await page.locator('#viewer-status').innerText(),
    controls: await page.locator('#frame-strip button').count(),
    first: await page.locator('#frame-strip button').first().getAttribute('aria-label'),
    last: await page.locator('#frame-strip button').last().getAttribute('aria-label')
  };
  const largeDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: /Export contact sheet/ }).click();
  const largeSheet = await largeDownload;
  const largePath = path.join(evidenceDir, 'manual-100-frame-sheet.png');
  await largeSheet.saveAs(largePath);
  const largeBytes = await readFile(largePath);
  result.boundary.largeSequence.export = {
    bytes: largeBytes.byteLength,
    width: largeBytes.readUInt32BE(16),
    height: largeBytes.readUInt32BE(20)
  };

  await page.goto(base);
  await fileInput.setInputFiles(fixture('frame-2.png'));
  result.boundary.singleFrameStatus = await page.locator('#viewer-status').innerText();
  result.boundary.singleFrameCounter = await page.locator('#current-counter').innerText();
  result.boundary.previousDisabled = await page.getByRole('button', { name: 'Show previous frame' }).isDisabled();
  result.boundary.nextDisabled = await page.getByRole('button', { name: 'Show next frame' }).isDisabled();
  await page.waitForTimeout(350);
  await page.reload();
  result.boundary.restoreStatus = await page.locator('#viewer-status').innerText();
  let dialogText;
  page.once('dialog', async (dialog) => { dialogText = dialog.message(); await dialog.dismiss(); });
  await page.getByRole('button', { name: 'Clear sequence' }).click();
  result.boundary.clearDialog = dialogText;
  result.boundary.counterAfterCancel = await page.locator('#current-counter').innerText();
  await page.goto(`${base}/demo`);
  await page.getByRole('button', { name: 'Show next frame' }).click();
  await page.getByRole('link', { name: 'Start for real' }).click();
  result.boundary.afterLeavingDemoUrl = page.url();
  result.boundary.afterLeavingDemoCounter = await page.locator('#current-counter').innerText();
  result.boundary.afterLeavingDemoProject = await page.locator('#project-name').innerText();

  await page.goto(`${base}/privacy`);
  result.privacy.pageText = (await page.locator('main').innerText()).replace(/\s+/g, ' ').trim();
  result.privacy.requestCount = requests.length;
  result.privacy.requests = requests;
  result.privacy.origins = [...new Set(requests.map((item) => new URL(item.url).origin))];
  result.privacy.failedRequests = failedRequests;
  result.privacy.iframes = await page.locator('iframe').count();
  result.privacy.passwordFields = await page.locator('input[type=password]').count();
  result.privacy.consoleErrors = consoleErrors;
  result.privacy.pageErrors = pageErrors;

  const manifestResponse = await context.request.get(`${base}/manifest.webmanifest`);
  result.pwa.manifest = await manifestResponse.json();
  result.headers.manifest = manifestResponse.headers();
  const swResponse = await context.request.get(`${base}/sw.js`);
  result.headers.serviceWorker = swResponse.headers();
  result.pwa.serviceWorkerText = await swResponse.text();
  await context.close();

  const directDemoContext = await browser.newContext();
  const directDemo = await directDemoContext.newPage();
  await directDemo.goto(`${base}/?demo=1`);
  result.normalFlow.directFreshDemoIndexedDbNames = await directDemo.evaluate(async () => (await indexedDB.databases()).map((db) => db.name));
  await directDemoContext.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const mobile = await mobileContext.newPage();
  await mobile.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  await mobile.screenshot({ path: path.join(evidenceDir, 'live-mobile-independent.png'), fullPage: true });
  result.mobile.geometry = await mobile.evaluate(() => ({
    innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyFontSize: getComputedStyle(document.body).fontSize,
    h1Visible: !!document.querySelector('h1')?.getClientRects().length,
    exportVisible: !!document.querySelector('#export-sheet')?.getClientRects().length,
    undersized: [...document.querySelectorAll('a[href], button:not(:disabled), input:not(:disabled):not(.sr-only)')].flatMap((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || !rect.width || !rect.height || (rect.width >= 44 && rect.height >= 44)) return [];
      return [{ tag: element.tagName, name: element.getAttribute('aria-label') || element.textContent?.trim(), width: rect.width, height: rect.height }];
    })
  }));
  const axeMobile = await new AxeBuilder({ page: mobile }).analyze();
  result.accessibility.mobileSeriousCritical = axeMobile.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')).map((v) => v.id);

  await mobile.evaluate(async () => { await navigator.serviceWorker.ready; });
  await mobile.reload();
  result.pwa.controllerBeforeOffline = await mobile.evaluate(() => !!navigator.serviceWorker.controller);
  result.pwa.cacheNames = await mobile.evaluate(() => caches.keys());
  await mobileContext.setOffline(true);
  await mobile.reload({ waitUntil: 'domcontentloaded' });
  result.pwa.offlineCounter = await mobile.locator('#current-counter').innerText();
  result.pwa.offlineState = await mobile.locator('#network-state').innerText();
  result.pwa.offlineBanner = await mobile.getByText('Demo — sample data, nothing is saved').isVisible();
  await mobileContext.close();

  result.errors = [...consoleErrors, ...pageErrors];
} finally {
  await browser.close();
  await writeFile(path.join(evidenceDir, 'manual-live.json'), `${JSON.stringify(result, null, 2)}\n`);
}
