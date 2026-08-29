# Onion Next Frame — independent verification 5

**Result: FAIL — release blocked by malformed project files corrupting the active workbench.**

- Candidate: `d4af87ea036f892deb0ad34db557a3e5745f440a`
- Live URL: <https://onion-next-frame.sociobot.in>
- Verified: 2026-08-29 UTC
- Work order: `onion-next-frame-verify-5`

The earlier deployment-only failure is not present. The live static files are
byte-identical to a fresh candidate build, immutable caching is active, and the
mobile control repair is deployed. Independent invalid-input testing found a
new release blocker in project import.

## Mandatory opening gates

### Claims manifest and claim tests — PASS

`.factory/claims.json` exists. After the required clean-clone `npm ci`, every
listed command was run separately before the broader suite. Each selected one
test and passed 1/1.

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

Every manifest id occurs exactly once as `@claim:<id>`. The landing page,
legal pages, README, demo notes, and copy audit were cross-checked. No material
unlisted product claim was found.

### Cold first-read and one-click demo — PASS

The first live viewport answers all three required questions:

- What: **“Compare the frames before and after.”**
- For whom: **“For pixel artists checking motion between drawings without
  changing their main editor.”**
- First click: **“Try it with sample data,”** paired with **“Loads a 6-frame run
  cycle.”**

The action is visible without scrolling at 1440×900 and opens `/?demo=1` in one
click. The destination immediately shows frame 03/06, six frame controls, and
the persistent **“Demo — sample data, nothing is saved”** banner with Reset
demo and Start for real.

## Release-blocking finding

### High — a structurally incomplete project corrupts the current session

The project importer checks the format, version, and frame array, but it does
not validate the layer settings before assigning imported state. Reproduction
on the live deployment:

1. Open `/demo`.
2. Import JSON with `format: "onion-next-frame"`, `version: 1`, one valid
   embedded frame, and `settings: {}`.
3. The status exposes **“Cannot read properties of undefined (reading
   'visible')”**. The visible counter and six frame buttons remain from the old
   demo even though the internal frame array has changed to one frame.
4. Change Current opacity. The page raises the uncaught error **“Cannot set
   properties of undefined (setting 'opacity')”**.

A later valid project import recovers the page, but the invalid import is not
rejected atomically, the message gives no recovery action, and a normal next
interaction throws. This violates the work order's explicit invalid-input and
recovery requirement. The cause is visible in `src/app.ts:449-468`: imported
state is assigned before `syncControlInputs()`, and `settings` has no schema
validation.

Evidence: `.factory/evidence/verification-5-live/manual-audit.json` under
`invalidProject`.

Expected repair: validate every required layer and field into a temporary
project value, reject unsupported/missing values with a plain recovery message,
and mutate the current workbench only after validation succeeds. Add a browser
regression that proves the previous project remains usable after rejection.

## Other findings

### Medium — corrupt GIF guidance lacks a next action

Importing `broken.gif` reports **“broken.gif has no readable GIF frames.”** A
subsequent valid GIF imports successfully, but the error does not tell the user
what to do next as required by the plain-language contract. Add guidance such
as choosing another GIF or exporting it again, matching the repaired PNG path.

### Low — one-frame restore message has incorrect grammar

Leaving the demo for a saved one-frame project shows **“Restored 1 saved frames
from this browser.”** Use the singular form for one frame.

### Low — unversioned image URLs receive immutable one-year caching

The `/assets/*` rule gives `hero-1200.webp`, `hero-640.webp`, and
`onion-next-frame-og.webp` `max-age=31536000, immutable`, although their names
are not content-hashed. The deployment is correct today, but replacing an image
at the same URL can leave returning browsers with stale art. Hash these names
or give unversioned images a revalidating policy.

## Clean checkout, tests, and build

- Checkout began at the exact candidate commit; no product code was changed.
- `npm ci`: PASS; 28 packages installed, 0 vulnerabilities reported.
- Every `.factory/claims.json` command: PASS, 10/10 independently.
- `npm test`: PASS, 28/28 against the local production preview.
- `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test`: PASS,
  28/28 against the live deployment.
- `npm run build`: PASS. It runs `tsc --noEmit` and Vite's production build and
  produces `dist/index.html`. No separate lint script exists.
- `npm audit --omit=dev`: PASS, 0 vulnerabilities.
- `/opt/fleet/lib/verify-url.sh`: PASS locally (660 ms) and live (717 ms), with
  one h1, `lang=en`, a main landmark, labelled images/buttons, and no
  console/page errors.

## Deployment identity and caching

All 31 candidate `dist/` files that are meant to be served are byte-identical
to the live files. `staticwebapp.config.json` is host configuration and is
correctly consumed rather than exposed as a public file. Key hashes:

