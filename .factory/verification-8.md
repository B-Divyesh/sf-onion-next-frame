# Onion Next Frame — independent verification 8

**Result: PASS**

- Candidate / `origin/main`: `85c08b3f08efe57e7ed01955cc078f2214af4fca`
- Live URL: <https://onion-next-frame.sociobot.in>
- Demo URL: <https://onion-next-frame.sociobot.in/?demo=1>
- Verified: 2026-08-29 UTC
- Work order: `onion-next-frame-verify-8`
- Product code changed by verifier: none

The live HTML names the exact JavaScript and CSS asset hashes emitted by a fresh production build of the candidate (`index-BH4U8vpQ.js` and `index-DvHEfmQX.css`). At verification time, before this documentation-only handoff commit, `origin/main` resolved to the nominated candidate. The deployment-only failure mentioned in the work order did not reproduce.

## Opening gates

### Claims: PASS — 13/13 exact commands

After `npm ci` (28 packages installed; audit reported zero vulnerabilities), every literal command in `.factory/claims.json` passed separately from the demo-capable clean checkout:

| Claim ID | Result |
| --- | --- |
| demo-sandbox | PASS |
| sample-six-frame-demo | PASS |
| sequence-import | PASS |
| drag-drop-import | PASS |
| three-layer-preview | PASS |
| contact-sheet | PASS |
| keyboard-shortcuts | PASS |
| project-transfer | PASS |
| privacy-local | PASS |
| offline-reload | PASS |
| local-restore | PASS |
| start-for-real | PASS |
| free-use | PASS |

Each invocation ran one tagged Chromium test and exited zero. The manifest has one declared tagged test for each claim. The full suite was then run locally against the production preview: **37/37 passed in 53.6 s**.

### Cold first read and sample demo: PASS

On a fresh live browser visit, the first screen says what it does — “Compare the frames before and after” — and who it is for — “pixel artists checking motion between drawings without changing their main editor.” The immediately visible **Try it with sample data** link says it “Loads a 6-frame run cycle.” One click opens `/?demo=1`, focuses its h1, loads frame 03/06, and shows the persistent “Demo — sample data, nothing is saved” banner with **Reset demo** and **Start for real**. This meets the plain-words and one-click sandbox gates.

## Functional QA

- Normal flow: live demo loaded six frames; Arrow Right changed 03/06 to 04/06; Shift+Right reached 06/06; `E` downloaded `onion-next-frame-contact-sheet.png`; Reset restored all six sample frames.
- Layer controls, contact-sheet PNG export, portable project JSON transfer, natural PNG ordering, GIF import, drag-and-drop, demo-to-real isolation, and restore after reload are independently covered by the passing claims suite.
- Boundary and recovery coverage passed: one-frame state, reverse-order numbered filenames, corrupt PNG/GIF, malformed project settings, and a direct live invalid `.jpg` import. The live message was: “wrong.jpg is not a PNG or GIF. Choose numbered PNG or GIF files.” Valid imports recover after invalid input.
- The product satisfies the researched job: it imports numbered PNGs or an animated GIF, compares previous/current/next frames with independent controls, and exports a reference contact sheet. It does not claim to edit, host, interpolate, or sync artwork.

## Live deployment, privacy, and PWA

- `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test`: **37/37 passed in 47.0 s**. This confirms the deployed behavior, routes, metadata, keyboard controls, mobile layout, caching, and all claim tests.
- An independent live demo-flow request log contained only `https://onion-next-frame.sociobot.in`; no external requests, uploads, accounts, analytics, advertising, console errors, or page errors occurred on normal routes. The demo opened no `onion-next-frame` IndexedDB database.
- Browser response headers include same-origin CSP with `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and disabled camera/microphone/geolocation. The manifest has the expected `application/manifest+json` MIME type.
- A first-visit live demo was taken offline and reloaded successfully: it kept the demo banner and reported the six sample frames. The live service worker controlled the page with cache `onion-next-frame-v7`; `registration.update()` completed with no waiting/error state. The suite also verifies that the current cache generation is installed for update handling.
- This is a static local-first PWA with no product server endpoints, auth, billing/unlock call, or API allowance. 429/`Retry-After`, backend concurrency/persistence, and Entra-tenant checks do not apply.

## Accessibility, responsive QA, and performance

- Fresh live Axe scans of home, query demo, `/demo`, privacy, terms, and the 404 returned **0 serious and 0 critical** findings. Normal-route console and page errors were zero. (Chromium's expected non-2xx document diagnostic is isolated to the intentional 404 page.)
- At 390×844 CSS pixels, document width was exactly 390 with no horizontal overflow. The first Tab focused the skip link with a visible 3px cyan focus outline. The full suite confirms every visible enabled control meets the 44px target requirement. Reduced-motion mode limited observed durations to 0.00001 s.
- Visual inspection of fresh desktop and 390px mobile screenshots found no clipping, overlaps, hidden export controls, or illegible content.
- `npm run build` passed (`tsc --noEmit` plus Vite) and produced `dist/`. There is no separate lint script. The candidate outputs 37,270 bytes raw JavaScript (12.78 KB gzip), 18,125 bytes CSS (4.65 KB gzip), 114,936 bytes of emitted fonts, and a 12,814-byte mobile hero — within the stated PWA budgets. The hashed JS response is one-year immutable cached; HTML, manifest, and service worker revalidate.

## Findings by severity

No critical, high, medium, or low release findings.

## Verdict

**PASS.** Candidate `85c08b3f08efe57e7ed01955cc078f2214af4fca` was resolved at `origin/main` when tested, matches the live emitted asset hashes, passes all declared claims and the complete local/live suites, and meets the researched local-first animation-review contract.
