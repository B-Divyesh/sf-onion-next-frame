# Adversarial first-read review 2 — Onion Next Frame

- Reviewed: 2026-08-29 UTC
- Live target: <https://onion-next-frame.sociobot.in>
- Method: fresh Chromium contexts at 390×844 and 1440×900, with service workers blocked for the cold landing read; a separate clean checkout at `/tmp/onion-next-frame-review-2` for claim and build work.
- Verdict: **FAIL** — four minor copy/asset findings remain. No blocking functional, demo, claim, privacy, or routing defect was reproduced.

## First read

Before scrolling, both cold viewports answer the required questions.

- **What it does:** “Compare the frames before and after.”
- **For whom:** “For pixel artists checking motion between drawings without changing their main editor.”
- **What to click first:** **Try it with sample data**. The adjacent outcome is “Loads a 6-frame run cycle.”

At 390 px the action and outcome are fully visible, targets fit the viewport, and there is no horizontal overflow (`scrollWidth: 390`). The mobile and desktop compositions are a distinct pixel-light-table workbench, not a generic SaaS layout. This opening gate passes.

## Findings

### F-2-1 — Minor — the hero contains inaccessible decorative text that contradicts the visual thesis

- **Quote/location:** “FRAME STUDY / 03” is baked into the right side of the landing hero raster. It is visible at desktop and mobile widths but absent from the image alternative.
- **Why:** It carries no task information, is unreadable to assistive technology, and is a decorative label prohibited by the plain-words rules. It also contradicts `.factory/design.md`, whose original-art specification says “no text, no letters.” A visitor cannot tell whether it is a feature label, an example file name, or decoration.
- **Fix:** Regenerate or crop the hero so it contains no lettering. Do not replace it with another slogan. Keep the accessible, useful `PREVIOUS / CURRENT / NEXT` legend in HTML.

### F-2-2 — Minor — the README introduces unexplained “review surface” jargon

- **Quote/location:** “Onion Next Frame is a small review surface for solo pixel artists and tiny game teams.” — README introduction.
- **Why:** “Review surface” is product-internal language, and “small” is subjective. Neither tells a first-time reader what they can do. The next sentence, “It sits beside a main editor,” is also too abstract when read alone.
- **Fix:** Replace both sentences with: “Onion Next Frame helps solo pixel artists and small game teams compare nearby animation frames beside their main editor.”

### F-2-3 — Minor — the footer repeats undefined “light table” jargon

- **Quote/location:** “A local light table for animation frames.” — landing footer.
- **Why:** The footer is encountered out of context and should provide a plain product one-liner. “Light table” is a studio metaphor, not a defined action; it repeats the ambiguity that the hero has otherwise avoided.
- **Fix:** Replace it with: “A local tool for comparing animation frames.”

### F-2-4 — Minor — the README browser note exposes implementation jargon without an action

- **Quote/location:** “Animated GIF disposal modes are decoded in-browser with `gifuct-js`.” — README, Browser notes.
- **Why:** “Disposal modes” and a dependency name do not help a visitor decide what to do. The sentence is implementation detail rather than a usable compatibility note.
- **Fix:** Replace it with: “If a GIF fails to import, export its frames as numbered PNG files.”

## Copy audit

