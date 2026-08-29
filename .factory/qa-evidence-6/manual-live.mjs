import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile, writeFile } from 'node:fs/promises';

const base = 'https://onion-next-frame.sociobot.in';
const evidence = new URL('./', import.meta.url);
const pngBytes = await readFile(new URL('../../tests/fixtures/frame-2.png', import.meta.url));
const gifBytes = await readFile(new URL('../../tests/fixtures/two-frame.gif', import.meta.url));
const report = { checks: {}, errors: [], requests: [] };

function assert(value, message) {
  if (!value) throw new Error(message);
}

async function pngInfo(download) {
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const bytes = Buffer.concat(chunks);
  assert(bytes.subarray(1, 4).toString() === 'PNG', 'download is not PNG');
  return { bytes: bytes.length, width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('console', message => { if (message.type() === 'error') report.errors.push(`console: ${message.text()}`); });
  page.on('pageerror', error => report.errors.push(`page: ${error.message}`));
  page.on('request', request => report.requests.push({ method: request.method(), url: request.url(), type: request.resourceType() }));
  page.on('requestfailed', request => report.errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));

  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  await page.waitForTimeout(20);
  const skip = await page.evaluate(() => {
    const active = document.activeElement;
    const style = getComputedStyle(active);
    return { text: active?.textContent?.trim(), outline: `${style.outlineWidth} ${style.outlineStyle} ${style.outlineColor}`, rect: active?.getBoundingClientRect().toJSON() };
  });
  assert(skip.text === 'Skip to main content', 'skip link is not first keyboard target');
  assert(skip.rect.width > 0 && skip.rect.height > 0 && skip.rect.top >= 0, 'focused skip link is not visible');
  assert(skip.outline.startsWith('3px'), 'focused skip link has no designed outline');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  assert((await page.evaluate(() => document.activeElement?.textContent?.trim())) === 'Demo', 'Demo is not reachable in expected keyboard order');
  await page.keyboard.press('Enter');
  await page.waitForURL(`${base}/demo`);
  assert(await page.locator('h1').evaluate(element => element === document.activeElement), 'SPA route did not focus h1');
  await page.keyboard.press('ArrowRight');
  assert((await page.locator('#current-counter').textContent()) === 'FRAME 04 / 06', 'ArrowRight did not move frame');
  await page.keyboard.press('Shift+ArrowRight');
  assert((await page.locator('#current-counter').textContent()) === 'FRAME 06 / 06', 'Shift+ArrowRight did not jump to end');
  const shortcutDownloadPromise = page.waitForEvent('download');
  await page.keyboard.press('e');
  const shortcutSheet = await pngInfo(await shortcutDownloadPromise);
  assert(shortcutSheet.width === 880 && shortcutSheet.height === 560, 'keyboard export dimensions are wrong');
  const reducedMotion = await page.evaluate(() => {
    const durations = [...document.querySelectorAll('*')].map(element => getComputedStyle(element).transitionDuration).filter(value => value && value !== '0s');
    return { matches: matchMedia('(prefers-reduced-motion: reduce)').matches, nonzeroElements: durations.length, uniqueDurations: [...new Set(durations)] };
  });
  assert(reducedMotion.matches, 'reduced motion media query does not match');
  assert(reducedMotion.uniqueDurations.every(value => value.split(',').every(duration => parseFloat(duration) <= 0.01)), 'motion is not reduced');
  report.checks.keyboard = { skip, shortcutSheet, reducedMotion, routeFocus: true };

  await page.getByRole('button', { name: 'Reset demo' }).click();
  assert((await page.locator('#current-counter').textContent()) === 'FRAME 03 / 06', 'demo reset did not restore frame 3');
  const opacityDefaults = await page.locator('[data-output="opacity"]').allTextContents();
  assert(JSON.stringify(opacityDefaults) === JSON.stringify(['28%', '100%', '28%']), 'demo reset did not restore layer defaults');
  const projectDownloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export project' }).click();
  const projectDownload = await projectDownloadPromise;
  const projectStream = await projectDownload.createReadStream();
  const projectChunks = [];
  for await (const chunk of projectStream) projectChunks.push(Buffer.from(chunk));
  const validProjectBytes = Buffer.concat(projectChunks);
  const validEnvelope = JSON.parse(validProjectBytes.toString());
  assert(validEnvelope.project.frames.length === 6, 'project export does not contain six frames');

  const invalidCases = [
    ['bad-json.json', Buffer.from('{')],
    ['bad-version.json', Buffer.from(JSON.stringify({ ...validEnvelope, version: 2 }))],
    ['missing-settings.json', Buffer.from(JSON.stringify({ ...validEnvelope, project: { ...validEnvelope.project, settings: undefined } }))],
    ['bad-opacity.json', (() => { const value = structuredClone(validEnvelope); value.project.settings.previous.opacity = -0.01; return Buffer.from(JSON.stringify(value)); })()],
    ['bad-tint.json', (() => { const value = structuredClone(validEnvelope); value.project.settings.next.tint = 'magenta'; return Buffer.from(JSON.stringify(value)); })()],
    ['bad-current.json', (() => { const value = structuredClone(validEnvelope); value.project.current = 99; return Buffer.from(JSON.stringify(value)); })()],
    ['bad-dimensions.json', (() => { const value = structuredClone(validEnvelope); value.project.frames[0].width += 1; return Buffer.from(JSON.stringify(value)); })()]
  ];
  const invalidResults = [];
  for (const [name, buffer] of invalidCases) {
    await page.locator('#project-input').setInputFiles({ name, mimeType: 'application/json', buffer });
    const status = await page.locator('#viewer-status').textContent();
    const counter = await page.locator('#current-counter').textContent();
    const controls = await page.locator('#frame-strip button').count();
    assert(counter === 'FRAME 03 / 06' && controls === 6, `${name} changed active demo state`);
    assert(/Choose|export/.test(status), `${name} error is not actionable: ${status}`);
    invalidResults.push({ name, status, counter, controls });
  }
  await page.locator('[data-layer="current"] [data-field="opacity"]').focus();
  await page.keyboard.press('Home');
  assert((await page.locator('[data-layer="current"] [data-output="opacity"]').textContent()) === '0%', 'range Home boundary failed');
  await page.locator('#project-input').setInputFiles({ name: 'valid-project.json', mimeType: 'application/json', buffer: validProjectBytes });
  assert((await page.locator('#viewer-status').textContent()) === 'Imported a project with 6 frames.', 'valid project did not recover after invalid cases');
  report.checks.invalidProjects = invalidResults;

  await page.goto(`${base}/`);
  const input = page.locator('#file-input');
  await input.setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image') });
  const invalidFileStatus = await page.locator('#viewer-status').textContent();
  assert(invalidFileStatus.includes('is not a PNG or GIF') && invalidFileStatus.includes('Choose'), 'invalid extension error is not actionable');
  await input.setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('broken') });
  const corruptPngStatus = await page.locator('#viewer-status').textContent();
  assert(corruptPngStatus.includes('Choose another PNG'), 'corrupt PNG error is not actionable');
  await input.setInputFiles({ name: 'broken.gif', mimeType: 'image/gif', buffer: Buffer.from('broken') });
  const corruptGifStatus = await page.locator('#viewer-status').textContent();
  assert(corruptGifStatus.includes('Choose another GIF'), 'corrupt GIF error is not actionable');

  await input.setInputFiles({ name: 'solo-001.png', mimeType: 'image/png', buffer: pngBytes });
  assert((await page.locator('#current-counter').textContent()) === 'FRAME 01 / 01', 'one-frame boundary counter failed');
  assert(await page.locator('#previous-frame').isDisabled(), 'previous should be disabled for one frame');
  assert(await page.locator('#next-frame').isDisabled(), 'next should be disabled for one frame');
  const oneDownloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Export contact sheet/ }).click();
  const oneSheet = await pngInfo(await oneDownloadPromise);
  assert(oneSheet.width === 220 && oneSheet.height === 308, 'one-frame contact sheet dimensions are wrong');
  await page.waitForTimeout(300);
  await page.reload();
  assert((await page.locator('#viewer-status').textContent()) === 'Restored 1 saved frame from this browser.', 'one-frame persistence copy/state failed');

  const files = Array.from({ length: 100 }, (_, index) => ({
    name: `run-${String(100 - index).padStart(3, '0')}.png`, mimeType: 'image/png', buffer: pngBytes
  }));
  await input.setInputFiles(files);
  await page.locator('#viewer-status').waitFor({ state: 'visible' });
  await page.waitForFunction(() => document.querySelector('#viewer-status')?.textContent === 'Loaded 100 frames.', null, { timeout: 30_000 });
  assert((await page.locator('#current-counter').textContent()) === 'FRAME 02 / 100', '100-frame boundary counter failed');
  assert((await page.locator('#frame-strip button').count()) === 100, '100-frame controls missing');
  assert((await page.locator('#frame-strip button').first().getAttribute('aria-label'))?.includes('run-001.png'), 'natural sort first frame failed');
  assert((await page.locator('#frame-strip button').last().getAttribute('aria-label'))?.includes('run-100.png'), 'natural sort last frame failed');
  const largeDownloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Export contact sheet/ }).click();
  const largeSheet = await pngInfo(await largeDownloadPromise);
  assert(largeSheet.width === 880 && largeSheet.height === 6356, '100-frame contact sheet dimensions are wrong');
  report.checks.boundaries = { invalidFileStatus, corruptPngStatus, corruptGifStatus, oneSheet, largeSheet, frameCount: 100 };

  await page.goto(`${base}/`);
  await page.locator('#file-input').setInputFiles({ name: 'real-001.png', mimeType: 'image/png', buffer: pngBytes });
  await page.waitForTimeout(300);
  await page.goto(`${base}/demo`);
  await page.locator('[data-layer="previous"] [data-field="opacity"]').evaluate(inputElement => {
    inputElement.value = '4';
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.getByRole('link', { name: 'Start for real' }).click();
  assert((await page.locator('#viewer-status').textContent()) === 'Restored 1 saved frame from this browser.', 'demo read or overwrote real project');
  assert((await page.locator('#project-name').textContent()) === 'real-001.png', 'real project did not survive demo');
  report.checks.demoBoundary = { restored: true, project: await page.locator('#project-name').textContent() };

  const routes = ['/', '/demo', '/privacy', '/terms', '/definitely-missing'];
  const routeChecks = [];
  for (const route of routes) {
    const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    const axe = await new AxeBuilder({ page }).analyze();
    const serious = axe.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''));
    const outline = await page.locator('h1,h2,h3').evaluateAll(headings => headings.map(heading => ({ level: Number(heading.tagName.slice(1)), text: heading.textContent?.trim() })));
    routeChecks.push({ route, status: response?.status(), title: await page.title(), h1: await page.locator('h1').count(), main: await page.locator('main').count(), serious, outline });
    assert(serious.length === 0, `${route} has serious/critical axe findings`);
    assert((await page.locator('h1').count()) === 1 && (await page.locator('main').count()) === 1, `${route} semantic structure failed`);
  }
  report.checks.routesAndAxe = routeChecks;

  await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  const allOrigins = [...new Set(report.requests.map(item => new URL(item.url).origin))];
  assert(allOrigins.every(origin => origin === base), `third-party request observed: ${allOrigins.join(', ')}`);
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map(database => database.name));
  report.checks.privacy = { requestCount: report.requests.length, origins: allOrigins, databases, iframes: await page.locator('iframe').count(), passwordInputs: await page.locator('input[type=password]').count() };

  await page.screenshot({ path: new URL('live-desktop-demo.png', evidence).pathname, fullPage: true });
  await context.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const mobile = await mobileContext.newPage();
  const mobileErrors = [];
  mobile.on('console', message => { if (message.type() === 'error') mobileErrors.push(message.text()); });
  mobile.on('pageerror', error => mobileErrors.push(error.message));
  await mobile.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  const mobileLayout = await mobile.evaluate(() => ({
    viewport: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    bodyFontSize: getComputedStyle(document.body).fontSize,
    undersized: [...document.querySelectorAll('a[href], button:not(:disabled), input:not(:disabled):not(.sr-only)')].flatMap(element => {
      const rect = element.getBoundingClientRect(); const style = getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) return [];
      return rect.width < 44 || rect.height < 44 ? [{ tag: element.tagName, text: element.textContent?.trim(), width: rect.width, height: rect.height }] : [];
    })
  }));
  assert(mobileLayout.documentWidth === 390, 'mobile horizontal overflow');
  assert(mobileLayout.undersized.length === 0, 'mobile has undersized targets');
  assert(parseFloat(mobileLayout.bodyFontSize) >= 16, 'mobile body text is below 16px');
  const mobileAxe = await new AxeBuilder({ page: mobile }).analyze();
  const mobileSerious = mobileAxe.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''));
  assert(mobileSerious.length === 0, 'mobile has serious/critical axe findings');
  await mobile.screenshot({ path: new URL('live-mobile-demo.png', evidence).pathname, fullPage: true });
  report.checks.mobile = { ...mobileLayout, serious: mobileSerious, errors: mobileErrors };
  await mobileContext.close();

  assert(report.errors.filter(error => !error.includes('status of 404')).length === 0, `browser errors: ${report.errors.join('; ')}`);
  report.result = 'PASS';
} catch (error) {
  report.result = 'FAIL';
  report.failure = error instanceof Error ? `${error.message}\n${error.stack}` : String(error);
  throw error;
} finally {
  await writeFile(new URL('manual-live.json', evidence), JSON.stringify(report, null, 2));
  await browser.close();
}
