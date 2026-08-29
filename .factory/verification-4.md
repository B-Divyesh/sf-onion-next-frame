# Onion Next Frame — independent verification 4

**Result: FAIL — release blocked by undersized controls in the mobile workbench.**

- Candidate: `228de240c35a0a4c42cfda3a8a0a6ecd8fc6b7fe`
- Live URL: <https://onion-next-frame.sociobot.in>
- Verified: 2026-08-29 UTC
- Work order: `onion-next-frame-verify-4`

The earlier deployment-only cache defect is fixed. A fresh build's HTML,
JavaScript, CSS, service worker, and manifest are byte-identical to the live
deployment. The candidate still fails the acceptance contract because its
three primary opacity sliders are only 32 CSS px high at the required 390 px
mobile width.

## Mandatory opening gates

### Claims manifest and claim tests — PASS

`.factory/claims.json` exists. Before the broader suite, all ten listed commands
were run separately from the clean checkout through the shipped demo entry
point. Each selected exactly one matching test and passed 1/1.

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS |
| `sample-six-frame-demo` | `npm test -- --grep @claim:sample-six-frame-demo` | PASS |
| `sequence-import` | `npm test -- --grep @claim:sequence-import` | PASS |
| `three-layer-preview` | `npm test -- --grep @claim:three-layer-preview` | PASS |
| `contact-sheet` | `npm test -- --grep @claim:contact-sheet` | PASS |
| `project-transfer` | `npm test -- --grep @claim:project-transfer` | PASS |
| `privacy-local` | `npm test -- --grep @claim:privacy-local` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `local-restore` | `npm test -- --grep @claim:local-restore` | PASS |
| `free-use` | `npm test -- --grep @claim:free-use` | PASS |

Each manifest id occurs exactly once as `@claim:<id>` in
`tests/claims.spec.ts`. The landing page, legal pages, README, and copy audit
were cross-checked; no material unlisted product claim was found.

### Cold first-read and one-click demo — PASS

The live first viewport says **“Compare the frames before and after,”** names
pixel artists checking motion without changing their editor, and presents
**Try it with sample data** with **“Loads a 6-frame run cycle.”** The action is
visible at both 1440×900 and 390×844 and opens `/?demo=1` in one click. The
demo immediately shows six frames and the persistent “Demo — sample data,
nothing is saved” banner with **Reset demo** and **Start for real**.

## Clean checkout, tests, and build

- The checkout started clean at the exact candidate commit.
- `npm ci`: PASS; 28 packages installed and 0 vulnerabilities reported.
- `npm test`: PASS, **25/25** locally.
- `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test`: PASS,
  **25/25** against production.
- `npm run build`: PASS. This runs `tsc --noEmit` and the exact Vite production
  build and emits `dist/index.html`. No separate lint command exists.
- `npm audit --omit=dev`: PASS, 0 vulnerabilities.

The production output is 35.35 KB JavaScript / **12.21 KB gzip**, 18.18 KB CSS
/ **4.70 KB gzip**, 65.32 KB WOFF2 fonts, and a 30.61 KB desktop hero. These
meet the 200 KB JS, 50 KB CSS, 120 KB font, and 300 KB hero budgets.

Fresh Lighthouse 12.2.0 mobile results against live are Performance **94**,
Accessibility **100**, Best Practices **100**, and SEO **100**. FCP was 1.2 s,
LCP 1.3 s, TBT 270 ms, and CLS 0. Evidence is
`.factory/evidence/verification-4-live/lighthouse-mobile.json`.

## Deployment identity and headers

Fresh SHA-256/byte comparisons prove that the live deployment matches the
candidate build:

| Artifact | SHA-256 | Match |
| --- | --- | --- |
| `index.html` | `977d0af143e3c74539c8ab3793939d1c6cdb7f60b253ae2bbeeb87f765d832d8` | byte-identical |
| `assets/index-C0HCiC_u.js` | `26b343ec34ce1ee3a4941c2e124245e6a4e67b918819cae88283b429baf40302` | byte-identical |
| `assets/index-hAdcsCPz.css` | `f78d80ef5070bde1cfee19a10d9ea09d1a7861a4f083a63066cb34161f088e6a` | byte-identical |
| `sw.js` | `6f618438566686b93dd346429c99539cd020a455d442f30d6f499d010005df05` | byte-identical |
| `manifest.webmanifest` | `970d71ddc2c596789539cc012b2526b1aa8411cc3e03e60b107c4285aaf6a3ea` | byte-identical |

