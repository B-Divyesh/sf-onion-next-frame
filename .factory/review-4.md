# Adversarial first-read review 4 — Onion Next Frame

- Reviewed: 2026-08-29 UTC
- Live target: <https://onion-next-frame.sociobot.in>
- Source reviewed: `7137a582897d97a732fc2f4338203510d3ade5b3`
- Method: fresh Chromium contexts with service workers blocked for the cold read at 390×844 and 1440×900; a fresh local clone at `/tmp/onion-next-frame-review-4-8JgFUn` for claim tests and build work.
- Verdict: **FAIL** — one minor finding remains. No blocking finding was reproduced.

## First read before scrolling

Both cold first screens answer the three required questions.

- **What it does:** compare an animation frame with the frame before and after it.
- **For whom:** pixel artists checking motion without leaving their main editor.
- **What to click first:** **Try it with sample data**. The adjacent result is “Loads a 6-frame run cycle.”

The exact text that provides this is “Compare animation frames,” “Compare the frames before and after,” “For pixel artists checking motion between drawings without changing their main editor,” and the sample-data action. There were no console errors and no horizontal overflow at 390px. The dark pixel-light-table workbench is distinct from a generic SaaS template.

## Findings

### F-4-1 — Minor — the three required product facts are below the 390px first screen

- **Quote/location:** “Free to use,” “Works offline after the first visit,” and “Images stay on this device” — landing hero fact list.
- **Evidence:** in a fresh 390×844 context the list starts at y=829.1 and ends at y=938.1. Its text is not readable before scrolling. At 1440×900 the same list is fully visible (y=615.4–724.4).
- **Why this fails a first read:** a phone visitor can identify the job and sample action, but cannot see the price, offline condition, or storage boundary that the required first-screen shape promises. The layout is desktop-correct but mobile-incomplete.
- **Concrete fix:** reflow the mobile hero so the three lines appear below the sample action and finish within 844px; reduce or move the decorative hero art rather than hiding these facts. Add a 390×844 regression test asserting `.fact-list` has `top >= 0` and `bottom <= innerHeight`.

## Copy audit

Word counts use whitespace-delimited words. Navigation labels and controls are included because a visitor sees them; hidden update-toast text is excluded. No landing or README sentence exceeds 22 words. The only flagged landing item is the placement finding above; no banned marketing adjective, unexplained metaphor, inconsistent product term, or non-result-naming task button remains.

### Landing page

| Text | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Onion Next Frame | 3 | Pass |
| Home / Demo / Privacy / Online | 4 | Pass |
| Compare animation frames | 3 | Pass |
| Compare the frames before and after | 6 | Pass |
| For pixel artists checking motion between drawings without changing their main editor. | 11 | Pass |
| Try it with sample data | 5 | Pass |
| Loads a 6-frame run cycle. | 5 | Pass |
| Import your frames | 3 | Pass |
| Free to use | 3 | Flag F-4-1: below fold at 390px |
| Works offline after the first visit | 6 | Flag F-4-1: below fold at 390px |
| Images stay on this device | 5 | Flag F-4-1: below fold at 390px |
| Previous / Current / Next | 3 | Pass |
| Frame comparison preview | 3 | Pass |
| Check the in-between drawing | 5 | Pass |
| Import numbered PNG files or one animated GIF. | 8 | Pass |
| File names set the frame order. | 6 | Pass |
| Your frame comparison appears here. | 5 | Pass |
| Choose numbered PNG files or an animated GIF. | 8 | Pass |
| Drop PNG or GIF files | 5 | Pass |
| FRAME — / — / No sequence loaded | 6 | Pass |
| Import frames or load the sample to start. | 8 | Pass |
| Layers / Color / Opacity | 3 | Pass |
| Previous frame / Current frame / Next frame | 6 | Pass |
| Show layer / Opacity / Tint / Use tint | 6 | Pass |
| Import frames / Export contact sheet | 5 | Pass |
| Import project / Export project / Clear sequence | 6 | Pass |
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
| It does not include painting, frame generation, accounts, collaboration, or sync. | 10 | Pass |
| Your browser decodes the images. | 5 | Pass |
| The app stores your latest real sequence in this browser. | 10 | Pass |
| Demo frames use memory only. | 5 | Pass |
| Read the privacy details | 4 | Pass |
| A local tool for comparing animation frames. | 7 | Pass |
| Terms / Built by Param Factory | 5 | Pass |
| v1.0.0 · Generated artwork disclosed in the design notes. | 8 | Pass |

The hero image alternative, “Three pixel creature poses show the previous, current, and next animation frames,” is 12 words and useful. It is not text baked into the image.

### README

| Sentence or label | Words | Result |
| --- | ---: | --- |
| Onion Next Frame | 3 | Pass |
| Compare a pixel animation with its previous and next frames. | 9 | Pass |
| Onion Next Frame helps solo pixel artists and small game teams compare nearby animation frames beside their main editor. | 19 | Pass |
| It does not include painting, frame generation, accounts, collaboration, or sync. | 10 | Pass |
| What it does | 4 | Pass |
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
| Try the isolated demo | 5 | Pass |
| Open `/?demo=1` or live demo URL. | 6 | Pass |
| Six original sample frames load immediately. | 6 | Pass |
| The demo banner remains visible while demo mode is active. | 10 | Pass |
| Reset demo restores the sample. | 5 | Pass |
| Start for real discards it and returns to an empty or previously saved project. | 15 | Pass |
| `/demo` remains available as a short link. | 8 | Pass |
| Demo details and its storage boundary are in `.factory/demo.md`. | 8 | Pass |
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
| License / MIT. See `LICENSE`. | 4 | Pass |

