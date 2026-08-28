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

Run the live CSP regression and `verify-url.sh` after deployment. Append the resulting evidence here.

## Known limits

- The product accepts PNG and GIF only; it does not decode APNG, video, or editor project formats.
- Large image sequences depend on browser memory and IndexedDB quota; source files remain the durable backup.
