# Onion Next Frame — independent verification 7

**Result: FAIL — the requested candidate cannot be checked out or matched to the deployment, and the claims inventory is incomplete.**

- Requested candidate: `59a3f08103317357160047c6efbb28bc96c434d1`
- Available checkout/base: `59a3f077a72799d641a16fb34f3e75cdc8283d9c`
- Remote `main`: `59a3f077a72799d641a16fb34f3e75cdc8283d9c`
- Live URL: <https://onion-next-frame.sociobot.in>
- Verified: 2026-08-29 UTC
- Work order: `onion-next-frame-verify-7`
- Product code changed by verifier: none

The live product is functional and byte-identical to the available base commit. The earlier deployment-only failure is not present in that build. Acceptance still fails because Git and the remote both reject the requested candidate SHA, so its source cannot be tested and live/candidate identity cannot be established. The mandatory claims audit also found visible interaction promises without claim entries and tagged tests.

## Release-blocking findings

### Critical — requested candidate does not exist in the clone or remote

`git cat-file -e 59a3f081...^{commit}` reports the object missing. Fetching that SHA returns `fatal: remote error: upload-pack: not our ref`. `git ls-remote origin` exposes only `59a3f077...` as `HEAD` and `refs/heads/main`.

The available `59a3f077...` build and live deployment match byte-for-byte across all 31 deployable files. That proves the live site corresponds to the available base, not that it corresponds to the requested candidate. A release cannot pass when its nominated artifact is unavailable.

Evidence: `.factory/qa-evidence-7/candidate-identity.txt`, `.factory/qa-evidence-7/deployment-hashes.txt`.

### High — `.factory/claims.json` omits visitor-facing claims

The manifest has 10 entries and each has exactly one matching `@claim:<id>` test, but the product makes additional observable promises that have no manifest entry:

- “Drop PNG or GIF files” / the researched brief's drag-in flow.
- “Keyboard: ← → changes frames. Shift jumps to an end.” and the `E` export shortcut.
- README/demo guidance that “Start for real” discards demo state and returns to an empty or previously saved project.

No tagged claim test covers these promises. The existing quality test exercises Arrow Right only; it does not make the keyboard promise a declared claim or prove Shift and `E`. Manual QA confirmed drag/drop, Shift, `E`, and restoration after leaving demo currently work, but manual evidence does not satisfy the contract that every visitor-facing claim be present in `claims.json` with one tagged sandbox test.

Evidence: `.factory/qa-evidence-7/claim-cross-check.txt`, `.factory/qa-evidence-7/drag-drop.json`, `.factory/qa-evidence-7/manual-live.json`.

## Mandatory opening gates

### Claims — functional rerun PASS (10/10), inventory completeness FAIL

The first literal invocation in the dependency-free clone could not load `@playwright/test`. After the required `npm ci`, every exact command from `.factory/claims.json` passed separately:

| Claim | Result after install |
| --- | --- |
| `demo-sandbox` | PASS, 1/1 |
| `sample-six-frame-demo` | PASS, 1/1 |
| `sequence-import` | PASS, 1/1 |
| `three-layer-preview` | PASS, 1/1 |
| `contact-sheet` | PASS, 1/1 |
| `project-transfer` | PASS, 1/1 |
| `privacy-local` | PASS, 1/1 |
| `offline-reload` | PASS, 1/1 |
| `local-restore` | PASS, 1/1 |
| `free-use` | PASS, 1/1 |

Evidence: `.factory/qa-evidence-7/claims-after-install.txt`.

### Cold first read and one-click demo — PASS

The cold live screen answers all three questions without scrolling:

- What: “Compare the frames before and after.”
- For whom: “For pixel artists checking motion between drawings without changing their main editor.”
- First click: “Try it with sample data,” beside “Loads a 6-frame run cycle.”

One click opens `/?demo=1` with frame 03/06, six frame controls, sample artwork, and the persistent “Demo — sample data, nothing is saved” banner with Reset demo and Start for real. A fresh context opened directly at the demo created no IndexedDB database.

Evidence: `.factory/qa-evidence-7/live-cold-independent.png`, `.factory/qa-evidence-7/manual-live.json`.

## Repository gates on the available base

- `npm ci`: PASS; 28 packages installed, 0 audit findings.
- All exact claim commands: PASS, 10/10 after install.
- `npm test`: PASS, 34/34 against the local production preview.
- `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test`: PASS, 34/34 live.
- `npx tsc --noEmit`: PASS.
- `npm run build`: PASS; creates `dist/index.html`.
- `npm audit --omit=dev`: PASS, 0 vulnerabilities.
- No lint script exists in `package.json`.
- Factory `verify-url.sh`: PASS live; HTTP 200, title, `lang=en`, one h1, main, alt/button smoke checks, and no console errors.

These results apply to `59a3f077...`, not the unavailable requested SHA.

## Independent end-to-end behavior