Terms are consistent: **frame**, **sequence**, **layer**, **frame comparison**, **contact sheet**, **project**, **demo**, and **this browser** each keep one meaning. All task buttons use result-naming verbs.

## Demo, sandbox, claims, and privacy

- The first-screen **Try it with sample data** action reaches `/?demo=1` in one click. At 390×844, the banner is visible at y=0–84; the seeded 332×260 canvas is y=364.6–624.6; `FRAME 03 / 06` and previous/next controls are visible. At 1440×900 the seeded 726×524 canvas, counter, and controls are also in view.
- The persistent banner reads “Demo — sample data, nothing is saved,” and includes working **Reset demo** and **Start for real** actions. Reset restores the 28% previous-layer opacity. The direct demo test finds no `onion-next-frame` IndexedDB database; source uses in-memory sample frames and does not load or save the real project. **Start for real** restores an earlier real project.
- The complete demo request log contained only same-origin requests. The live CSP has `connect-src 'self'`. Offline reload passed after service-worker readiness.
- Every visitor-facing operational statement on the landing page and README maps to a claim: sample and demo isolation (`demo-sandbox`, `sample-six-frame-demo`, `demo-first-viewport`, `start-for-real`), import (`sequence-import`, `drag-drop-import`), boundaries (`scope-boundaries`), layers/export/keyboard/project (`three-layer-preview`, `contact-sheet`, `keyboard-shortcuts`, `project-transfer`), privacy/offline/restore/free use (`privacy-local`, `offline-reload`, `local-restore`, `free-use`). No unlisted claim was found.
- From the clean clone, each of the 15 exact commands in `.factory/claims.json` passed separately; a combined tagged-claim run passed 15/15. `npm run build` passed and produced `dist/`. The deployed full suite passed 44/44.

## Earlier findings rechecked

Every earlier review, polish record, and handoff was read. Each prior finding is fixed on the live site and in source; no prior ID regressed.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Six-frame hero/README claim is declared and its tagged test passes. |
| F-1-2 | Natural number ordering is in the declared import claim and observed in its test. |
| F-1-3 | Unsupported evergreen-browser promise remains removed; recovery guidance remains. |
| F-1-4 | README remains count-free about test-suite size. |
| F-1-5 | “How it works” remains the section label. |
| F-1-6 | “Compare frames in three steps” remains the section heading. |
| F-1-7 | “Limits and privacy” remains the section label. |
| F-1-8 | The vague “review surface” landing sentence remains absent. |
| F-1-9 | “Compare animation frames” and “Frame comparison preview” remain in place. |
| F-2-1 | Hero has no decorative lettering; useful HTML alt/legend remain. |
| F-2-2 | README introduction names the people and comparison job plainly. |
| F-2-3 | Footer says “A local tool for comparing animation frames.” |
| F-2-4 | README retains actionable numbered-PNG GIF recovery guidance. |
| F-3-1 | Demo’s seeded canvas, counter, and controls fit both required first viewports. |
| F-3-2 | Header says Online before worker readiness and Ready offline afterwards. |
| F-3-3 | Scope boundary is declared as `scope-boundaries` and tested. |
| F-3-4 | Desktop fact list is visible within 1440×900; F-4-1 identifies the separate mobile regression. |
| F-3-5 | HTTP 404 has the shared shell, legal links, metadata, favicon, and Return home. |
| F-3-6 | Back restores route scroll and focused control in the live suite. |
| F-3-7 | Empty state says “frame comparison,” not “onion preview.” |
| F-3-8 | Step two says “Adjust the frame layers.” |
| F-3-9 | Step three says “Export a contact sheet.” |
| F-3-10 | Console says “Color / Opacity,” not RGB/Alpha. |
| F-3-11 | README says number order, not natural sorting. |
| F-3-12 | README says real projects stay in this browser. |
| F-3-13 | README names the demo banner without colour-only wording. |
| F-3-14 | README says the demo URL loads the sample. |
| F-3-15 | README says browser storage limit, not IndexedDB quota. |

## Structure, routing, and leverage

`/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` return 200; unknown documents return the designed HTTP 404. Every normal rendered destination, including Param Factory, returned 200. Each route has a route-specific title, one h1, description, canonical URL, Open Graph title, favicon, shared header/footer, Privacy/Terms links, and `lang=en`. Deep links, back navigation, focus movement, route announcement, skip links, visible focus, keyboard controls, reduced motion, and 390px no-overflow checks pass. The live suite’s integrated Axe checks report zero serious or critical issues.

No missed-leverage finding applies. The brief’s obvious import, adjacent-frame comparison, independent controls, offline operation, contact-sheet export, and portable project transfer are present. An AI feature or sync would be decorative and conflict with the explicitly local reviewer scope.

## What would make this perfect

Make the three existing product facts readable in the initial 390×844 hero, add the mobile viewport assertion, and rerun the clean-clone claims plus live suite. With that single layout correction, this review has no other finding.
