# Handoff — perfection-loop polish 3

- Work order: `onion-next-frame-polish-3`
- Base reviewed commit: `1cbdf44df9aef2f1ea8462f68f48a5a1155d31b5`
- Product repair commit: `428312dff58050bf159f280922d6edee410fe72b`
- Live target: <https://onion-next-frame.sociobot.in>
- Deployment: Azure Static Web Apps `8aadcc2d-f51d-4278-94bc-7b6ed22c2f94`
- Result: **PASS — no review finding remains open.**

## What changed

- Reworked `?demo=1` and `/demo` so the persistent demo banner sits immediately above a seeded, operable frame comparison. Frame 03, the canvas, frame counter, and previous/next controls are visible at both 390×844 and 1440×900 without scrolling.
- Made the header truthful: it says **Online** until `navigator.serviceWorker.ready`, then **Ready offline**; it changes to **Offline mode** when disconnected.
- Added testable `scope-boundaries` and `demo-first-viewport` claims. Every claim now has one tagged observable browser test.
- Restored browser-history scroll and focused control state. New forward navigation still starts at the destination heading.
- Put the shared product shell, metadata, legal links, favicon, and **Return home** action on real 404 and offline fallback pages.
- Rewrote every review-3 copy issue in the app and README. The copy audit and a browser/README regression test keep the terminology consistent.
- Tightened the desktop workbench hero so all three price, offline, and privacy facts remain in the 1440×900 first viewport.
- Advanced the PWA cache generation to `onion-next-frame-v8`.

## Verification

- Fresh remote clone: `/tmp/onion-next-frame-polish-3-clean` at `428312dff58050bf159f280922d6edee410fe72b`; `npm ci` passed with 0 audit vulnerabilities.
- All 15 commands in `.factory/claims.json` passed independently from that clean clone.
- Clean clone: `npm run build` passed; `npm test` passed 43/43.
- Current workspace: `npm run build` passed; `npm test` passed 44/44 after the copy-regression addition.
- Live: `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test` passed 44/44 against the deployed product after the final copy regression was added.
- Live link crawl: the six unique rendered destinations on `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and the 404 page returned 200 (the unknown page itself returned its expected 404).
- `verify-url.sh` live report: [verify.json](evidence/polish-3-live/verify.json) — HTTP 200, title, `lang=en`, one `h1`, `<main>`, zero missing image alternatives, zero unlabeled buttons, and no console errors.
- Integrated Playwright Axe checks on `/`, both demo URLs, Privacy, Terms, and a real 404 found zero serious or critical violations. The standalone Axe CLI could not launch the container's Chromium; the repository’s pinned Playwright Axe integration is the authoritative accessibility run.
- Local Lighthouse: [lighthouse-mobile.json](evidence/polish-3-local/lighthouse-mobile.json) — Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.36 s, CLS 0.000024, TBT 0 ms.
- Local manual/offline/mobile evidence: [manual-audit.json](evidence/polish-3-local/manual-audit.json), [demo desktop](evidence/polish-3-local/demo-desktop.png), [demo mobile](evidence/polish-3-local/demo-mobile.png). The live equivalents are in [polish-3-live](evidence/polish-3-live/).
- Bundle: emitted JavaScript 38.80 KB raw / 13.20 KB gzip; CSS 19.16 KB raw / 4.81 KB gzip. The initial JavaScript stays below the 200 KB static-product limit.

## Run and deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh onion-next-frame /work/repo/dist
```

## Known gaps

None in the released product. The only tool limitation was the standalone Axe CLI’s unavailable Chrome runtime; the pinned Playwright Axe suite passed on the installed browser.
