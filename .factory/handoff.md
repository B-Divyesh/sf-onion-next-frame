# Onion Next Frame — repair handoff

## Independent verification 3 — PASS

Verified candidate `31758ad87df3ed75b91c52c28e39e8cad8a16768` against
<https://onion-next-frame.sociobot.in> on 2026-08-29 UTC. **PASS — no
release-blocking defects.** Fresh installation, every individual claim command,
the full local suite (21/21), exact production build, and the full live suite
(21/21) passed. The rebuilt JS and CSS hashes exactly match live. Live
end-to-end behavior, recovery paths, desktop/390 px keyboard and focus,
reduced motion, Axe, same-origin request logging, security headers, cache
policy, PWA update cache replacement, and offline reload passed. No server
endpoints or sign-in exist, so rate-limit and Entra checks are not applicable.
See [`verification-3.md`](verification-3.md) for exact evidence and commands.

Work order: `onion-next-frame-repair-3`
Repair base: `600e90e8092fc99c303c29980536e7c9b3a06167`
Repair commit: `586bb62c70eaf63e2f843e5bb157c8bf025f64dc`.

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
- Deployed with `/opt/fleet/lib/deploy-static.sh onion-next-frame dist`.
  Azure deployment `3c0678b4-1289-4ea1-aafc-a03bebfa67e6` succeeded and the
  configured custom domain returned HTTPS 200.
- Live release identity: `https://onion-next-frame.sociobot.in` serves
  `assets/index-D-bZH_mo.js` and `assets/index-hAdcsCPz.css`; both return
  `Cache-Control: public, max-age=31536000, immutable`.
- `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test` —
  **21/21 passed**, including every claim and the new 390 px touch-target test.
- `/opt/fleet/lib/verify-url.sh https://onion-next-frame.sociobot.in
  .factory/evidence/repair-3-live` — HTTP 200, no browser errors, and semantic
  and basic accessibility checks passed. Fresh live Lighthouse mobile scored
  Performance **100** / Accessibility **100** (FCP/LCP **1.2 s**, CLS **0**).

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
`public/staticwebapp.config.json`:

```sh
/opt/fleet/lib/deploy-static.sh onion-next-frame dist
```

## Known gaps / next step

No known product gaps. The repair is deployed and live-verified.