Counts use whitespace-delimited words. The landing table includes visible labels and status text because a cold visitor encounters them; all landing prose is at or below the 22-word cap. `*` marks a finding above.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Onion Next Frame | 3 | Pass |
| Home | 1 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| Ready offline | 2 | Pass |
| Compare animation frames | 3 | Pass |
| Compare the frames before and after | 6 | Pass |
| For pixel artists checking motion between drawings without changing their main editor. | 11 | Pass |
| Try it with sample data | 5 | Pass |
| Loads a 6-frame run cycle. | 5 | Pass |
| Import your frames | 3 | Pass |
| Free to use | 3 | Pass |
| Works offline after the first visit | 6 | Pass |
| Images stay on this device | 5 | Pass |
| Previous / Current / Next | 3 | Pass |
| Frame comparison preview | 3 | Pass |
| Check the in-between drawing | 5 | Pass |
| Import numbered PNG files or one animated GIF. | 8 | Pass |
| File names set the frame order. | 6 | Pass |
| Your onion preview appears here. | 5 | Pass |
| Choose numbered PNG files or an animated GIF. | 8 | Pass |
| Drop PNG or GIF files | 5 | Pass |
| No sequence loaded | 3 | Pass |
| Import frames or load the sample to start. | 8 | Pass |
| Show layer | 2 | Pass |
| Opacity 28% | 2 | Pass |
| Tint | 1 | Pass |
| Use tint | 2 | Pass |
| Import frames | 2 | Pass |
| Export contact sheet | 3 | Pass |
| Import project | 2 | Pass |
| Export project | 2 | Pass |
| Clear sequence | 2 | Pass |
| Keyboard: ← → changes frames. | 5 | Pass |
| Shift jumps to an end. | 5 | Pass |
| How it works | 3 | Pass |
| Compare frames in three steps | 5 | Pass |
| Import the sequence | 3 | Pass |
| Select numbered PNG files or one animated GIF. | 8 | Pass |
| Tune each neighbour | 3 | Pass |
| Set visibility, opacity, and tint for all three layers. | 9 | Pass |
| Export the sheet | 3 | Pass |
| Download one PNG with every source frame in order. | 9 | Pass |
| Limits and privacy | 3 | Pass |
| This is a reviewer, not an editor | 7 | Pass |
| It does not paint, interpolate, host, or sync artwork. | 9 | Pass |
| Your browser decodes the images. | 5 | Pass |
| The app stores your latest real sequence in this browser. | 10 | Pass |
| Demo frames use memory only. | 5 | Pass |
| Read the privacy details | 4 | Pass |
| A local light table for animation frames. | 7 | Flag F-2-3 |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| v1.0.0 · Generated artwork disclosed in the design notes. | 8 | Pass |

The baked, non-DOM image lettering “FRAME STUDY / 03” is separately flagged as F-2-1; it cannot be word-counted or announced consistently by the page.

### README

| Sentence or bullet | Words | Result |
| --- | ---: | --- |
| Compare a pixel animation with its previous and next frames. | 9 | Pass |
| Onion Next Frame is a small review surface for solo pixel artists and tiny game teams. | 16 | Flag F-2-2 |
| It sits beside a main editor. | 6 | Flag F-2-2 |
| It does not add painting, hosting, collaboration, or generated frames. | 10 | Pass |
| Imports naturally sorted PNG sequences and animated GIF frames. | 8 | Pass |
| Shows previous, current, and next drawings on one canvas. | 9 | Pass |
| Gives each layer its own visibility, opacity, and tint controls. | 10 | Pass |
| Exports every source frame in one PNG contact sheet. | 9 | Pass |
| Exports and imports a portable project JSON file. | 8 | Pass |
| Restores the latest real sequence from browser storage after a reload. | 11 | Pass |
| Works offline after the first successful visit. | 7 | Pass |
| Images stay on the device. | 5 | Pass |
| There is no account, upload, analytics, advertising, or payment gate. | 10 | Pass |
| Real projects use IndexedDB. | 4 | Pass |
| The sample demo uses memory only. | 6 | Pass |
| Open `/?demo=1` or <https://onion-next-frame.sociobot.in/?demo=1>. | 4 | Pass |
| Six original sample frames load immediately. | 6 | Pass |
| The cyan banner remains visible while demo mode is active. | 10 | Pass |
| Reset demo restores the sample. | 5 | Pass |
| Start for real discards it and returns to an empty or previously saved project. | 15 | Pass |
| `/demo` remains available as a short link. | 8 | Pass |
| Demo details and its storage boundary are in `.factory/demo.md`. | 8 | Pass |
| Every product claim and its browser test are in `.factory/claims.json`. | 10 | Pass |
| Requires Node.js 20 or newer. | 5 | Pass |
| Vite prints the local URL. | 5 | Pass |
| Open `/?demo=1` for the seeded path. | 6 | Pass |
| Playwright 1.58.2 is pinned because the factory image provides that browser version. | 12 | Pass |
| `npm test` builds and serves the production app before running the browser test suite. | 14 | Pass |
| The exact deploy command is `npm run build`. | 8 | Pass |
| Static output lands in `dist/`, with `dist/index.html` at its root. | 9 | Pass |
| Upload `dist/` to the static host. | 6 | Pass |
| `staticwebapp.config.json` provides the history fallback, 404 page, security headers, and asset rules expected by Azure Static Web Apps. | 16 | Pass |
| Deployment, DNS, and billing stay outside this repository. | 8 | Pass |
| If PNG import fails, update your browser or use a current desktop browser. | 12 | Pass |
| Animated GIF disposal modes are decoded in-browser with `gifuct-js`. | 8 | Flag F-2-4 |
| Very large sequences can reach the browser's IndexedDB quota. | 9 | Pass |
| Original source files remain the backup. | 6 | Pass |
| MIT. See `LICENSE`. | 3 | Pass |

