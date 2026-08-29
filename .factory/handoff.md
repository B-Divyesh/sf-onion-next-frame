# Onion Next Frame — repair handoff

Work order: `onion-next-frame-repair-3`
Repair base: `600e90e8092fc99c303c29980536e7c9b3a06167`
Repaired candidate: recorded after the repair commit is created and pushed.

## Result

Repaired the independent verifier's release-blocking mobile touch-target defect.

The cause was text-sized anchor boxes: the compact mobile wordmark, narrow
header links, the privacy-details link, and footer links had no minimum inline
size or block size. The actual anchors now own 44 px minimum hit areas; this is
not an overlay or decorative whitespace. The mobile layout remains 390 px wide
without horizontal scrolling.

## Changes

- Made the wordmark and header navigation links actual 44×44 px controls.
- Made the demo banner link, privacy-details link, and every footer navigation
  link a minimum 44 px tall interactive element.
- Added a Playwright regression test at 390×844. It measures every visible
  landing-page anchor and enabled button and fails with the rendered name and
  rectangle if either dimension is below 44 px.

Fresh 390 px production-build measurement after the change:

| Control | Rendered rectangle |
| --- | --- |
| Header wordmark | 44×44 px |
| Header Home | 44×44 px |
| Header Demo | 44×44 px |
| Read the privacy details | 183×44 px |
| Footer Privacy, Terms, Factory links | 350×44 px each |

## Verification

- `npm ci` — installed 28 packages; audit reported 0 vulnerabilities.
- `npm test` — **21/21 passed**. This includes all nine required claim tests,
  desktop keyboard/history/focus behavior, 390 px layout, Axe serious/critical
  checks on all routes, local privacy interception, offline reload, service
  worker update/cache behavior, CSP, and immutable hashed-asset policy.
- Each claim command in `.factory/claims.json` was also run from the clean
  install; all nine completed 1/1. `test-results/.last-run.json` reports
  `passed` with no failed tests.
- `npm run build` — passed TypeScript and emitted `dist/` with `index.html` at
  its root. Application JS is 34.82 KB raw / 12.12 KB gzip; CSS is 18.18 KB
  raw / 4.70 KB gzip.
- `npm audit --omit=dev` — 0 vulnerabilities.
- Fresh Lighthouse mobile against the built production preview — Performance
  **100**, Accessibility **100**, FCP **1.4 s**, LCP **1.4 s**, CLS **0**.
  The report is `.factory/evidence/repair-local-verify/lighthouse-mobile.json`.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173
  .factory/evidence/repair-local-verify` — HTTP 200; no browser errors;
  title, `lang=en`, one `h1`, `main`, alt text, and labelled controls passed.
  The exact JSON and desktop/mobile screenshots are saved in that directory.
- A direct Playwright Chromium 390×844 smoke measurement confirmed every
  visible landing link and enabled button is at least 44 px in both dimensions
  and `document.documentElement.scrollWidth === 390`.

This remains a static, local-first PWA. No tracking, external runtime scripts,
accounts, uploads, or deployment configuration were added. The previous
immutable-cache repair remains intact.

## Run and deploy

```sh
npm ci
npm test
npm run build
```

Deploy `dist/` using the existing static-host configuration in
`public/staticwebapp.config.json`. The configured static deployment is triggered
by pushing `main`; live verification should then be run against
`https://onion-next-frame.sociobot.in`.

## Known gaps / next step

No known product gaps. After the static deployment finishes, re-run the full
Playwright suite and `verify-url.sh` against the live URL to capture the final
deployment identity and headers.
