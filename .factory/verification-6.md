# Onion Next Frame — independent verification 6

**Result: PASS — candidate and live deployment satisfy the acceptance contract.**

- Candidate: `45d2494a6c89a519363d287ccd9055ce5d411e91`
- Live URL: <https://onion-next-frame.sociobot.in>
- Verified: 2026-08-29 UTC
- Work order: `onion-next-frame-verify-6`
- Product code changed by verifier: none

The previously reported deployment-only failure is absent. The deployment is
byte-identical to the candidate build, and both local and deployed suites pass.
One low-severity grammar defect remains; it does not block the core job or data
handling.

## Mandatory opening gates

### Claims — PASS (10/10)

`.factory/claims.json` exists. From the clean candidate checkout, `npm ci`
installed the pinned dependencies. Every manifest command was then run
separately against the production demo entry point and selected exactly one
test.

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS, 1/1 |
| `sample-six-frame-demo` | `npm test -- --grep @claim:sample-six-frame-demo` | PASS, 1/1 |
| `sequence-import` | `npm test -- --grep @claim:sequence-import` | PASS, 1/1 |
| `three-layer-preview` | `npm test -- --grep @claim:three-layer-preview` | PASS, 1/1 |
| `contact-sheet` | `npm test -- --grep @claim:contact-sheet` | PASS, 1/1 |
| `project-transfer` | `npm test -- --grep @claim:project-transfer` | PASS, 1/1 |
| `privacy-local` | `npm test -- --grep @claim:privacy-local` | PASS, 1/1 |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS, 1/1 |
| `local-restore` | `npm test -- --grep @claim:local-restore` | PASS, 1/1 |
| `free-use` | `npm test -- --grep @claim:free-use` | PASS, 1/1 |

Every claim id occurs exactly once as `@claim:<id>` and there are no extra
claim tags. Landing, legal, README, demo, and copy-audit statements were
cross-checked; no material unlisted product claim was found.

### Cold first read and demo — PASS

At 1440×900, the first live screen answers the required questions in plain
words without scrolling:

- What: **“Compare the frames before and after.”**
- For whom: **“For pixel artists checking motion between drawings without
  changing their main editor.”**
- First action: **“Try it with sample data,”** beside **“Loads a 6-frame run
  cycle.”**

The action opens `/?demo=1` in one click. The destination immediately shows
frame 03/06, six frame controls, the sample artwork, and the persistent
**“Demo — sample data, nothing is saved”** banner with Reset demo and Start for
real. The cold response was HTTP 200 with no application console/page error.

## Clean checkout and quality gates

- `npm ci`: PASS; 28 packages installed; audit reported 0 vulnerabilities.
- `npm test`: PASS, 32/32 against the local production preview.
- `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test`: PASS,
  32/32 against live.
- `npm run build`: PASS. It runs `tsc --noEmit` and Vite's production build and
  creates `dist/index.html`.
- No separate lint script exists in `package.json`.
- `npm audit --omit=dev`: PASS; 0 vulnerabilities.
- Factory `verify-url.sh`: PASS locally in 675 ms and live in 829 ms; title,
  `lang=en`, one h1, main landmark, image alternatives, button names, and
  console/page-error smoke checks passed.
- Library/CLI pack-and-consumer testing does not apply to this static PWA.

## End-to-end and adversarial behavior

- The six-frame demo resets to frame 03/06 and 28% / 100% / 28% opacity.
- Arrow Right moves to 04/06; Shift+Right moves to 06/06. `E` downloads a
  valid 880×560 PNG contact sheet.
- Natural filename ordering was independently exercised with 100 files chosen
  in reverse order. The strip ran from `run-001.png` to `run-100.png`, exposed
  100 controls, and exported a valid 880×6356 PNG (255,161 bytes).
- A one-frame PNG shows 01/01, disables both neighbour controls, persists on
  reload, and exports a valid 220×308 PNG.
- PNG and two-frame GIF claim fixtures import successfully. Invalid extension,
  corrupt PNG, and corrupt GIF messages identify what failed and what to try
  next; a subsequent valid import recovers.
- Project export contains the six embedded frames and re-imports successfully.
  Invalid JSON, version 2, missing settings, negative opacity, invalid tint,
  out-of-range current index, and mismatched image dimensions were rejected.
  Every rejection retained frame 03/06 and all six controls; valid import then
  recovered with no page error.
- A saved real one-frame project survived demo changes. Start for real restored
  that project, proving the demo did not replace real IndexedDB data.
- Clear sequence is confirmation-gated. Cancel retained the one frame; accept
  cleared it, and reload remained empty.
- All rendered links on home, demo, privacy, terms, and 404 were crawled. Every
  product link and the Param Factory external link returned 200. A deliberate
  missing document returns the designed page with a real HTTP 404.
- AI interpolation is an explicit non-goal. The useful import/export loop is
  complete, so no missed AI or sync leverage was found.

## Accessibility, keyboard, responsive design, and copy

- Playwright Axe found zero serious/critical findings on `/`, `/?demo=1`,
  `/demo`, `/privacy`, `/terms`, the real 404, and a 390×844 demo viewport.
