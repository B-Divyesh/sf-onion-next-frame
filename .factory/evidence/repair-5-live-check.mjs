import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const base = 'https://onion-next-frame.sociobot.in';
const dist = join(process.cwd(), 'dist');
const output = '.factory/evidence/repair-5-live/identity.json';

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  }));
  return nested.flat();
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

const files = (await filesUnder(dist))
  .filter((file) => !file.endsWith('staticwebapp.config.json'))
  .sort();
const mismatches = [];
const identities = [];
for (const file of files) {
  const path = `/${relative(dist, file)}`;
  const local = await readFile(file);
  const response = await fetch(`${base}${path}`, { headers: { 'Cache-Control': 'no-cache' } });
  const live = Buffer.from(await response.arrayBuffer());
  const item = { path, status: response.status, localSha256: sha256(local), liveSha256: sha256(live) };
  identities.push(item);
  if (!response.ok || item.localSha256 !== item.liveSha256) mismatches.push(item);
}

const mainResponse = await fetch(`${base}/`, { headers: { 'Cache-Control': 'no-cache' } });
const securityHeaders = Object.fromEntries([
  'cache-control',
  'content-security-policy',
  'permissions-policy',
  'referrer-policy',
  'strict-transport-security',
  'x-content-type-options'
].map((name) => [name, mainResponse.headers.get(name)]));

const imagePaths = [
  '/assets/hero-640.webp',
  '/assets/hero-1200.webp',
  '/assets/onion-next-frame-og.webp'
];
const imageCache = {};
for (const path of imagePaths) {
  const response = await fetch(`${base}${path}`, { method: 'HEAD' });
  imageCache[path] = response.headers.get('cache-control');
}
const hashedAsset = identities.find((item) => /^\/assets\/index-.+\.js$/.test(item.path));
const hashedResponse = await fetch(`${base}${hashedAsset.path}`, { method: 'HEAD' });
const missingResponse = await fetch(`${base}/definitely-missing`, { headers: { Accept: 'text/html' } });
const serviceWorker = await (await fetch(`${base}/sw.js`, { headers: { 'Cache-Control': 'no-cache' } })).text();

const result = {
  base,
  checkedFiles: identities.length,
  mismatches,
  indexSha256: identities.find((item) => item.path === '/index.html')?.liveSha256,
  emittedJavaScript: hashedAsset,
  serviceWorkerCache: serviceWorker.match(/onion-next-frame-v\d+/)?.[0],
  mainStatus: mainResponse.status,
  securityHeaders,
  imageCache,
  hashedAssetCache: hashedResponse.headers.get('cache-control'),
  missingDocumentStatus: missingResponse.status
};

await writeFile(output, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
if (
  mismatches.length
  || mainResponse.status !== 200
  || missingResponse.status !== 404
  || result.serviceWorkerCache !== 'onion-next-frame-v5'
  || Object.values(imageCache).some((value) => value !== 'public, max-age=0, must-revalidate')
  || result.hashedAssetCache !== 'public, max-age=31536000, immutable'
) process.exitCode = 1;