| Artifact | Candidate/live SHA-256 |
| --- | --- |
| `index.html` | `ffa585112365d940ac6fe967d3f45cc95f108170c0764b71a2cdaaacb6b3d93c` |
| `assets/index-RIbddhXW.js` | `3c4f53fd60ea3eab025e2fea262529aa3034703fdd41af31a32a4d51d70f3dd1` |
| `assets/index-D40wvSRW.css` | `f7a17c970c11ee4a0bd04d8b4d18a7a40102f8a5b0769577b0efc6cd0e321b48` |
| `sw.js` | `89760f19cf6667188b6519d8f76b0f9ac10350eae421dfb2090b86dc58e96d7b` |
| `manifest.webmanifest` | `970d71ddc2c596789539cc012b2526b1aa8411cc3e03e60b107c4285aaf6a3ea` |

Live HTML and `sw.js` revalidate after 30 seconds. Hashed JS and CSS return
`public, max-age=31536000, immutable`. Unknown documents return the designed
page with a real HTTP 404.

## End-to-end product evidence

- Demo reset returns to frame 03/06 and 28% / 100% / 28% layer opacity.
- Right moves to frame 04/06; Shift+Right moves to 06/06.
- Changing Current opacity changes rendered canvas pixels.
- The six-frame contact sheet is a valid 880×560 PNG (31,138 bytes in this
  run). Project export is valid version-1 JSON with six embedded frames, and a
  valid re-import succeeds.
- A one-frame PNG shows 01/01 and disables both neighbour buttons.
- A valid animated GIF loads two frames after a corrupt GIF attempt.
- A 100-frame reverse-selected PNG sequence sorts from `run-001.png` through
  `run-100.png`, displays 100 controls, and exports a valid 880×6356 PNG
  (255,161 bytes).
- Invalid JSON receives an actionable message and valid import recovers. The
  incomplete-settings case is the blocker described above.
- A seeded real project is not read during demo mode (zero IndexedDB opens).
  Start for real discards the sample and restores the real one-frame project.
- All internal links return 200; the deliberate missing path returns 404; the
  external Param Factory link returns 200.

## Privacy, headers, and server scope

The fresh browser request log covered home, demo, layer changes, both exports,
reset, PNG/GIF imports, and every public route. All 64 observed requests were
same-origin; there were no failed requests, third-party calls, analytics,
iframes, account controls, or artwork uploads. Source inspection found no
runtime API or unlock call.

The main response includes HSTS, `nosniff`, strict-origin referrer policy,
restricted camera/microphone/geolocation permissions, and a self-only CSP with
`frame-ancestors 'none'`. This is a static local-first PWA with no server-side
endpoint, sign-in, billing, or product-unlock request. API concurrency,
persistence boundary, health/build endpoint, Entra authority, and 429 /
`Retry-After` checks are therefore not applicable.

## Accessibility, mobile, and PWA

- Playwright Axe reports zero serious/critical findings on `/`, `/demo`,
  `/privacy`, `/terms`, and the real 404 view, including a fresh 390×844 scan.
- Keyboard-only use reaches the skip link, demo controls, and footer without a
  trap. Enter opens Demo, Space toggles a layer, Home changes a range to 0%,
  arrows scrub, and `E` downloads the contact sheet.
- The skip link is visible when focused with a 3 px cyan outline. SPA route
  changes focus the new h1.
- At 390×844 there is no horizontal overflow and no enabled visible control
  below 44×44 CSS px. All three repaired opacity controls measure 324×44.
- Reduced motion reports 0.01 ms transitions.
- A first live `/demo` visit, followed immediately by offline reload, retains
  the six frames and shows Offline mode from cache v4.
- A fresh update simulation moved cache v4 to v5, showed **“An updated frame is
  ready,”** activated through **Load update**, removed v4, reloaded, and retained
  frame 03/06 with no console/page errors.

## Performance

The production output is 35.49 KB JavaScript / 12.26 KB gzip, 18.26 KB CSS /
4.70 KB gzip, 114.94 KB of emitted font variants, a 30.61 KB desktop hero, and
a 12.81 KB mobile hero. These meet every supplied static/PWA transfer budget.

Fresh Lighthouse 12.2.0 mobile results against live:

- Performance 98; Accessibility 100; Best Practices 100; SEO 100.
- FCP 1,204 ms; LCP 1,204 ms; TBT 154.5 ms; CLS 0.00021.

## Evidence

- `.factory/evidence/verification-5-live/manual-audit.json`
- `.factory/evidence/verification-5-live/lighthouse-mobile.json`
- `.factory/evidence/verification-5-live/verify.json`
- `.factory/evidence/verification-5-live/first-read-desktop.png`
- `.factory/evidence/verification-5-live/demo-mobile.png`
- `.factory/evidence/verification-5-local/sw-update.json`

## Verdict

The deployment-only issue is closed and the candidate is otherwise fast,
private, accessible, useful, and correctly deployed. It still fails the
acceptance contract because a plausible malformed project import corrupts the
active viewer and causes an uncaught error. **FAIL.**
