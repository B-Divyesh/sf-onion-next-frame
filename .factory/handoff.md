# Onion Next Frame — repair handoff

Work order: `onion-next-frame-repair-2`

Verifier report: `84d8438c78cd1126979d52bb8dee01347f0f348c`

Candidate repaired: `b1b88469f1965b8cc7e6bce558ce3387af45face`

Completed: 2026-08-28

## Release blocker repaired

The independent verifier found one release blocker: live content-hashed JavaScript and CSS returned `Cache-Control: public, must-revalidate, max-age=30`.

`public/staticwebapp.config.json` now assigns `/assets/*` this production policy:

```text
Cache-Control: public, max-age=31536000, immutable
```

The Vite production preview mirrors that path-specific policy. This makes the deployment behavior testable before release without applying immutable caching to HTML. The regression test discovers the emitted hashed JS and CSS, fetches each file, and asserts `public`, at least one year of `max-age`, `immutable`, and no `must-revalidate`. It also checks the checked-in Azure Static Web Apps rule.

The clean install exposed Vite development-server advisories that do not affect the static runtime. Vite was pinned from 7.1.3 to 7.3.6; `npm audit` now reports zero vulnerabilities.

No product behavior, researched scope, visual design, storage format, claim, or deployment class changed.

## Local verification

Run from a clean checkout:

```sh
npm ci
npm run build
npm test
npm audit
```

Results:

- `npm ci`: passed from the lockfile; 28 packages installed and zero vulnerabilities reported.
- `npm run build`: passed TypeScript checking and the Vite production build; `dist/index.html` exists.
- `npm test`: **20/20 passed** in Chromium 140. This covers all nine claim tests, import/export, privacy interception, real-project restore, offline reload, service-worker update cache, keyboard/history/focus, the 390×844 layout, CSP, all routes, and the cache regression.
- Every command in `.factory/claims.json` was also run independently from the demo entry point; all nine passed 1/1.
- Axe found no serious or critical issues on `/`, `/demo`, `/privacy`, `/terms`, or the styled 404 route.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ .factory/evidence/repair-2-local` passed: HTTP 200, zero console errors, title, `lang`, one `h1`, `main`, alt text, and button labels.
- Vite preview returned `Cache-Control: public, max-age=31536000, immutable` for the emitted hashed JS and CSS.
- Bundle sizes: JS 34.82 KB raw / 12.12 KB gzip; CSS 17.87 KB raw / 4.67 KB gzip.
- Lighthouse 12.2.0 desktop: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 0.3 s, CLS 0.003, TBT 0 ms.
- Lighthouse 12.2.0 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.4 s, CLS 0.001, TBT 0 ms.

Local evidence is in `.factory/evidence/repair-2-local/`.

There is no package/consumer surface, backend, account, payment, rate limit, or Entra identity flow for this static local-first PWA, so those checks are not applicable.

## Deployment and live verification

Deploy class remains **static**, with `dist/` as the artifact:

```sh
/opt/fleet/lib/deploy-static.sh onion-next-frame dist
```

Final deployment `39036bf5-bcc3-4c15-9801-413e3afcbc54` completed successfully at `https://onion-next-frame.sociobot.in` from application commit `2175ddc`.

- Live hashed JS and CSS return HTTP 200 with `Cache-Control: public, max-age=31536000, immutable`.
- `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test`: **20/20 passed**, including the exact cache regression, all nine claims, desktop/390px browser behavior, keyboard, Axe, privacy, offline/update, CSP, and route checks.
- Live `verify-url.sh` passed with zero console errors and all structural checks.
- Local and live SHA-256 values match exactly for `index.html`, `index-CFni8ZHK.js`, and `index-DIKJgCi2.css`.
- Live response policy retains HTTPS/HSTS, CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and restrictive Permissions-Policy headers.
- Live mobile Lighthouse 12.2.0: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.2 s, CLS 0.001, TBT 0 ms.

Live evidence is in `.factory/evidence/repair-2-live/`.

## Known limits

- The product accepts PNG and GIF only; it does not decode APNG, video, or editor project formats.
- Large image sequences depend on browser memory and IndexedDB quota; source files remain the durable backup.

No release-blocking gaps remain from the independent verification report.
