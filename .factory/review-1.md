# Adversarial first-read review 1 — Onion Next Frame

- Reviewed: 2026-08-29 UTC
- Live target: <https://onion-next-frame.sociobot.in>
- Verdict: **FAIL**

## First read

Fresh Chromium contexts were used with service workers blocked for the cold landing read at 390×844 and 1440×900. Before scrolling, the answer was clear at both sizes:

- **What it does:** compare the animation frame before and after the current frame.
- **For whom:** pixel artists checking motion without changing their main editor.
- **What to click first:** **Try it with sample data**; its adjacent copy says it loads a six-frame run cycle.

The mobile screen also includes the three facts and has no horizontal overflow. The identity is a distinct pixel-light-table workbench, not a generic SaaS layout. This first-read gate passes.

## Findings

### F-1-1 — BLOCKING — the landing's six-frame promise is not a listed claim

- **Quote/location:** “Loads a 6-frame run cycle.” — landing hero, beside **Try it with sample data**.
- **Why:** This is a quantitative promise that a visitor can rely on. No entry in `.factory/claims.json` names it or lists the landing hero in `where`. The existing `demo-sandbox` test happens to observe six frames, but its declared claim is only “The sample demo saves nothing and does not read the real project.” The claim record therefore does not document what the hero promises.
- **Fix:** Add `sample-six-frame-demo` with claim “The sample demo loads a six-frame run cycle”, `where: "landing hero, README"`, and a dedicated `@claim:sample-six-frame-demo` assertion from a fresh `/demo` context; or remove the number from the hero.

### F-1-2 — BLOCKING — the advertised filename ordering is not a listed claim

- **Quote/location:** “File names set the frame order.” — landing light-table introduction; “Imports naturally sorted PNG sequences” — README, *What it does*.
- **Why:** Ordering determines whether the tool is useful for animation review. `sequence-import` is declared only as importing numbered PNGs and animated GIF frames, so this extra sorting promise is absent from the claim text and `where` fields even though its current test incidentally imports `frame-2.png` and `frame-10.png`.
- **Fix:** Change the declared claim to “Imports numbered PNG files in natural filename order and animated GIF frames”, add both locations to `where`, and retain an explicit observable order assertion in its tagged test.

### F-1-3 — BLOCKING — README makes an unlisted browser-compatibility claim

- **Quote/location:** “Current evergreen browsers can import PNG files.” — README, *Browser notes*.
- **Why:** This is a visitor-facing compatibility promise with no matching claim entry or cross-browser test. A first-time visitor could choose the product based on it.
- **Fix:** Add a `png-browser-support` claim with supported browser versions and a test matrix, or replace it with the actionable, non-promissory note: “If PNG import fails, update your browser or use a current desktop browser.”

### F-1-4 — Minor — README reports the wrong test-suite size

- **Quote/location:** “`npm test` builds and serves the production app before running 17 browser tests.” — README, *Test and build*.
- **Why:** A fresh clean-clone run completed **21** browser tests. The number is therefore inaccurate and conflicts with the current handoff.
- **Fix:** Write “runs the browser test suite” (preferred, since the count changes), or update the number whenever the suite changes.

### F-1-5 — Minor — “Three keys” is a decorative heading with no section name

- **Quote/location:** “Three keys” — landing, eyebrow above the three-step section.
- **Why:** It neither tells a screen-reader user nor a cold visitor that the section explains the workflow. It is a metaphor/mood label prohibited by the attached plain-words rules.
- **Fix:** Replace it with “How it works”.

### F-1-6 — Minor — “From files to a useful reference” is not a plain section heading

- **Quote/location:** “From files to a useful reference” — landing, `h2` in the workflow section.
- **Why:** The phrase describes a mood/outcome rather than naming the section, and “reference” is not a defined product term.
- **Fix:** Replace it with “Compare frames in three steps”.

### F-1-7 — Minor — “Operator note” adds role-play instead of useful context

- **Quote/location:** “Operator note” — landing, eyebrow above the product limits and privacy section.
- **Why:** The label carries no information about the section and makes the important non-editor/privacy information harder to scan.
- **Fix:** Replace it with “Limits and privacy”.

### F-1-8 — Minor — a sentence is vague and adds no usable information

