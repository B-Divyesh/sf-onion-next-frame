# Onion Next Frame — independent verification 9

**Result: PASS**

- Candidate commit: `da7db7133b686ec36cac2757957b60cb1f6e1c81`
- Live URL: <https://onion-next-frame.sociobot.in>
- Demo URL: <https://onion-next-frame.sociobot.in/?demo=1>
- Verified: 2026-08-29 UTC
- Work order: `onion-next-frame-verify-9`
- Product-code changes by verifier: none

## Opening gates

`.factory/claims.json` exists and declares 15 claims.  After `npm ci` (28 packages, `npm audit` reported 0 vulnerabilities), I invoked every literal command in that manifest separately from this clean candidate checkout.  All passed:

| Claim ID | Result |
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

The complete Playwright suite passed locally and again with `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in` (44 tests in each run). `npm run build` passed with `tsc --noEmit` and Vite, producing `dist/`. There is no lint script in `package.json`.

Fresh, cold live-page first read: the first screen says **“Compare the frames before and after”**, says it is **“For pixel artists checking motion between drawings without changing their main editor,”** and has a visible one-click **“Try it with sample data”** action whose adjacent outcome is **“Loads a 6-frame run cycle.”** The action opened `/?demo=1`, seeded frame 03/06, and showed the persistent **“Demo — sample data, nothing is saved”** banner with **Reset demo** and **Start for real**. This passes the plain-words and demo-sandbox acceptance gates.

## Functional and boundary QA

- The live demo loaded six sample frames. Arrow Right changed 03/06 to 04/06; Shift+Right reached 06/06; `E` produced `onion-next-frame-contact-sheet.png` (31,064 bytes, valid PNG signature) and the success status named six frames.
- A `.jpg` produced the actionable message “wrong.jpg is not a PNG or GIF. Choose numbered PNG or GIF files.” A subsequent valid two-frame GIF recovered successfully (`Loaded 2 frames`, frame 02/02).
- Passing claim tests cover natural numbered PNG ordering, GIF import, real drag/drop, independent previous/current/next controls, contact-sheet and JSON project export/import, corrupt PNG/GIF and malformed-project recovery, one-frame edge cases, local restore, and demo/real-project isolation.
- The delivered function matches the researched job: a local reviewer for numbered PNG/GIF sequences with previous/current/next comparison and contact-sheet export. It does not present painting, hosting, accounts, collaboration, sync, or AI interpolation as product features.

## Live parity, privacy, headers, PWA, and performance

- Fresh production build hashes exactly matched the live HTML, JS, CSS, service worker, and manifest: `index.html`, `assets/index-CyUYaLUo.js`, `assets/index-BMQ4WuOK.css`, `sw.js`, and `manifest.webmanifest`. `staticwebapp.config.json` is deployment configuration and correctly is not publicly served.
- The complete observed cold/demo/import/export/offline flow made 38 requests, all to `https://onion-next-frame.sociobot.in`; there were no console errors or page errors. No account, advertising, or remote product endpoint is present. As a static local-first PWA, rate-limit/429, backend concurrency, and Entra authentication checks do not apply.
- Live headers include HTTPS/HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a same-origin CSP including `frame-ancestors 'none'`, and disabled camera/microphone/geolocation. Hashed JS/CSS are `public, max-age=31536000, immutable`; HTML, manifest, and service worker revalidate.
- The live page became service-worker controlled with cache `onion-next-frame-v8`; after setting the browser offline, reload kept the demo, frame 03/06, and **Offline mode**. A local old-to-v8 service-worker upgrade simulation displayed **“An updated frame is ready.”**; choosing **Load update** installed only `onion-next-frame-v8`, preserved the demo and frame 03/06, and logged no errors.
- Production output is 38.80 KB JS raw / 13.20 KB gzip and 19.16 KB CSS raw / 4.81 KB gzip, within the 200 KB / 50 KB budgets. A fresh live Lighthouse run recorded Performance 0.97, Accessibility 1.00, Best Practices 1.00, SEO 1.00, FCP/LCP about 1.20 s, and CLS 0.000024 before Chrome crashed while collecting its final screenshot artifact. The crash is a container/browser-tool issue; direct Playwright performance, console, and visual checks completed normally.

## Accessibility and responsive QA

- Integrated Axe scans of live demo and 390px live demo found **0 serious and 0 critical** findings; the complete suite additionally scans home, both demo URLs, privacy, terms, and 404.
- Keyboard-only smoke test: first Tab reached the skip link, with a visible `rgb(85, 230, 223) solid 3px` focus outline. Frame-arrow keyboard actions and `E` export worked. Route navigation moves focus appropriately as covered by the suite.
- At 390×844, the live demo had `scrollWidth === 390`, 17px body text, a visible 332×260 canvas, and no clipping in visual inspection. The suite verifies 44px enabled controls. With reduced motion, maximum measured transition/animation duration was 0.01 ms.

## Findings by severity

No critical, high, medium, or low release findings.

## Verdict

**PASS.** Candidate `da7db7133b686ec36cac2757957b60cb1f6e1c81` is the deployed build, all declared claims and local/live suites pass, and the real PWA flow meets the researched local animation-review contract.
