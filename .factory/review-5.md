# Adversarial first-read review 5 — Onion Next Frame

- Reviewed: 2026-08-29 UTC
- Work order: `onion-next-frame-review-5`
- Source: `97bd200b135e7b501232bfd6d84925668cf0cffb`
- Live target: <https://onion-next-frame.sociobot.in>
- Method: fresh Chromium contexts with service workers blocked for the cold read at 390×844 and 1440×900; fresh clone `/tmp/onion-next-frame-review-5-3t7rm6` for claims, build, and complete local/live suites.
- Verdict: **PASS** — zero blocking findings, zero minor findings, and zero untested claims.

## First read before scrolling

Both cold first screens answer all three questions without scrolling.

- **What it does:** compares an animation frame with the frames before and after it.
- **For whom:** pixel artists checking motion without changing their main editor.
- **What to click first:** **Try it with sample data**. The adjacent result says “Loads a 6-frame run cycle.”

The exact supporting text is “Compare animation frames,” “Compare the frames before and after,” and “For pixel artists checking motion between drawings without changing their main editor.” At 390×844, the primary action is y=326.6–374.6 and the three required facts are y=476.6–569.6. At 1440×900, the facts are y=615.4–724.4. Neither viewport has horizontal overflow or a console error.

## Findings

None.

## Copy audit

Counts are whitespace-delimited; symbols are omitted where they do not form words, and repeated control labels are marked with their occurrence count. Every landing and README sentence or visible label is included. No item exceeds 22 words. No banned marketing adjective, unexplained jargon, mood heading, metaphor, inconsistent task term, or non-result-naming task button remains.

### Landing page

| Text | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Onion Next Frame | 3 | Pass |
| Home | 1 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| Online / Ready offline / Offline mode | 1 / 2 / 2 | Pass; state-dependent |
| Compare animation frames | 3 | Pass |
| Compare the frames before and after | 6 | Pass |
| For pixel artists checking motion between drawings without changing their main editor. | 11 | Pass |
| Try it with sample data | 5 | Pass |
| Loads a 6-frame run cycle. | 5 | Pass |
| Import your frames (×2) | 3 | Pass |
| Free to use | 3 | Pass |
| Works offline after the first visit | 6 | Pass |
| Images stay on this device | 5 | Pass |
| Previous / Current / Next | 3 | Pass |
| Three pixel creature poses show the previous, current, and next animation frames. | 12 | Pass; image alternative |
| Frame comparison preview | 3 | Pass |
| Check the in-between drawing | 5 | Pass |
| Import numbered PNG files or one animated GIF. | 8 | Pass |
| File names set the frame order. | 6 | Pass |
| Your frame comparison appears here. | 5 | Pass |
| Choose numbered PNG files or an animated GIF. | 8 | Pass |
| Drop PNG or GIF files | 5 | Pass |
| FRAME — / — | 1 | Pass |
| No sequence loaded | 3 | Pass |
| Import frames or load the sample to start. | 8 | Pass |
| Layers | 1 | Pass |
| Color / Opacity | 2 | Pass |
| Previous frame / Current frame / Next frame | 2 each | Pass |
| Show layer (×3) | 2 | Pass |
| Opacity 28% / Opacity 100% / Opacity 28% | 2 each | Pass |
| Tint (×3) | 1 | Pass |
| Use tint (×3) | 2 | Pass |
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
| Adjust the frame layers | 4 | Pass |
| Set visibility, opacity, and tint for all three layers. | 9 | Pass |
| Export a contact sheet | 4 | Pass |
| Download one PNG with every source frame in order. | 9 | Pass |
| Limits and privacy | 3 | Pass |
| This is a reviewer, not an editor | 7 | Pass |
| It does not include painting, frame generation, accounts, collaboration, or sync. | 11 | Pass |
| Your browser decodes the images. | 5 | Pass |
| The app stores your latest real sequence in this browser. | 10 | Pass |
| Demo frames use memory only. | 5 | Pass |
| Read the privacy details | 4 | Pass |
| A local tool for comparing animation frames. | 7 | Pass |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| v1.0.0 · Generated artwork disclosed in the design notes. | 8 | Pass |

### README

