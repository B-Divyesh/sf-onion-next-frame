# Onion Next Frame — build handoff

Work order: `onion-next-frame-build-1`

Completed: 2026-08-28

Version: 1.0.0

## What shipped

- A Vite and TypeScript offline PWA at `/`, with real `/demo`, `/privacy`, `/terms`, and styled 404 routes.
- Natural-order multi-PNG import and animated GIF frame decoding. All decoding happens in the browser.
- A layered canvas with previous, current, and next drawings. Each layer has visibility, opacity, tint colour, and tint enablement controls.
- Frame scrubber, numbered frame strip, previous/next buttons, and Left/Right keyboard navigation. Shift jumps to either end.
- PNG contact-sheet export with every source frame and a marker for the selected frame.
- Portable JSON project export and import.
- IndexedDB persistence for the latest real project. Clear sequence removes it.
- An isolated `/demo` with six in-memory sample frames, reset, and an explicit exit to real mode.
- A versioned service worker, app-shell/runtime caching, offline fallback, install manifest, icons, and update prompt.
- Product-specific pixel/demoscene design, self-hosted fonts, generated original hero art, responsive WebP derivatives, and a 1200×630 social image.
- Plain privacy and terms pages, MIT license, metadata, canonical links, sitemap, robots file, security headers, and deployment fallback configuration.

## Verification

Run from a clean checkout:

```sh
npm install
npm test
npm run build
```

Results in this worker:

- `npm test`: **17 passed** in Chromium. This includes every tag in `.factory/claims.json`.
- Offline test: a fresh `/demo` visit, controlled reload, offline reload, and live six-frame viewer all passed.
- IndexedDB restore, PNG natural sorting, two-frame GIF decoding, contact-sheet PNG, and JSON round trip all passed.
- Keyboard route focus, browser back, Arrow navigation, and a 390×844 viewport all passed.
- Axe: no serious or critical findings on home, demo, privacy, terms, or the SPA 404.
- `/opt/fleet/lib/verify-url.sh`: no console errors; title, `lang`, one `h1`, `main`, image alt text, and button labels passed.
- `npm audit --omit=dev`: 0 vulnerabilities.
- `npm run build`: passed; `dist/index.html` is present.

Production asset sizes:

- JavaScript: 34.8 KB raw / 12.1 KB gzip.
- CSS: 24.6 KB raw / 10.2 KB gzip.
- Self-hosted font files emitted by Vite: about 88 KB total.
- Mobile hero WebP: 12.8 KB. Desktop hero and social image: about 30 KB each.

Lighthouse 13 mobile run against the production preview at `/demo`:

- Performance: **100**
- Accessibility: **100**
- Best practices: **100**
- SEO: **100**
- FCP: **1.4 s**
- LCP: **1.5 s**
- Total blocking time: **0 ms**
- CLS: **0.001**
- INP: not available in this lab run because there was no measured interaction.

Evidence is in `.factory/evidence/`.

## Known limits

- The product accepts PNG and GIF only, matching the brief. It does not decode APNG, video, or editor project formats.
- Large image sequences depend on the browser's memory and IndexedDB quota. Source files remain the durable backup.
- Production hosting headers and the custom 404 are configured but were checked through the local static preview, not a deployed Azure site.

## Next steps

- Deploy `dist/` through the factory pipeline.
- Run a post-deploy crawl and Lighthouse check at `https://onion-next-frame.sociobot.in`.
- Watch whether repeat imports meet the brief's 14-day adoption measure. No analytics were added, so any measurement should remain privacy-preserving and separate from artwork.