- **Quote/location:** “It keeps the review surface small.” — landing, limits-and-privacy section.
- **Why:** “Review surface” is unexplained jargon and “small” is a subjective adjective. The preceding sentence already gives the useful, concrete limits.
- **Fix:** Delete the sentence.

### F-1-9 — Minor — two landing labels use unexplained specialist jargon

- **Quote/location:** “A light table for frame sequences” — hero eyebrow; “Live onion preview” — light-table eyebrow.
- **Why:** “Light table” and “onion” are not introduced before use. The `h1` eventually supplies the job, but these labels do not make sense alone as section labels to a cold visitor.
- **Fix:** Use “Compare animation frames” and “Frame comparison preview”, or remove the decorative eyebrows.

## Copy audit

Counts use whitespace-delimited words. This includes visible prose, headings, control labels, and persistent status/footer text on the landing page; dynamic success/error strings are not landing copy. `*` marks a finding above.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Onion Next Frame | 3 | Pass |
| Home | 1 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| Ready offline | 2 | Pass |
| A light table for frame sequences | 6 | Flag F-1-9 |
| Compare the frames before and after | 6 | Pass |
| For pixel artists checking motion between drawings without changing their main editor. | 11 | Pass |
| Try it with sample data | 5 | Pass |
| Loads a 6-frame run cycle. | 5 | Flag F-1-1 |
| Import your frames | 3 | Pass |
| Free to use | 3 | Pass |
| Works offline after the first visit | 6 | Pass |
| Images stay on this device | 5 | Pass |
| PREVIOUS / CURRENT / NEXT | 3 | Pass |
| Live onion preview | 3 | Flag F-1-9 |
| Check the in-between drawing | 5 | Pass |
| Import numbered PNG files or one animated GIF. | 8 | Pass |
| File names set the frame order. | 6 | Flag F-1-2 |
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
| Three keys | 2 | Flag F-1-5 |
| From files to a useful reference | 6 | Flag F-1-6 |
| Import the sequence | 3 | Pass |
| Select numbered PNG files or one animated GIF. | 8 | Pass |
| Tune each neighbour | 3 | Pass |
| Set visibility, opacity, and tint for all three layers. | 9 | Pass |
| Export the sheet | 3 | Pass |
| Download one PNG with every source frame in order. | 9 | Pass |
| Operator note | 2 | Flag F-1-7 |
| This is a reviewer, not an editor | 7 | Pass |
| It does not paint, interpolate, host, or sync artwork. | 9 | Pass |
| It keeps the review surface small. | 6 | Flag F-1-8 |
| Your browser decodes the images. | 5 | Pass |
| The app stores your latest real sequence in this browser. | 10 | Pass |
| Demo frames use memory only. | 5 | Pass |
| Read the privacy details | 4 | Pass |
| A local light table for animation frames. | 7 | Pass |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| v1.0.0 · Generated artwork disclosed in the design notes. | 8 | Pass |

No landing sentence exceeds 22 words. No banned marketing adjective appears. The terms `frame`, `sequence`, `layer`, `contact sheet`, `project`, and `demo` are otherwise used consistently. All non-navigation controls use result-naming verbs.

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Compare a pixel animation with its previous and next frames. | 9 | Pass |
| Onion Next Frame is a small review surface for solo pixel artists and tiny game teams. | 16 | Pass |
| It sits beside a main editor. | 6 | Pass |
| It does not add painting, hosting, collaboration, or generated frames. | 10 | Pass |
| Imports naturally sorted PNG sequences and animated GIF frames. | 8 | Flag F-1-2 |
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
| Open `/demo` or https://onion-next-frame.sociobot.in/demo. | 4 | Pass |
| Six original sample frames load immediately. | 6 | Flag F-1-1 |
| The cyan banner remains visible while demo mode is active. | 10 | Pass |
| Reset demo restores the sample. | 5 | Pass |
| Start for real discards it and returns to an empty or previously saved project. | 15 | Pass |
| Demo details and its storage boundary are in `.factory/demo.md`. | 8 | Pass |
| Every product claim and its browser test are in `.factory/claims.json`. | 10 | Pass |
| Requires Node.js 20 or newer. | 5 | Pass |
| Vite prints the local URL. | 5 | Pass |
| Open `/demo` for the seeded path. | 6 | Pass |
| Playwright 1.58.2 is pinned because the factory image provides that browser version. | 12 | Pass |
| `npm test` builds and serves the production app before running 17 browser tests. | 13 | Flag F-1-4 |
| The exact deploy command is `npm run build`. | 8 | Pass |
| Static output lands in `dist/`, with `dist/index.html` at its root. | 9 | Pass |
| Upload `dist/` to the static host. | 6 | Pass |
| `staticwebapp.config.json` provides the history fallback, 404 page, security headers, and asset rules expected by Azure Static Web Apps. | 16 | Pass |
| Deployment, DNS, and billing stay outside this repository. | 8 | Pass |
| Current evergreen browsers can import PNG files. | 7 | Flag F-1-3 |
| Animated GIF disposal modes are decoded in-browser with `gifuct-js`. | 9 | Pass |
| Very large sequences can reach the browser's IndexedDB quota. | 9 | Pass |
| Original source files remain the backup. | 6 | Pass |
| MIT. See `LICENSE`. | 3 | Pass |

