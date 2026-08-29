# Onion Next Frame — independent verification 10

**Result: PASS**

- Candidate commit: `a93b63818c3674b5b06a6df7d99af7541d449317`
- Live URL: <https://onion-next-frame.sociobot.in>
- Demo URL: <https://onion-next-frame.sociobot.in/?demo=1>
- Verified: 2026-08-29 UTC
- Work order: `onion-next-frame-verify-10`
- Product-code changes by verifier: none

## Release gates

I began from the supplied clean checkout. After `npm ci` (28 packages; `npm audit` reported 0 vulnerabilities), `.factory/claims.json` was present and I invoked each of its 15 literal `npm test -- --grep @claim:<id>` commands separately. Every command passed against the local demo entry point. The complete suite then passed locally and again against the live origin: **45/45**, with `test-results/.last-run.json` reporting `{"status":"passed","failedTests":[]}` for the live run. `npm run build` passed (`tsc --noEmit` plus Vite) and produced `dist/`. There is no repository lint script.

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS |
| `sample-six-frame-demo` | PASS |
| `demo-first-viewport` | PASS |
| `sequence-import` | PASS |
| `scope-boundaries` | PASS |
| `drag-drop-import` | PASS |
| `three-layer-preview` | PASS |
| `contact-sheet` | PASS |
| `keyboard-shortcuts` | PASS |
| `project-transfer` | PASS |
| `privacy-local` | PASS |
| `offline-reload` | PASS |
| `local-restore` | PASS |
| `start-for-real` | PASS |
| `free-use` | PASS |

## Cold first read

A new browser context opened the live root cold. The first screen says **“Compare the frames before and after”**, explains **“For pixel artists checking motion between drawings without changing their main editor,”** and presents a visible one-click **“Try it with sample data”** action with **“Loads a 6-frame run cycle.”** It therefore answers what it does, for whom, and what to click first in plain words. The action opens `/?demo=1`, where the persistent **“Demo — sample data, nothing is saved”** banner includes **Reset demo** and **Start for real**. The first-read and demo-sandbox gates pass.

## End-to-end and recovery checks

- The live demo began at frame 03/06. Arrow Right moved to 04/06, Shift+Right reached 06/06, and `E` downloaded `onion-next-frame-contact-sheet.png`.
- The tested flows cover natural ordering of out-of-order numbered PNGs, animated GIF frame extraction, drag/drop, independent previous/current/next opacity and tint, contact-sheet export, project JSON export/import, local restore, and leaving the demo for real saved work.
- Boundary and recovery coverage passed for a one-frame project, corrupt PNG, corrupt GIF, and missing/malformed/out-of-range layer settings in project JSON. Each supplied an actionable error and a valid later import recovered normally.
- The real job described in the brief is present: a local reviewer for numbered PNG/GIF sequences that compares both neighbours and exports one reference sheet. It does not expose painting, generated frames, accounts, collaboration, sync, hosting, or AI features.

## Live parity, privacy, PWA, and security

- Fresh production assets exactly match the live deployment. The live HTML points to `assets/index-DjWQPTY5.js` and `assets/index-sENkcuC3.css`; SHA-256 comparison matched each local production file. It also matched `sw.js`, manifest, offline and 404 pages, robots/sitemap, icons, and all shipped hero/social images.
- A complete manual demo flow request log observed only same-origin document, JS, CSS, and self-hosted font requests. There were no console errors or page errors, no external scripts/fonts, no account controls, and no product API calls. This confirms the local-only privacy promise. The app is static and has no server-side endpoint, so a documented request allowance/429 and backend concurrency/persistence checks do not apply; it has no sign-in, so Entra tenant validation does not apply.
- Live headers supply HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` disabling camera/microphone/geolocation, and a same-origin CSP with `frame-ancestors 'none'`. Hashed JS/CSS return `public, max-age=31536000, immutable`; HTML, manifest, and service worker revalidate.
- The live app registered and was controlled by `/sw.js` with cache `onion-next-frame-v8`. After service-worker readiness, an offline reload retained the demo, frame 03/06, the main heading, and showed **Offline mode**. A fresh local production update simulation started on cache `v7`, showed **“An updated frame is ready,”** and `Load update` switched to only `v8`, preserved the demo/frame, and logged no errors.
- The manifest is valid for a standalone PWA with name/short name, themed start URL, 192/512 icons, and a maskable icon.

## Accessibility, responsive behavior, and performance

- The Playwright Axe integration scanned `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and the real 404. It found **0 serious and 0 critical** violations. The factory `verify-url.sh` independently passed: HTTP 200, title, `lang=en`, exactly one h1, main landmark, zero missing image alts, zero unlabeled buttons, and zero console errors.
- Keyboard-only behavior passed: skip link and visible focus are present; arrow/Shift-arrow frame navigation and `E` export work; route changes move focus to the heading. At 390×844, the demo had `scrollWidth === 390`, all seeded canvas/frame controls fit before scrolling, and the suite verified 44px touch targets. Visual inspection at desktop and 390px found no clipping or horizontal overflow.
- With `prefers-reduced-motion: reduce`, measured transition and animation durations were `0.00001s` and scroll behavior was `auto`.
- Build output is 38.80 kB JS raw / 13.20 kB gzip and 19.44 kB CSS raw / 4.88 kB gzip, within the static-PWA budgets. A fresh Lighthouse run produced Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP/LCP 1.2s, TBT 100ms, CLS 0.012. Lighthouse emitted a terminal Chromium-tab-crash message after producing those results, but direct Playwright checks were stable and error-free.

## Findings by severity

No critical, high, medium, or low release findings.

## Verdict

**PASS.** Candidate `a93b63818c3674b5b06a6df7d99af7541d449317` is the live product build and meets the researched local animation-review contract, including its offline, privacy, accessibility, and one-click demo requirements.
