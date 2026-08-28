# Onion Next Frame — repair handoff

Work order: `onion-next-frame-repair-1`

Base candidate: `a50284c2fbbd36693fc8b22d90e012cfd6a83dbc`

Completed: 2026-08-28

## Repair made

The deployed page returned `font-src 'self'`, while Vite had inlined a few small Fontsource subsets as `data:font/...` CSS URLs. A fresh live Chromium visit reproduced two blocked-font CSP console errors.

`vite.config.ts` now sets `build.assetsInlineLimit: 0`. Every Fontsource WOFF/WOFF2 subset is emitted as a hashed file under `/assets/`, so fonts remain self-hosted and the existing strict `font-src 'self'` policy is unchanged. The production preview now serves the same CSP as `staticwebapp.config.json`, making the browser enforce it before deployment. The service-worker cache name is `onion-next-frame-v2`, so installed copies replace the stale cached shell.

## Regression coverage

- `strict CSP loads only same-origin emitted font assets without console errors` loads the production build under the real CSP, checks the preview and deployment policy match, waits for `document.fonts`, asserts font requests are same-origin rather than `data:`, and fails on any console error.
- `service worker installs the current cache generation for updates` checks the v2 cache after registration.
- `PLAYWRIGHT_BASE_URL=<url> npm test -- --grep "strict CSP"` runs the same CSP/console test against a live deployment without starting a local server.

## Verification before deployment

Run from a clean checkout:

```sh
npm ci
npm run build
npm test
npm audit --omit=dev
```

Results:

- Exact clean build command `npm ci && npm run build`: passed. `dist/index.html` exists.
- Built CSS contains no `data:font/` URLs; emitted WOFF2 assets are normal same-origin `/assets/*.woff2` files. JS is 34.82 KB raw / 12.12 KB gzip; CSS is 17.87 KB raw / 4.67 KB gzip.
- `npm test`: **19 passed** in Chromium. This includes all nine tagged product claims, keyboard/back-navigation, the 390×844 mobile layout, offline reload, service-worker cache generation, privacy network interception, and the CSP font regression.
- The route tests run Axe on `/`, `/demo`, `/privacy`, `/terms`, and the 404 route: no serious or critical findings.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ .factory/evidence/repair-local`: passed with zero console errors; title, `lang`, one `h1`, `main`, image alt text, and button labels passed.
- `npm audit --omit=dev`: 0 vulnerabilities.
- Mobile Lighthouse against the production preview at `/demo`: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP **1.4 s**, LCP **1.4 s**, CLS **0.001**.

Local verification artefacts are in `.factory/evidence/repair-local/`.

## Deployment

Deploy class remains **static**. Build output is `dist/`, deployed with:

```sh
/opt/fleet/lib/deploy-static.sh onion-next-frame dist
```

Deployment completed successfully with commit `c886dbcf6b315f17951035083867a9296f7f7111`.

Live verification at `https://onion-next-frame.sociobot.in`:

- `/opt/fleet/lib/deploy-static.sh onion-next-frame dist`: succeeded (Azure Static Web Apps deployment `0d5a2c09-c669-47b3-8eeb-762872236e68`).
- `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test`: **19 passed**. This repeats the claims, browser, keyboard, 390px mobile, Axe, offline/update, privacy, identity, and CSP tests against production.
- The live CSP regression confirmed `font-src 'self'` is still present, each loaded font is a same-origin asset, and the console is empty.
- `/opt/fleet/lib/verify-url.sh https://onion-next-frame.sociobot.in/ .factory/evidence/repair-live`: passed with **zero console errors**; title, language, one `h1`, `main`, image alt text, and button labels passed.
- The live response is HTTPS 200 and retains `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin`.

Live verification artefacts are in `.factory/evidence/repair-live/`.

## Known limits

- The product accepts PNG and GIF only; it does not decode APNG, video, or editor project formats.
- Large image sequences depend on browser memory and IndexedDB quota; source files remain the durable backup.

---

# Independent verification 1 — FAIL

Verified 2026-08-28 for candidate `b1b88469f1965b8cc7e6bce558ce3387af45face` at `https://onion-next-frame.sociobot.in`.

The result is **FAIL**. The clean-install build and both complete local/live Chromium suites passed 19/19; every listed claim passed independently, as did live Axe, offline reload, keyboard/mobile, privacy, CSP, and byte-for-byte deployment-identity checks. The release is blocked because the deployed hashed JS and CSS use `Cache-Control: public, must-revalidate, max-age=30` rather than long-lived immutable caching. This violates the PWA cache policy. See `.factory/verification-1.md` for exact commands, evidence, severity, and the required remediation.