No README sentence exceeds 22 words. Its terms are consistent with the app.

## Demo, privacy, and claim verification

- Clicking **Try it with sample data** opened `/demo` in one click. Its first screen already showed `FRAME 03 / 06`, the six-frame sample, the persistent “Demo — sample data, nothing is saved” banner, **Reset demo**, and **Start for real**.
- In a context with a saved real two-frame project, changing demo settings and resetting returned the prior opacity to 28%. **Start for real** restored the untouched real project (`FRAME 02 / 02`). The demo did not replace it.
- A complete live landing → demo → reset → real flow emitted only same-origin requests. No external runtime request, iframe, account field, analytics, or advertising control was observed. The live CSP has `connect-src 'self'`.
- The clean clone at `/tmp/onion-review-FfhZlS` installed successfully with no audit vulnerabilities. Each of the nine exact commands in `.factory/claims.json` passed individually. `npm test` passed 21/21 and `npm run build` produced `dist/`. The live run `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test` also passed 21/21.

| Claim id | Clean-clone command | Result |
| --- | --- | --- |
| demo-sandbox | `npm test -- --grep @claim:demo-sandbox` | Pass |
| sequence-import | `npm test -- --grep @claim:sequence-import` | Pass |
| three-layer-preview | `npm test -- --grep @claim:three-layer-preview` | Pass |
| contact-sheet | `npm test -- --grep @claim:contact-sheet` | Pass |
| project-transfer | `npm test -- --grep @claim:project-transfer` | Pass |
| privacy-local | `npm test -- --grep @claim:privacy-local` | Pass |
| offline-reload | `npm test -- --grep @claim:offline-reload` | Pass |
| local-restore | `npm test -- --grep @claim:local-restore` | Pass |
| free-use | `npm test -- --grep @claim:free-use` | Pass |

## History, structure, and links

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. The existing handoff and verification records were read in full. The two prior release defects are fixed in both live behavior and source configuration:

| Earlier finding | Confirmation |
| --- | --- |
| Hashed JS/CSS lacked immutable caching | Live emitted JS/CSS responses return `Cache-Control: public, max-age=31536000, immutable`; `public/staticwebapp.config.json` contains the matching `/assets/*` rule. |
| 390 px controls were below 44×44 px | The live 21-test suite's mobile touch-target test passed; the source gives the relevant header, footer, privacy, and button controls minimum 44 px dimensions. |

The site has per-route titles, one `h1` per route, descriptions, canonical URLs, OG/Twitter metadata, SVG favicon and Apple touch icon, `lang=en`, robots/sitemap, a styled missing-frame page, SPA deep links, back navigation, focus movement, route announcements, skip link, persistent Privacy/Terms footer links, and visible focus states. All rendered internal links plus the external Param Factory link returned HTTP 200. The live test suite covers serious/critical Axe findings, keyboard/history/focus, the 390 px layout, metadata, CSP, service worker generation, and immutable asset caching.

The brief does not imply an AI, sync, or additional import/export feature beyond what is already present. An AI feature would be decorative here and is not a missed-leverage finding.

## What would make this perfect

Make the claim manifest faithfully name every visitor-facing promise, correct the stale README test count, and replace the five decorative/jargon labels identified above with the proposed plain-language copy. Then rerun the full clean-clone claim suite and repeat this cold-read review.
