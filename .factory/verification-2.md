# Onion Next Frame — independent verification 2

**Result: FAIL — release blocked by mobile touch targets below the product contract.**

Verified on 2026-08-28 against candidate commit
`11bf8074ffc191ba54bd54327cf9433562d17662` and the live deployment
`https://onion-next-frame.sociobot.in`.

## Release identity and first read

- The clean checkout began exactly at the requested commit. `npm ci` installed 28
  packages with no reported vulnerabilities.
- A fresh production build was byte-identical to live for all executable PWA
  entry artifacts: `index.html` SHA-256
  `aaf01ad75b83d86379d239625af25ae86e938750a7e7e374cbc77cb3b2698745`,
  `assets/index-CFni8ZHK.js` SHA-256
  `1d92f1f340de8eebf1782da6a66ab16b268596e580d30967291803d4a98e0bc1`,
  `assets/index-DIKJgCi2.css` SHA-256
  `58f6381c7741cd0ab098d34325d4ebc613a24da4c5e56ef2ad2744eeea4b5d1d`.
  The live service worker and manifest also match the build byte-for-byte.
- Cold live first read: “Compare the frames before and after” says this is a
  pixel-animation neighbour-frame viewer; the next sentence names pixel artists
  checking motion without changing their editor; and the first primary action is
  **Try it with sample data**, with “Loads a 6-frame run cycle.” beside it.
  It opens `/demo` in one click. This requirement **passes**.
- `/demo` immediately shows six original frames and the persistent “Demo —
  sample data, nothing is saved” banner with **Reset demo** and **Start for
  real**. Demo storage is separate/in-memory and the real project is not read.

## Mandatory claim tests — PASS

`.factory/claims.json` exists and all nine commands were run individually from
the clean checkout against the shipped demo entry point. Each passed 1/1:

| Claim | Exact command result |
| --- | --- |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` — PASS |
| `sequence-import` | `npm test -- --grep @claim:sequence-import` — PASS |
| `three-layer-preview` | `npm test -- --grep @claim:three-layer-preview` — PASS |
| `contact-sheet` | `npm test -- --grep @claim:contact-sheet` — PASS |
| `project-transfer` | `npm test -- --grep @claim:project-transfer` — PASS |
| `privacy-local` | `npm test -- --grep @claim:privacy-local` — PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` — PASS |
| `local-restore` | `npm test -- --grep @claim:local-restore` — PASS |
| `free-use` | `npm test -- --grep @claim:free-use` — PASS |

The landing, legal pages, and README were also cross-checked against those
claims; no unsupported marketing claim was found.

## Local and live verification that passed

- `npm test` passed **20/20** locally. `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test`
  also passed **20/20** against production. The suites cover all claims,
  imports (including animated GIF), export, privacy request interception,
  restoration, offline reload, keyboard history, routes, CSP, mobile width,
  Axe serious/critical findings, and cache policy.
- `npm run build` passed TypeScript checking and generated `dist/`. The initial
  JS is 34.82 KB raw / 12.12 KB gzip and CSS is 17.87 KB raw / 4.67 KB gzip,
  within the 200 KB JS and 50 KB CSS budgets.
- `/opt/fleet/lib/verify-url.sh https://onion-next-frame.sociobot.in .factory/evidence/verification-2-live`
  passed: HTTPS 200, no page/console errors, title, `lang=en`, one `h1`,
  `main`, image alt text, and labelled controls.
- Playwright Axe reported no serious or critical violations on `/`, `/demo`,
  `/privacy`, `/terms`, or the missing-frame page. The cold live page and demo
  produced no console or page errors. Desktop and 390×844 mobile have no
  horizontal overflow.
- Manual live workbench flow passed: ArrowRight moved demo frame 03→04 and
  Shift+ArrowRight moved it to 06; neighbour opacity changed canvas pixels;
  reset restored frame 03/defaults; the contact-sheet download was
  `onion-next-frame-contact-sheet.png`; project export contained the expected
  six frames; numbered PNGs sorted correctly; one-frame input worked; invalid
  text input and invalid JSON both gave specific recoverable status messages;
  two imported frames restored after reload.
- Reduced motion changes transitions to `0.01ms`; focus rings are a visible
  3px cyan outline. The skip link is reachable first. Critical keyboard
  controls are reachable and operate without a mouse.
- Service worker verification passed. A fresh demo reload works offline after
  the initial visit. Cache `onion-next-frame-v2` installed. A controlled
  update simulation displayed “An updated frame is ready / Load update”; using
  it reloaded the page and left no waiting worker.
- Privacy passed in both the claim test and a fresh complete live demo flow:
  every observed request was same-origin. No analytics, advertising, uploads,
  account flow, third-party script, or third-party font request was observed.
  CSP restricts `connect-src` to `'self'`. This static PWA has no server-side
  product endpoint, sign-in, or payment flow, so rate-limit and Entra checks
  are not applicable.
- Response headers include HSTS, restrictive CSP, `X-Content-Type-Options:
  nosniff`, `Referrer-Policy`, and `Permissions-Policy`. The prior cache
  release blocker is repaired: both emitted hashed JS and CSS return
  `Cache-Control: public, max-age=31536000, immutable` (no `must-revalidate`).
- Lighthouse 12.2.0 mobile against live (fresh Chromium) reports Performance
  **98** and Accessibility **100**; FCP 1.2 s, LCP 1.2 s, TBT 160 ms, CLS 0.
  It reports the platform's less-strict touch-target audit as passing, but the
  product's explicit 44×44 contract still fails below.
- All rendered internal links and the Param Factory external link returned
  HTTP 200. `npm audit --omit=dev` reported 0 vulnerabilities.

## Defects

### High — release blocker: interactive targets do not meet the required 44×44 px minimum on 390 px mobile

The product contract and attached accessibility/design instructions require
every touch target to be at least 44×44 CSS px. Fresh Playwright measurement at
390×844 shows multiple live links below that size:

| Control | Measured live size |
| --- | --- |
| Header wordmark/home link | 28×22 px |
| Header Home and Demo links | 39×44 px each |
| “Read the privacy details” | 183×21 px |
| Footer Privacy, Terms, and Built by Param Factory links | 350×21 px each |

This is not detected by Axe serious/critical or Lighthouse's permissive target
heuristic, but it violates the factory's explicit hard 44×44 requirement and
makes key navigation links difficult to activate on a phone. Add real padded
44×44 hit areas (without merely adding visual whitespace) and regression-test
the measured rectangles at 390 px before re-submission.

## Evidence

- Live cold screenshot:
  `.factory/evidence/verification-2-live-cold-desktop.png`
- Live verifier output, desktop/mobile screenshots, and Lighthouse JSON:
  `.factory/evidence/verification-2-live/`

## Verdict

The product is otherwise a functional, local-first PWA that meets the brief,
and the earlier immutable-cache failure is fixed on the live deployment.
However, the explicit mobile touch-target acceptance requirement is not met.
**FAIL until the high-severity touch-target defect is repaired and independently
reverified.**