- Lighthouse accessibility: 100.
- The skip link is the first keyboard target, moves to `y=8` when focused, and
  has a 3 px cyan outline. Demo is reachable with Tab/Enter; SPA navigation
  focuses the h1. Arrow/Shift+Arrow shortcuts, range Home, and `E` all work.
- At 390×844, document width is exactly 390 px, body text is 17 px, and no
  visible enabled link, button, or form input is below 44×44 CSS px. Visual
  review found no clipping or overlap. A 640 CSS-pixel reflow check (equivalent
  to 200% zoom from a 1280 px viewport) found no overflow or clipped text.
- Reduced-motion mode matches and limits all observed transitions to 0.01 ms.
- Headings remain ordered, every route has one h1 and one main, controls have
  names, and native confirmation supplies focus management.
- The pixel-light-table/demoscene design matches `.factory/design.md`: dark
  canvas, cyan/magenta neighbour layers, amber action, self-hosted pixel/body
  fonts, and original product-specific art. Desktop and mobile screenshots
  were visually reviewed.

## Privacy, requests, headers, and server scope

The independent live flow recorded 68 requests across navigation, sample use,
layer changes, imports, exports, invalid recovery, and public routes. Every
request used `https://onion-next-frame.sociobot.in`; there were no failed
runtime requests, trackers, uploads, analytics, ads, iframes, password fields,
or third-party fonts/scripts. Source inspection found no runtime API, billing,
unlock, AI, or authentication call.

The main response includes:

- `Content-Security-Policy` restricted to self/data/blob as required, with
  `frame-ancestors 'none'` in the response header.
- HSTS with subdomains and preload, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and camera/microphone/
  geolocation disabled by Permissions Policy.

This is a static local-first PWA with no server-side product endpoint. API
concurrency, health/build endpoints, request allowance / 429 / `Retry-After`,
and persistence concurrency do not apply. It has no sign-in, so the Entra
authority check also does not apply.

## Deployment identity, caching, PWA, and performance

- All 31 candidate files meant to be served are byte-identical to live; zero
  mismatches. `staticwebapp.config.json` is correctly consumed as host config.
- Candidate/live `index.html` SHA-256:
  `aa76f6e244fbfdcacd82fb6afddac82dacf53de4322607826dc2f9ec713fb9bc`.
- Candidate/live JavaScript SHA-256:
  `52a15c485a7641085d50c8a7307859c876bdaa6c5eff2e0800ab144d09ef38d8`.
- Candidate/live `sw.js` SHA-256:
  `3f260a335e283b3308f0c272e0224993643b0325bdd99d96b79f629536c0cfe9`.
- HTML and `sw.js` revalidate after 30 seconds. Hashed JS/CSS use one-year
  immutable caching. Unversioned hero/social images use `max-age=0,
  must-revalidate`. The manifest has the correct MIME type.
- A fresh live service worker controlled `/demo` with cache v5. Offline reload
  retained frame 03/06, the demo banner, and showed **Offline mode**, with no
  browser error.
- A clean candidate v5→v6 simulation showed the update toast, activated via
  **Load update**, removed v5, retained frame 03/06, and produced no error.
- Manifest name, standalone display, versioned start URL, 192/512/maskable
  icons, theme/background colours, and image dimensions are valid.

Production budgets:

- JavaScript: 37.23 KB raw / 12.67 KB gzip (budget ≤200 KB).
- CSS: 18.26 KB raw / 4.70 KB gzip (budget ≤50 KB).
- Emitted font files: 114.94 KB; first-load font transfer 43.34 KB (budget
  ≤120 KB).
- Mobile hero: 12.81 KB; desktop hero: 30.61 KB (budget ≤300 KB).
- Lighthouse 12.2.0 mobile: Performance 97, Accessibility 100, Best Practices
  100, SEO 100; FCP/LCP 1,210 ms, TBT 182.5 ms, CLS 0.00021, total transfer
  117.5 KB, and zero third-party bytes.
- Three representative interactions under 4× CPU throttling had an
  Event-Timing INP approximation of 80 ms (budget <200 ms).

## Findings by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: the one-frame destructive confirmation says **“Clear 1 frames from this
  browser?”** instead of “Clear 1 frame…”. Cancel, accept, deletion, and reload
  behavior are correct. This is a copy-only defect and is not release-blocking.

## Evidence

- `.factory/qa-evidence-6/manual-live.json`
- `.factory/qa-evidence-6/offline-live.json`
- `.factory/qa-evidence-6/sw-update.json`
- `.factory/qa-evidence-6/lighthouse-mobile.json`
- `.factory/qa-evidence-6/live-cold-desktop.png`
- `.factory/qa-evidence-6/live-desktop-demo.png`
- `.factory/qa-evidence-6/live-mobile-demo.png`
- `.factory/qa-evidence-6/verify-local/verify.json`
- `.factory/qa-evidence-6/verify-live/verify.json`

## Verdict

The product performs the researched job end to end, preserves its local-only
privacy boundary, works and updates offline, meets accessibility and size
budgets, and the live deployment matches the candidate exactly. The earlier
deployment-only failure and verification-5 project-import blocker are closed.
**PASS.**