- Demo reset returns to frame 03/06. Arrow Right moves to 04/06 and Shift+Right to 06/06.
- Changing previous-layer opacity to 41% changed the rendered canvas pixels independently.
- `E` exported a valid 880×560 PNG contact sheet, 31,138 bytes, containing the six sample frames.
- Project export produced format `onion-next-frame`, version 1, with six embedded frames; re-import succeeded.
- Reverse-selected `run-100.png` through `run-001.png` imported as 100 naturally ordered controls. Export produced a valid 880×6356 PNG, 255,161 bytes.
- A one-frame sequence showed 01/01, disabled both neighbour buttons, persisted through reload, used singular confirmation copy, and remained after cancel.
- A previously saved real one-frame sequence returned after changing the demo and choosing Start for real, showing the demo did not replace real data.
- Invalid extension, corrupt PNG, malformed JSON, and invalid layer settings produced actionable messages. The existing sequence remained usable, and valid GIF/project imports recovered.
- Drag/drop imported a PNG successfully.
- Home, query demo, `/demo`, `/privacy`, and `/terms` return 200 with route-specific titles, one h1, and one main. The designed missing route returns a real 404. Every rendered internal/external link checked returned 200.

Evidence: `.factory/qa-evidence-7/manual-live.json`, `.factory/qa-evidence-7/drag-drop.json`, `.factory/qa-evidence-7/routes-links.json`.

## Accessibility, keyboard, mobile, and motion

- Axe: zero serious/critical findings on home, demo, and 390×844 demo; the repository suite also covers privacy, terms, and 404.
- Lighthouse accessibility: 100.
- Keyboard focus begins with the skip link. The first eight targets all show a 3 px cyan outline and are at least 44 px high.
- Keyboard frame navigation, Shift jump, `E` export, SPA route focus, browser back, and native range-key behavior work.
- At 390×844, width is exactly 390 px, body text is 17 px, the workbench/export remain visible, and no enabled link/button/input is under 44×44 px.
- A 640 CSS-pixel reflow proxy for 200% zoom has no horizontal overflow or clipped elements.
- Reduced-motion mode limits observed animation and transition durations to 0.01 ms.
- Desktop and mobile screenshots were visually inspected; no clipping, overlap, illegible text, or product-inconsistent generic styling was found.

Evidence: `.factory/qa-evidence-7/manual-live.json`, `.factory/qa-evidence-7/live-demo-desktop.png`, `.factory/qa-evidence-7/live-mobile-independent.png`, `.factory/qa-evidence-7/reflow-640.json`.

## Privacy, requests, headers, and server scope

The complete independent flow logged 48 browser requests. Every request was same-origin; none failed. There were no trackers, uploads, analytics, ads, iframes, password fields, console errors, or page errors. Source inspection found no runtime API, billing/unlock, AI, or authentication request.

The live main response includes CSP restricted to self/data/blob as needed, `frame-ancestors 'none'` in the response header, HSTS with subdomains/preload, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and camera/microphone/geolocation disabled. The manifest uses the correct MIME type.

This is a static local-first PWA and exposes no server-side product endpoint. API concurrency, persistence concurrency, health/build identity, and the 429/`Retry-After` allowance check do not apply. It has no sign-in, so the Entra authority check does not apply. Library/CLI consumer installation does not apply.

Evidence: `.factory/qa-evidence-7/manual-live.json`, `.factory/qa-evidence-7/live-root-headers.txt`, `.factory/qa-evidence-7/external-call-audit.txt`.

## PWA, caching, deployment, and performance

- Fresh live service worker controls `/demo` with cache `onion-next-frame-v7`. Offline reload retains frame 03/06, demo banner, and reports “Offline mode.”
- A clean local v6→v7 update simulation showed “An updated frame is ready,” applied through “Load update,” removed v6, retained the demo, and produced no errors.
- Manifest parsing reports no errors and includes standalone display, versioned start URL, 192/512/maskable icons, and matching dark theme/background colours.
- HTML, manifest, and service worker revalidate after 30 seconds. Hashed JS/CSS use one-year immutable caching. Unversioned hero art revalidates.
- Live and the available build match for 31/31 served files, with zero mismatches.

Budgets from the exact build and live Lighthouse mobile run:

- JavaScript: 37,270 bytes raw / 12,693 gzip (≤200 KB).
- CSS: 18,125 bytes raw / 4,655 gzip (≤50 KB).
- Emitted fonts: 114,936 bytes (≤120 KB).
- Mobile hero: 12,814 bytes (≤300 KB).
- Lighthouse: Performance 90, Accessibility 100, Best Practices 100, SEO 100.
- FCP 1.203 s, LCP 1.230 s, CLS 0.000024, total transfer 117,423 bytes.
- Three interactions under 4× CPU throttling peaked at 96 ms Event Timing duration (<200 ms).

Evidence: `.factory/qa-evidence-7/sw-update.json`, `.factory/qa-evidence-7/app-manifest-cdp.json`, `.factory/qa-evidence-7/cache-headers.txt`, `.factory/qa-evidence-7/bundle-sizes.txt`, `.factory/qa-evidence-7/lighthouse-live.json`, `.factory/qa-evidence-7/interaction-latency.json`.

## Findings by severity

- Critical: requested candidate commit is unavailable, so candidate testing and candidate/live identity are impossible.
- High: the mandatory claims inventory omits drag/drop, keyboard shortcut, and Start-for-real promises.
- Medium: none.
- Low: none.

## Verdict

The deployed build currently performs the researched job well, is private/local, accessible, fast, and fully functional offline. Fresh evidence also shows the earlier deployment-only failure is absent for the available base. Nevertheless, the nominated release artifact cannot be resolved and the claims contract is incomplete. **FAIL.**