No reader-facing sentence exceeded 22 words. Claim-like copy was checked against `.factory/claims.json`; the tested claim records cover the sample, imports, layers, exports, project transfer, local restore, privacy, offline use, and free access. No unlisted claim was found.

## Demo, sandbox, claims, and privacy

- **One-click demo:** **Try it with sample data** opens `/?demo=1`. Its first rendered state already has `FRAME 03 / 06`, six frame controls, realistic pixel-runner frames, and the persistent “Demo — sample data, nothing is saved” banner with **Reset demo** and **Start for real**.
- **Isolation:** the clean claim test checks that direct demo entry creates no `onion-next-frame` IndexedDB database, and reset restores the default 28% previous-layer opacity. Source review confirms `initializeTool(true)` uses the in-memory sample branch and does not invoke `loadProject`, `saveProject`, or `clearProject`.
- **Claims:** all ten exact commands in `.factory/claims.json` passed independently from the clean checkout: `demo-sandbox`, `sample-six-frame-demo`, `sequence-import`, `three-layer-preview`, `contact-sheet`, `project-transfer`, `privacy-local`, `offline-reload`, `local-restore`, and `free-use` (one passing test each).
- **Privacy/offline:** the clean and live `@claim:privacy-local` request-log test passed; observed demo requests are same-origin, with no iframe or password control. The clean and live `@claim:offline-reload` test passed after service-worker installation. The live response CSP restricts `connect-src` to `'self'`.
- **Broader checks:** `npm test` passed 32/32 locally and 32/32 against the live URL. `npm run build` passed and created `dist/`.

## Earlier findings rechecked

| Earlier id or record | Live and code confirmation |
| --- | --- |
| F-1-1 (six-frame promise) | Fixed: `sample-six-frame-demo` is declared, its hero/README locations are recorded, and the dedicated tagged test passed. |
| F-1-2 (natural filename order) | Fixed: the declared import claim names natural order and its test observes `frame-2.png` before `frame-10.png`. |
| F-1-3 (browser compatibility promise) | Fixed: the unsupported evergreen-browser promise is absent; the README gives recovery guidance. |
| F-1-4 (stale test count) | Fixed: README names the browser suite without an inaccurate count. |
| F-1-5 through F-1-7 (mood headings) | Fixed: live labels are “How it works,” “Compare frames in three steps,” and “Limits and privacy.” |
| F-1-8 (vague review-surface landing sentence) | Fixed on the landing page: “It keeps the review surface small” is absent. F-2-2 identifies the separate surviving README use. |
| F-1-9 (light-table/onion labels) | Fixed in the hero/tool labels: live shows “Compare animation frames” and “Frame comparison preview.” |
| Prior handoff: singular restore/clear grammar | Fixed: the clean suite includes and passes the one-frame singular restore test; current source uses a singular restore message. |
| Verification cache and touch-target blockers | Fixed: live full suite passes immutable-cache and 390 px 44×44 target tests. |
| Verification malformed-project blocker and GIF recovery | Fixed: live full suite passes atomic invalid-settings recovery and corrupt-GIF recovery tests. |

## Structure, routes, and leverage

All checked product links returned the expected response: `/`, `/demo`, `/?demo=1`, `/privacy`, `/terms`, `/404.html`, `robots.txt`, `sitemap.xml`, and the manifest returned 200; an unknown document returned the designed 404 with HTTP 404; the Param Factory link returned 200. The sitemap lists all application routes.

The live suite verifies per-route titles, one `h1`, description/canonical/OG/Twitter data, focus on SPA navigation, history back navigation, a skip link, serious/critical Axe findings, service-worker cache generation, and the 390 px layout. The current live headers include an enforced self-only CSP with response-header `frame-ancestors 'none'`, plus `nosniff` and a strict referrer policy. Privacy and Terms are in the global footer.

The brief calls for local comparison, portable project transfer, and a contact sheet; those are present. AI interpolation, remote sync, or an account would exceed the stated privacy-focused reviewer role, so no AI/sync missed-leverage finding applies.

## What would make this perfect

Remove the raster hero’s decorative lettering, replace the three jargon-heavy pieces of copy with the proposed plain wording, rerun the copy audit, and keep the existing clean-claim and live-suite checks green. A subsequent review can pass only if those four findings are gone and no new finding appears.
