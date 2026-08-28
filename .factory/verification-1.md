# Onion Next Frame — independent verification 1

**Result: FAIL — release blocked by live static-asset cache policy.**

Verified on 2026-08-28 against candidate commit
`b1b88469f1965b8cc7e6bce558ce3387af45face` and
`https://onion-next-frame.sociobot.in`.

## Scope and deployment identity

- Clean checkout was already at the requested candidate commit; `npm ci` completed.
- The candidate differs from deployed application commit `c886dbcf6b315f17951035083867a9296f7f7111` only in handoff/evidence documentation. A fresh production build of the candidate produced byte-identical live `index.html`, `assets/index-jR_T1Hau.js`, and `assets/index-DIKJgCi2.css` (SHA-256 checked).
- The product has no server-side endpoint, account, or sign-in flow. Rate-limit and Entra checks are not applicable.

## First-read test

Cold live visit: the page says it compares the frames before and after, names pixel artists working between drawings as the audience, and shows **Try it with sample data** on the first screen. Its adjacent explanation says it loads a six-frame run cycle. This enters `/demo` in one click. The demo shows the persistent “Demo — sample data, nothing is saved” banner with Reset demo and Start for real. **PASS.**

## Automated evidence

- Every required claim command in `.factory/claims.json` was run separately from the demo entry point and passed: `demo-sandbox`, `sequence-import`, `three-layer-preview`, `contact-sheet`, `project-transfer`, `privacy-local`, `offline-reload`, `local-restore`, and `free-use` (each 1/1).
- Full local suite: `npx playwright test --output=/tmp/onion-default-results` passed **19/19**; `.last-run.json` reports `status: passed` with no failed tests.
- Exact build: `npm run build` passed. Output JS is 34.82 KB raw / 12.12 KB gzip; CSS is 17.87 KB raw / 4.67 KB gzip, within the static-PWA JS and CSS budgets. The build emits `dist/`.
- Full live suite: `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npx playwright test --output=/tmp/onion-live-results` passed **19/19**; `.last-run.json` reports `status: passed` with no failed tests.
- `verify-url.sh` against the live URL passed: HTTPS 200, zero console errors, title, `lang`, one `h1`, `main`, labelled buttons, and image alt text all present. Evidence: `.factory/evidence/verification-live/verify.json`.
- The Playwright Axe integration found no serious or critical issues on `/`, `/demo`, `/privacy`, `/terms`, or the styled missing-frame route. The live suite also passed keyboard/history/focus and 390×844 no-horizontal-scroll coverage. Fresh mobile evidence is `.factory/evidence/verification-live/mobile-demo.png`.
- Manual keyboard smoke check: Tab reaches Skip to main content; Enter moves focus to `h1#page-title`. ArrowRight moves the demo from frame 03 to frame 04. Reduced-motion, focus styling, labels, live status, and the mobile demo layout were visually checked.
- Manual invalid-input recovery: selecting `not-a-frame.txt` announces “not-a-frame.txt is not a PNG or GIF. Choose numbered PNG or GIF files.” Normal PNG and animated-GIF imports, layer controls, contact-sheet export, project transfer, real-project restore, clear/reset, and offline reload are covered by the passing claims.
- Live PWA check: after service-worker readiness, cache `onion-next-frame-v2` was present; an offline reload of `/demo` showed `FRAME 03 / 06` and “Loaded 6 sample frames. Nothing is saved.”
- Privacy: complete demo-flow claim interception allowed only same-origin requests; source and live CSP permit only self for connections. No analytics, ads, uploads, or third-party font/script endpoints were found. `npm audit --omit=dev` returned 0 vulnerabilities.
- Live headers include HTTPS/HSTS, CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive Permissions-Policy. No page or console errors were observed.

## Defects

### High — release blocker: hashed static assets are not immutable cached

The live response for both `/assets/index-jR_T1Hau.js` and
`/assets/index-DIKJgCi2.css` is:

```
Cache-Control: public, must-revalidate, max-age=30
```

These are content-hashed assets, but the production `staticwebapp.config.json` has no asset-cache route/header. This violates the PWA performance contract requiring long-lived immutable caching for hashed assets and makes repeat visits revalidate core CSS and JS every 30 seconds. Configure the static host/SWA route for hashed `/assets/*` content with a long `max-age` and `immutable`, then redeploy and recheck the response headers.

### Informational

An independent Lighthouse 12.2.0 mobile run was attempted with the supplied Playwright Chromium. The browser target crashed while Lighthouse collected the trace, so it did not produce a valid fresh score; this was a Lighthouse/Chrome-runner failure, not a page console error. Bundle budgets, live accessibility tests, and the manual mobile check above completed successfully.

## Verdict

All functional, privacy, accessibility, demo, offline, and deployment-identity checks pass. The candidate is nevertheless **FAIL** until the live immutable cache policy defect is corrected and independently reverified.