| Sentence or heading | Words | Result |
| --- | ---: | --- |
| Onion Next Frame | 3 | Pass |
| Compare a pixel animation with its previous and next frames. | 9 | Pass |
| Onion Next Frame helps solo pixel artists and small game teams compare nearby animation frames beside their main editor. | 19 | Pass |
| It does not include painting, frame generation, accounts, collaboration, or sync. | 11 | Pass |
| Live site: https://onion-next-frame.sociobot.in | 3 | Pass |
| What it does | 3 | Pass |
| Imports numbered PNG files in number order and imports animated GIF frames. | 11 | Pass |
| Shows previous, current, and next drawings on one canvas. | 9 | Pass |
| Gives each layer its own visibility, opacity, and tint controls. | 10 | Pass |
| Exports every source frame in one PNG contact sheet. | 9 | Pass |
| Exports and imports a portable project JSON file. | 8 | Pass |
| Restores the latest real sequence from browser storage after a reload. | 11 | Pass |
| Works offline after the first successful visit. | 7 | Pass |
| Images stay on the device. | 5 | Pass |
| There is no account, upload, analytics, advertising, or payment gate. | 10 | Pass |
| Real projects stay in this browser. | 6 | Pass |
| The sample demo uses memory only. | 6 | Pass |
| Try the isolated demo | 4 | Pass |
| Open `/?demo=1` or <https://onion-next-frame.sociobot.in/?demo=1>. | 4 | Pass |
| Six original sample frames load immediately. | 6 | Pass |
| The demo banner remains visible while demo mode is active. | 10 | Pass |
| Reset demo restores the sample. | 5 | Pass |
| Start for real discards it and returns to an empty or previously saved project. | 14 | Pass |
| `/demo` remains available as a short link. | 7 | Pass |
| Demo details and its storage boundary are in `.factory/demo.md`. | 9 | Pass |
| Every product claim and its browser test are in `.factory/claims.json`. | 10 | Pass |
| Run locally | 2 | Pass |
| Requires Node.js 20 or newer. | 5 | Pass |
| Vite prints the local URL. | 5 | Pass |
| Open `/?demo=1` to load the sample. | 6 | Pass |
| Test and build | 3 | Pass |
| Playwright 1.58.2 is pinned because the factory image provides that browser version. | 12 | Pass |
| `npm test` builds and serves the production app before running the browser test suite. | 14 | Pass |
| The exact deploy command is `npm run build`. | 8 | Pass |
| Static output lands in `dist/`, with `dist/index.html` at its root. | 10 | Pass |
| Deploy | 1 | Pass |
| Upload `dist/` to the static host. | 6 | Pass |
| `staticwebapp.config.json` provides the history fallback, 404 page, security headers, and asset rules expected by Azure Static Web Apps. | 18 | Pass |
| Deployment, DNS, and billing stay outside this repository. | 8 | Pass |
| Browser notes | 2 | Pass |
| If PNG import fails, update your browser or use a current desktop browser. | 12 | Pass |
| If a GIF fails to import, export its frames as numbered PNG files. | 13 | Pass |
| Very large sequences can exceed this browser's storage limit. | 9 | Pass |
| Keep the original source files as a backup. | 8 | Pass |
| Product records | 2 | Pass |
| Brief | 1 | Pass |
| Visual thesis and asset provenance | 5 | Pass |
| Demo sandbox | 2 | Pass |
| Testable claims | 2 | Pass |
| Handoff | 1 | Pass |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

Terminology stays consistent: **frame** is one drawing, **sequence** is the ordered set, **layer** is one of the three overlays, **frame comparison** is the canvas, **contact sheet** is the PNG overview, **project** is the portable JSON, and **demo** is the isolated sample.

## Demo and sandbox behavior

- The first-screen action opens `/?demo=1` in one click.
- Its first 390×844 view contains the persistent banner at y=0–84, the populated comparison canvas at y=364.6–624.6, the `FRAME 03 / 06` transport at y=624.6–688.6, and all six frame controls at y=748.1–804.1.
- The sample is a realistic six-frame moth run cycle, not placeholder data.
- The banner says “Demo — sample data, nothing is saved” and supplies **Reset demo** and **Start for real**.
- Changing previous-frame opacity to 75% and choosing **Reset demo** restored 28% and frame 03.
- A fresh direct demo opened no IndexedDB database. The source keeps demo frames and settings in memory and bypasses `loadProject`, `saveProject`, and `clearProject`.
- `@claim:start-for-real` saved a real sequence, entered and changed the demo, then confirmed **Start for real** restored the untouched real sequence.
- The complete observed landing/demo request log contained only same-origin HTML, JS, CSS, font, and image requests. The live CSP restricts `connect-src` to self.

## Claims

Every exact `test` command in `.factory/claims.json` was run separately from clean clone `97bd200`. Each entry has exactly one matching `@claim:<id>` tag. No claim test failed and no landing/README product claim lacks an entry.

| Claim | Result | Observable check |
| --- | --- | --- |
| `demo-sandbox` | Pass | Memory-only demo, banner, reset, no app IndexedDB |
| `sample-six-frame-demo` | Pass | Frame 03/06 and six controls |
| `demo-first-viewport` | Pass | Seeded canvas and controls visible at both required widths |
| `sequence-import` | Pass | Numbered PNG order and animated GIF frames |
| `scope-boundaries` | Pass | No painting, generation, accounts, collaboration, or sync |
| `drag-drop-import` | Pass | Dropped PNG and GIF files load |
| `three-layer-preview` | Pass | Three independent layers and changed canvas pixels |
| `contact-sheet` | Pass | Downloaded PNG signature, dimensions, name, and six-frame status |
| `keyboard-shortcuts` | Pass | Arrows, Shift endpoints, and E export |
| `project-transfer` | Pass | Valid six-frame JSON export and import |
| `privacy-local` | Pass | Same-origin-only request log; no account or ad controls |
| `offline-reload` | Pass | Honest readiness state and functioning offline reload |
| `local-restore` | Pass | Imported real frames restore after reload |
| `start-for-real` | Pass | Demo changes do not replace saved real work |
| `free-use` | Pass | Free-use fact and no payment/account gate |