The browser's main-document response includes HSTS, same-origin CSP with
`frame-ancestors 'none'`, `nosniff`, strict-origin referrer policy, and a
restricted Permissions-Policy. HTML and `sw.js` revalidate after 30 seconds.
The hashed live JS and CSS now return `public, max-age=31536000, immutable`.
The previously reported deployment-only cache failure is therefore closed.

## End-to-end product checks

Fresh live testing confirmed:

- Demo starts at frame 03/06; Right moves to 04/06 and Shift+Right to 06/06.
- All three layer settings are present. Current opacity works at both 0% and
  100%, changes the canvas, and Reset returns to frame 03 and defaults.
- The six-frame contact sheet downloads as
  `onion-next-frame-contact-sheet.png` (31,064 bytes in this run).
- A one-frame PNG sequence loads as 01/01 with both neighbour buttons disabled.
- A valid animated GIF recovers after invalid input and loads two frames.
- A 100-frame numbered boundary sequence sorts, displays 100 frame controls,
  and exports one valid 880×6356 PNG (271,562 bytes).
- Malformed project JSON gives an actionable recovery message. Project
  export/import and real IndexedDB restoration pass their claim tests.
- No console error or uncaught page error occurred in these normal, boundary,
  invalid-input, desktop, or mobile flows.

## Privacy, networking, and server scope

The independent Chromium request log covered demo loading, layer changes,
export, reset, and every public route. All 74 observed requests were to
`https://onion-next-frame.sociobot.in`; resource types were document, script,
stylesheet, font, and image. There were no analytics, ads, iframes, account
controls, uploads, or third-party runtime requests. The response CSP also
limits `connect-src` to self.

This is a static local-first PWA. It has no product API, unlock endpoint,
backend persistence, sign-in, or billing flow. API concurrency, 429 allowance,
`Retry-After`, health/build identity, and Entra authority checks are not
applicable.

## Accessibility, mobile, and PWA

- `/opt/fleet/lib/verify-url.sh` passed: HTTPS 200, no console errors, title,
  `lang=en`, one `h1`, `main`, alt text, and labelled buttons are present.
- Independent Axe scans found zero serious or critical findings on `/`,
  `/?demo=1`, `/demo`, `/privacy`, `/terms`, and the missing-page view.
- Keyboard frame controls, history focus, range-key operation, and the skip
  link work. The focused skip link has a visible 3 px cyan outline.
- At 390×844 there is no horizontal overflow. Reduced motion changes
  transitions to 0.01 ms.
- Offline reload after the first visit passes locally and live; `/demo` keeps
  its six-frame viewer and reports Offline mode.
- An isolated update simulation changed the worker from cache v3 to v4. The
  app displayed “An updated frame is ready,” **Load update** activated the new
  worker, the old cache was removed, and the six-frame demo survived without
  console errors.

## Defects by severity

### High — release blocker: all three core opacity controls miss the 44 px mobile touch-target minimum

At 390×844, the Previous, Current, and Next layer opacity ranges each measure
**324×32 CSS px**. The supplied accessibility and design contracts require
every touch target to be at least 44×44 px. These are not incidental links;
independent layer opacity is part of the brief's smallest useful product.

The CSS explicitly sets `.layer-control input[type="range"]` to
`min-height: 32px`. The current regression checks only landing-page links and
buttons, so it cannot detect undersized workbench inputs. Raise the interactive
range box to at least 44 px at mobile sizes and add a 390 px test that measures
all enabled demo controls, including inputs.

### Medium — corrupt PNG errors omit a recovery action

Importing a file named `broken.png` with invalid image bytes displays the raw
browser message **“The source image could not be decoded.”** It does not say
what the user should do next, contrary to the supplied error-copy rule. A
subsequent valid import works, so the product is not stuck. Replace the raw
DOMException with a file-specific instruction such as choosing another PNG or
exporting the source again, and cover it with a recovery test.

### Low — unknown document paths are soft 404s

`/definitely-missing` and `/definitely-missing.html` render the designed
missing-frame view but respond HTTP 200 because the navigation fallback catches
them. A missing excluded asset such as `/definitely-missing.png` correctly
responds 404. Return an actual 404 status for unknown page routes to satisfy the
“real 404” site-structure contract and avoid soft-404 indexing.

## Evidence

Evidence is under `.factory/evidence/verification-4-live/`, including the cold
first read, desktop/mobile demo images, mobile workbench image, verifier JSON,
and fresh Lighthouse JSON.

## Verdict

The candidate is functionally strong, private, offline-capable, and correctly
deployed, but the explicit 44×44 mobile touch-target requirement fails on all
three core opacity controls. **FAIL.**
