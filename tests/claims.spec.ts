import { expect, test } from '@playwright/test';
import path from 'node:path';

const fixtures = path.join(process.cwd(), 'tests', 'fixtures');

test('@claim:demo-sandbox sample demo is ready and does not save', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.locator('#current-counter')).toContainText('FRAME');
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  expect(databases).not.toContain('onion-next-frame');
  await page.locator('[data-layer="previous"] [data-field="opacity"]').evaluate((input: HTMLInputElement) => {
    input.value = '4';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('[data-layer="previous"] [data-output="opacity"]')).toHaveText('28%');
});

test('@claim:sample-six-frame-demo loads the promised six-frame run cycle', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.locator('#current-counter')).toHaveText('FRAME 03 / 06');
  await expect(page.locator('#frame-strip button')).toHaveCount(6);
  await expect(page.locator('#viewer-status')).toHaveText('Loaded 6 sample frames. Nothing is saved.');
});

test('@claim:sequence-import imports numbered PNG files and an animated GIF', async ({ page }) => {
  await page.goto('/');
  const input = page.locator('#file-input');
  await input.setInputFiles([
    path.join(fixtures, 'frame-10.png'),
    path.join(fixtures, 'frame-2.png')
  ]);
  await expect(page.locator('#viewer-status')).toHaveText('Loaded 2 frames.');
  await expect(page.locator('#project-name')).toContainText('frame-2.png');
  await expect(page.locator('#frame-strip button').nth(0)).toHaveAttribute('aria-label', 'Show frame 1: frame-2.png');
  await expect(page.locator('#frame-strip button').nth(1)).toHaveAttribute('aria-label', 'Show frame 2: frame-10.png');
  await input.setInputFiles(path.join(fixtures, 'two-frame.gif'));
  await expect(page.locator('#viewer-status')).toHaveText('Loaded 2 frames.');
  await expect(page.locator('#project-name')).toContainText('two-frame-01.png');
});

test('a corrupt PNG gives an actionable recovery message and a valid import still works', async ({ page }) => {
  await page.goto('/');
  const input = page.locator('#file-input');
  await input.setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('not a PNG') });
  await expect(page.locator('#viewer-status')).toHaveText('broken.png could not be opened as a PNG. Choose another PNG or export it again from the source editor.');
  await input.setInputFiles(path.join(fixtures, 'frame-2.png'));
  await expect(page.locator('#viewer-status')).toHaveText('Loaded 1 frame.');
});

test('@claim:three-layer-preview shows and adjusts three neighbour layers', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('[data-layer]')).toHaveCount(3);
  await expect(page.locator('#onion-canvas')).toHaveAttribute('aria-label', /previous 2, next 4/);
  const before = await page.locator('#onion-canvas').screenshot();
  await page.locator('[data-layer="current"] [data-field="opacity"]').evaluate((input: HTMLInputElement) => {
    input.value = '0';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(100);
  const after = await page.locator('#onion-canvas').screenshot();
  expect(after.equals(before)).toBeFalsy();
});

test('@claim:contact-sheet exports every frame as one PNG', async ({ page }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Export contact sheet/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('onion-next-frame-contact-sheet.png');
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const file = Buffer.concat(chunks);
  expect(file.subarray(1, 4).toString()).toBe('PNG');
  expect(file.byteLength).toBeGreaterThan(1_000);
  await expect(page.locator('#viewer-status')).toHaveText('Exported a contact sheet with 6 frames.');
});

test('@claim:project-transfer exports and imports a project JSON file', async ({ page }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export project' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const file = Buffer.concat(chunks);
  const parsed = JSON.parse(file.toString());
  expect(parsed.format).toBe('onion-next-frame');
  expect(parsed.project.frames).toHaveLength(6);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.locator('#project-input').setInputFiles({ name: 'moth-project.json', mimeType: 'application/json', buffer: file });
  await expect(page.locator('#viewer-status')).toHaveText('Imported a project with 6 frames.');
});

test('@claim:privacy-local keeps artwork requests on the same origin', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.locator('[data-layer="next"] [data-field="opacity"]').evaluate((input: HTMLInputElement) => {
    input.value = '40';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(100);
  expect(requests.length).toBeGreaterThan(0);
  const pageOrigin = new URL(page.url()).origin;
  expect(requests.every((url) => new URL(url).origin === pageOrigin)).toBeTruthy();
  expect(await page.locator('iframe').count()).toBe(0);
  expect(await page.locator('input[type="password"]').count()).toBe(0);
});

test('@claim:offline-reload works offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect(page.locator('#current-counter')).toHaveText('FRAME 03 / 06');
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Compare the frames before and after');
  await expect(page.locator('#current-counter')).toHaveText('FRAME 03 / 06');
  await expect(page.locator('#network-state')).toHaveText('Offline mode');
});

test('@claim:local-restore restores the latest real sequence after reload', async ({ page }) => {
  await page.goto('/');
  await page.locator('#file-input').setInputFiles([
    path.join(fixtures, 'frame-10.png'),
    path.join(fixtures, 'frame-2.png')
  ]);
  await expect(page.locator('#viewer-status')).toHaveText('Loaded 2 frames.');
  await page.waitForTimeout(300);
  await page.reload();
  await expect(page.locator('#viewer-status')).toHaveText('Restored 2 saved frames from this browser.');
  await expect(page.locator('#current-counter')).toHaveText('FRAME 02 / 02');
});

test('@claim:free-use has no payment or account gate', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.fact-list li').filter({ hasText: 'Free to use' })).toBeVisible();
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
  await expect(page.locator('a[href*="buy"], a[href*="checkout"], a[href*="login"]')).toHaveCount(0);
});