The build/setup statements were also checked: `npm ci` completed with zero audit vulnerabilities; the full clean suite passed 45/45; `npm run build` passed and produced `dist/index.html`; emitted JS is 13.20 KB gzip. The full deployed suite passed 45/45.

## Earlier findings rechecked

Every earlier review, polish record, and current handoff was read. Each prior finding was checked in current source and on the deployed site.

| Earlier id | Current confirmation |
| --- | --- |
| F-1-1 | The six-frame hero/README promise is listed as `sample-six-frame-demo`; its isolated test passes. |
| F-1-2 | Number ordering is named by `sequence-import`; the test observes frame 2 before frame 10. |
| F-1-3 | The unsupported evergreen-browser promise remains absent; README gives a recovery action. |
| F-1-4 | README remains count-free about suite size. |
| F-1-5 | The live section label is “How it works.” |
| F-1-6 | The live heading is “Compare frames in three steps.” |
| F-1-7 | The live section label is “Limits and privacy.” |
| F-1-8 | “It keeps the review surface small” remains absent. |
| F-1-9 | “Compare animation frames” and “Frame comparison preview” remain in place. |
| F-2-1 | The live hero has no baked or pseudo-element lettering; useful HTML alt text and legend remain. |
| F-2-2 | README names the users and comparison job without “review surface.” |
| F-2-3 | The footer says “A local tool for comparing animation frames.” |
| F-2-4 | README gives the numbered-PNG GIF recovery action without dependency jargon. |
| Verification-6 low | The one-frame clear confirmation uses singular “frame”; its regression test passes. |
| F-3-1 | The demo's populated canvas, counter, and frame controls fit both required first viewports. |
| F-3-2 | The header starts at “Online,” reaches “Ready offline” only after service-worker readiness, and reports offline mode truthfully. |
| F-3-3 | Scope boundaries are declared and tested by `scope-boundaries`. |
| F-3-4 | All three desktop facts fit inside 1440×900. |
| F-3-5 | Unknown documents return a designed HTTP 404 with shared shell, metadata, favicon, legal links, and **Return home**. |
| F-3-6 | Browser Back restores scroll and the previously focused control; clean and live regression tests pass. |
| F-3-7 | The empty state says “frame comparison,” not “onion preview.” |
| F-3-8 | Step two says “Adjust the frame layers.” |
| F-3-9 | Step three says “Export a contact sheet.” |
| F-3-10 | The console says “Color / Opacity,” not RGB/Alpha. |
| F-3-11 | README says number order, not natural sorting. |
| F-3-12 | README says real projects stay in this browser. |
| F-3-13 | README names the demo banner without a colour-only reference. |
| F-3-14 | README says the demo URL loads the sample. |
| F-3-15 | README states the browser storage consequence without IndexedDB jargon. |
| F-4-1 | All three facts now fit at y=476.6–569.6 in the cold 390×844 view; the direct viewport test passes locally and live. |

## Structure, accessibility, links, and identity

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` return 200. An unknown route returns the designed page with HTTP 404.
- Each route has the required title pattern, one `h1`, a plain meta description, canonical and Open Graph metadata, favicon, `lang=en`, main landmark, shared header/footer, and Privacy/Terms links.
- `robots.txt`, `sitemap.xml`, the manifest, Apple touch icon, and real 1200×630 social image are reachable.
- Deep links, History API navigation, Back scroll/focus restoration, route announcements, skip link, keyboard controls, visible focus, reduced motion, 44px targets, and 390px reflow pass.
- Every rendered landing link was crawled: all internal destinations and the external Param Factory link returned 200.
- The integrated Axe checks found zero serious or critical issues on home, both demo URLs, Privacy, Terms, and a missing route. `verify-url.sh` reported no console errors, one `h1`, `lang=en`, a main landmark, no missing image alternative, and no unlabeled button.
- The pixel-light-table layout, original runner art, pixel/body type pairing, cyan/magenta/amber layer language, clipped controls, and asymmetric workbench are recognisably product-specific rather than a generic SaaS template.

## Missed leverage

No missed-leverage finding applies. The brief's numbered PNG/GIF import, adjacent-frame comparison, independent controls, scrub/navigation, offline operation, contact-sheet export, and local project transfer are implemented. AI generation or remote sync would conflict with the explicit local reviewer boundary rather than complete the job.

## What would make this perfect

Nothing concrete remains to change. Preserve the current claim tests, cold mobile/desktop viewport checks, demo storage boundary, and per-route regression suite in future releases.
