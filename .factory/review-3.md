# Adversarial first-read review 3 — Onion Next Frame

- Reviewed: 2026-08-29 UTC
- Work order: `onion-next-frame-review-3`
- Reviewed source: `faa640db14c3eae529f3079229a9a975edcbd569`
- Live target: <https://onion-next-frame.sociobot.in>
- Verdict: **FAIL** — one blocking demo finding and fourteen minor findings remain.

## First read before scrolling

Fresh Chromium contexts opened the live root at 390×844 and 1440×900. No page was scrolled before recording this result.

- **What it does:** compares the current animation drawing with the frames before and after it.
- **For whom:** pixel artists checking motion while keeping their main editor unchanged.
- **What to click first:** **Try it with sample data**; the adjacent text says it loads a six-frame run cycle.

The exact first-screen text that supplied those answers was “Compare animation frames,” “Compare the frames before and after,” “For pixel artists checking motion between drawings without changing their main editor,” and “Try it with sample data.” This gate passes at both sizes. The desktop product facts begin at 920.6 px in a 900 px viewport, which is separately reported as F-3-4.

## Findings

### F-3-1 — BLOCKING — the demo opens above the sample instead of showing the product in use

- **Quote/location:** after **Try it with sample data**, the 390×844 first screen contains “Six sample drawings are loaded,” “Compare the frames before and after,” and “Move through the run cycle.” The seeded workbench starts at y=875 and the canvas at y=886, both below the 844 px viewport. At 1440×900, only 31 px of the canvas is visible and the frame counter is below the fold.
- **Why:** the sample exists in application state (`FRAME 03 / 06`), but a first-time visitor cannot see a sample frame or operate the product without scrolling. This fails the required “first screen after clicking already shows the product being used” demo gate.
- **Fix:** put the demo banner directly above a visibly seeded workbench. Remove or collapse the duplicate demo introduction so the canvas, `FRAME 03 / 06`, and at least the main frame controls appear within 390×844 and 1440×900. Add a viewport test that asserts meaningful canvas area and the counter are visible without scrolling.

### F-3-2 — Minor — “Ready offline” claims readiness before the service worker is ready

- **Quote/location:** “Ready offline” — desktop header on every normal route; `src/app.ts` sets it whenever `navigator.onLine` is true.
- **Why:** in a fresh context with service workers blocked, the live page still said “Ready offline” with no controller and zero registrations. The listed `offline-reload` claim only promises offline use after the first visit and does not list or test this stronger runtime status.
- **Fix:** show “Online” until `navigator.serviceWorker.ready` resolves, then show “Ready offline.” Add the header state to the claim’s `where` field and assert the transition from a clean context in `@claim:offline-reload`.

### F-3-3 — Minor — the non-editor boundary is an unlisted claim

- **Quote/location:** “It does not paint, interpolate, host, or sync artwork.” — landing limits section; “It does not add painting, hosting, collaboration, or generated frames.” — README introduction.
- **Why:** these are useful product-scope promises, but no `.factory/claims.json` entry names or tests them. The README also says “Every product claim and its browser test are in `.factory/claims.json`,” which is therefore not accurate.
- **Fix:** add one `scope-boundaries` claim covering both locations and a tagged test that confirms the shipped interface has no painting, interpolation/generation, account, collaboration, or sync path; otherwise remove the promises.

### F-3-4 — Minor — the desktop first screen omits all three plain facts

- **Quote/location:** “Free to use,” “Works offline after the first visit,” and “Images stay on this device” begin at y=920.6 in the 1440×900 cold viewport.
- **Why:** the required first-screen shape puts these facts beside the primary action. Desktop visitors must scroll to learn the price, offline condition, and storage boundary.
- **Fix:** reduce the desktop hero’s type/spacing or reposition the fact list so all three facts fit within 1440×900. Add a viewport assertion for the fact-list bounds.

### F-3-5 — Minor — the real 404 route drops the shared site skeleton and metadata

- **Quote/location:** a live unknown URL returns `public/404.html` with “This frame is missing” and “Return to the light table,” but no site header, footer, Privacy/Terms links, meta description, canonical URL, Open Graph data, or favicon.
- **Why:** the route is a real designed HTTP 404, but it does not meet the per-route metadata or consistent header/footer contract. “Light table” also reintroduces the metaphor removed by F-1-9.
- **Fix:** make the HTTP 404 use the shared product shell, add description/canonical/OG/favicon metadata, and rename the action **Return home**. Extend the unknown-route test to assert those elements while retaining status 404.

### F-3-6 — Minor — browser Back does not restore scroll position

- **Quote/location:** `render(true)` handles `popstate` by calling `window.scrollTo({ top: 0, ... })` and focusing the `h1`.
- **Why:** on the live 390 px site, navigating from home at scroll y=1500 to Privacy and pressing Back returned home at y=0. The routing contract requires back/forward to restore scroll and focus.
- **Fix:** save scroll and focused-element state in each history entry, restore both on `popstate`, and reserve top-of-page `h1` focus for new forward navigation. Add a test that starts from a non-zero scroll position.

### F-3-7 — Minor — “onion preview” is unexplained landing jargon

- **Quote/location:** “Your onion preview appears here.” — landing workbench empty state.
- **Why:** the page otherwise calls this area the “Frame comparison preview.” A cold visitor should not need animation jargon or infer that two labels name the same result.
- **Fix:** rewrite it as “Your frame comparison appears here.”

### F-3-8 — Minor — “Tune each neighbour” is a metaphorical step heading

- **Quote/location:** “Tune each neighbour” — landing, step 2 under How it works.
- **Why:** “tune” does not name the actual opacity, visibility, and tint task, and “neighbour” is not the interface term used for a layer.
- **Fix:** rewrite it as “Adjust the frame layers.”

### F-3-9 — Minor — “Export the sheet” changes the product term

- **Quote/location:** “Export the sheet” — landing, step 3 under How it works.
- **Why:** every related control and explanation calls the result a “contact sheet.” Shortening it makes the terminology inconsistent.
- **Fix:** rewrite it as “Export a contact sheet.”

### F-3-10 — Minor — “RGB / ALPHA” is an unexplained console label

- **Quote/location:** “RGB / ALPHA” — landing workbench console header.
- **Why:** it does not name a section or action and uses graphics jargon where the actual controls say tint and opacity.
- **Fix:** replace it with “COLOR / OPACITY” or remove it.

### F-3-11 — Minor — “naturally sorted” is README implementation jargon

- **Quote/location:** “Imports naturally sorted PNG sequences and animated GIF frames.” — README, What it does.
- **Why:** “naturally sorted” describes an algorithm, not the visible result a user needs.
- **Fix:** rewrite it as “Imports numbered PNG files in number order and imports animated GIF frames.”

### F-3-12 — Minor — the README exposes IndexedDB without explaining the benefit

- **Quote/location:** “Real projects use IndexedDB.” — README, What it does.
- **Why:** the database name does not tell a visitor what is stored or where.
- **Fix:** rewrite it as “Real projects stay in this browser.”

### F-3-13 — Minor — the README identifies the demo banner only by colour

- **Quote/location:** “The cyan banner remains visible while demo mode is active.” — README, Try the isolated demo.
- **Why:** colour alone is not a durable or accessible way to identify the banner.
- **Fix:** rewrite it as “The demo banner remains visible while demo mode is active.”

### F-3-14 — Minor — “seeded path” is unexplained README jargon

- **Quote/location:** “Open `/?demo=1` for the seeded path.” — README, Run locally.
- **Why:** “seeded” does not tell a first-time contributor what the URL will do.
- **Fix:** rewrite it as “Open `/?demo=1` to load the sample.”

### F-3-15 — Minor — the README uses a storage implementation term in recovery guidance

- **Quote/location:** “Very large sequences can reach the browser's IndexedDB quota.” — README, Browser notes.
- **Why:** the visitor needs the storage-limit consequence, not the database API name.
- **Fix:** rewrite it as “Very large sequences can exceed this browser's storage limit.”

## Copy audit

Counts use whitespace-delimited words, treat slash dividers as punctuation, and count arrow glyphs as named keys. Repeated layer labels are listed once. No sentence exceeds 22 words, and no banned marketing adjective appears.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Onion Next Frame | 3 | Pass |
| Home | 1 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| Ready offline | 2 | Flag F-3-2 |
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
| Three pixel creature poses show the previous, current, and next animation frames. | 12 | Pass |
| Frame comparison preview | 3 | Pass |
| Check the in-between drawing | 5 | Pass |
| Import numbered PNG files or one animated GIF. | 8 | Pass |
| File names set the frame order. | 6 | Pass |
| Your onion preview appears here. | 5 | Flag F-3-7 |
| Choose numbered PNG files or an animated GIF. | 8 | Pass |
| Drop PNG or GIF files | 5 | Pass |
| No sequence loaded | 3 | Pass |
| Import frames or load the sample to start. | 8 | Pass |
| Layers | 1 | Pass |
| RGB / ALPHA | 2 | Flag F-3-10 |
| Previous frame / Current frame / Next frame | 6 | Pass |
| Show layer | 2 | Pass |
| Opacity 28% | 2 | Pass |
| Opacity 100% | 2 | Pass |
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
| Tune each neighbour | 3 | Flag F-3-8 |
| Set visibility, opacity, and tint for all three layers. | 9 | Pass |
| Export the sheet | 3 | Flag F-3-9 |
| Download one PNG with every source frame in order. | 9 | Pass |
| Limits and privacy | 3 | Pass |
| This is a reviewer, not an editor | 7 | Flag F-3-3 |
| It does not paint, interpolate, host, or sync artwork. | 9 | Flag F-3-3 |
| Your browser decodes the images. | 5 | Pass |
| The app stores your latest real sequence in this browser. | 10 | Pass |
| Demo frames use memory only. | 5 | Pass |
| Read the privacy details | 4 | Pass |
| A local tool for comparing animation frames. | 7 | Pass |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| (external site) | 2 | Pass |
| v1.0.0 · Generated artwork disclosed in the design notes. | 8 | Pass |

### README

| Sentence or bullet | Words | Result |
| --- | ---: | --- |
| Compare a pixel animation with its previous and next frames. | 9 | Pass |
| Onion Next Frame helps solo pixel artists and small game teams compare nearby animation frames beside their main editor. | 19 | Pass |
| It does not add painting, hosting, collaboration, or generated frames. | 10 | Flag F-3-3 |
| Imports naturally sorted PNG sequences and animated GIF frames. | 8 | Flag F-3-11 |
| Shows previous, current, and next drawings on one canvas. | 9 | Pass |
| Gives each layer its own visibility, opacity, and tint controls. | 10 | Pass |
| Exports every source frame in one PNG contact sheet. | 9 | Pass |
| Exports and imports a portable project JSON file. | 8 | Pass |
| Restores the latest real sequence from browser storage after a reload. | 11 | Pass |
| Works offline after the first successful visit. | 7 | Pass |
| Images stay on the device. | 5 | Pass |
| There is no account, upload, analytics, advertising, or payment gate. | 10 | Pass |
| Real projects use IndexedDB. | 4 | Flag F-3-12 |
| The sample demo uses memory only. | 6 | Pass |
| Open `/?demo=1` or <https://onion-next-frame.sociobot.in/?demo=1>. | 4 | Pass |
| Six original sample frames load immediately. | 6 | Pass |
| The cyan banner remains visible while demo mode is active. | 10 | Flag F-3-13 |
| Reset demo restores the sample. | 5 | Pass |
| Start for real discards it and returns to an empty or previously saved project. | 14 | Pass |
| `/demo` remains available as a short link. | 7 | Pass |
| Demo details and its storage boundary are in [`.factory/demo.md`](.factory/demo.md). | 9 | Pass |
| Every product claim and its browser test are in [`.factory/claims.json`](.factory/claims.json). | 10 | Flag F-3-2, F-3-3 |
| Requires Node.js 20 or newer. | 5 | Pass |
| Vite prints the local URL. | 5 | Pass |
| Open `/?demo=1` for the seeded path. | 6 | Flag F-3-14 |
| Playwright 1.58.2 is pinned because the factory image provides that browser version. | 12 | Pass |
| `npm test` builds and serves the production app before running the browser test suite. | 14 | Pass |
| The exact deploy command is `npm run build`. | 8 | Pass |
| Static output lands in `dist/`, with `dist/index.html` at its root. | 10 | Pass |
| Upload `dist/` to the static host. | 6 | Pass |
| `staticwebapp.config.json` provides the history fallback, 404 page, security headers, and asset rules expected by Azure Static Web Apps. | 18 | Pass |
| Deployment, DNS, and billing stay outside this repository. | 8 | Pass |
| If PNG import fails, update your browser or use a current desktop browser. | 12 | Pass |
| If a GIF fails to import, export its frames as numbered PNG files. | 13 | Pass |
| Very large sequences can reach the browser's IndexedDB quota. | 9 | Flag F-3-15 |
| Original source files remain the backup. | 6 | Pass |
| MIT. | 1 | Pass |
| See [LICENSE](LICENSE). | 2 | Pass |

### Terminology and actions

| Concept | Current wording | Result |
| --- | --- | --- |
| One drawing | frame | Consistent |
| Ordered drawings | sequence | Consistent |
| Previous/current/next overlay | layer | Consistent |
| Comparison canvas | frame comparison / onion preview | Flag F-3-7 |
| Downloaded overview PNG | contact sheet / sheet | Flag F-3-9 |
| Portable saved review | project | Consistent |
| Isolated sample | demo | Consistent |
| Browser persistence | saved / browser storage / IndexedDB | Flags F-3-12 and F-3-15 |

All task buttons otherwise use result-naming verbs: **Try it with sample data**, **Import your frames**, **Import frames**, **Export contact sheet**, **Import project**, **Export project**, **Clear sequence**, **Reset demo**, **Start for real**, **Read the privacy details**, and **Load update**. Destination links such as Home, Demo, Privacy, and Terms name their routes.

## Demo and sandbox verification

- The landing action enters `/?demo=1` in one click.
- The application state immediately contains six realistic original moth-runner frames, opens at `FRAME 03 / 06`, and exposes the three layer controls.
- The persistent demo banner says “Demo — sample data, nothing is saved” and provides **Reset demo** and **Start for real**.
- Reset restored the previous-layer opacity to 28% and the sample defaults.
- A fresh direct demo created no `onion-next-frame` IndexedDB database.
- A real one-frame project was saved before entering the demo; **Start for real** restored that exact project. Demo changes did not replace it.
- The live demo request log contained same-origin requests only. Offline reload worked after service-worker installation.
- The above-the-fold failure remains F-3-1.

## Claims verification

A clean clone of source commit `faa640d` was created at `/tmp/onion-next-frame-review-3`. `npm ci` completed with zero audit vulnerabilities. Every exact test command listed in `.factory/claims.json` was run separately.

| Claim id | Result |
| --- | --- |
| `demo-sandbox` | Pass — 1/1 |
| `sample-six-frame-demo` | Pass — 1/1 |
| `sequence-import` | Pass — 1/1 |
| `drag-drop-import` | Pass — 1/1 |
| `three-layer-preview` | Pass — 1/1 |
| `contact-sheet` | Pass — 1/1 |
| `keyboard-shortcuts` | Pass — 1/1 |
| `project-transfer` | Pass — 1/1 |
| `privacy-local` | Pass — 1/1 |
| `offline-reload` | Pass — 1/1 |
| `local-restore` | Pass — 1/1 |
| `start-for-real` | Pass — 1/1 |
| `free-use` | Pass — 1/1 |

No listed claim test failed. F-3-2 and F-3-3 identify claim-like copy not fully represented by those entries.

The full clean-clone suite passed 37/37. `npm run build` passed and produced `dist/`; emitted JavaScript was 12.78 KB gzip. The full live suite also passed 37/37.

## Earlier findings rechecked

Every earlier review, both polish records, and the current handoff were read. Each prior finding was checked in both current source and the live site.

| Earlier id | Current confirmation |
| --- | --- |
| F-1-1 | Fixed: `sample-six-frame-demo` is listed and its isolated test passed. |
| F-1-2 | Fixed: `sequence-import` names natural filename order; the test observed frame 2 before frame 10. |
| F-1-3 | Fixed: the evergreen-browser promise is absent; README provides a recovery action. |
| F-1-4 | Fixed: README no longer states a test count. |
| F-1-5 | Fixed: live eyebrow is “How it works.” |
| F-1-6 | Fixed: live heading is “Compare frames in three steps.” |
| F-1-7 | Fixed: live eyebrow is “Limits and privacy.” |
| F-1-8 | Fixed: “It keeps the review surface small” is absent. |
| F-1-9 | Fixed for the exact earlier labels: “Compare animation frames” and “Frame comparison preview” are live. F-3-7 covers separate surviving empty-state jargon. |
| F-2-1 | Fixed: the live raster has no lettering; source and computed pseudo-content also contain none. |
| F-2-2 | Fixed: the README introduction now names users and the comparison job. |
| F-2-3 | Fixed: the footer says “A local tool for comparing animation frames.” |
| F-2-4 | Fixed: the README now gives the numbered-PNG recovery action. |

The polish records also repeated cache-header, 44 px target, malformed-project, corrupt-GIF, service-worker-update, and singular-message checks. The current clean and live 37-test suites passed all of them. No earlier finding regressed under its original id.

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200, have route-specific titles, one `h1`, descriptions, canonical and OG metadata, favicon, shared header/footer, Privacy/Terms links, and `lang="en"`.
- An unknown document returns a designed page with HTTP 404. Its missing shell and metadata are F-3-5.
- Deep links, client-side navigation, route-change `h1` focus, the skip link, keyboard frame controls, and route announcements work. Back-scroll restoration fails as F-3-6.
- Every rendered anchor on the checked routes was crawled. All internal targets and the external Param Factory target returned 200.
- `/manifest.webmanifest`, the 1200×630 social image, `robots.txt`, and `sitemap.xml` are reachable. The sitemap lists all normal application routes.
- The live response has a self-only CSP with `frame-ancestors 'none'` in the response header, `nosniff`, and a strict referrer policy. There were no console errors.
- The repository's Playwright Axe integration found zero serious or critical violations on `/`, both demo URLs, Privacy, Terms, and an unknown route. `verify-url.sh` also passed with one `h1`, a main landmark, valid `lang`, no missing image alt, and no unlabeled button. The standalone axe CLI could not pair its downloaded ChromeDriver 152 with the preinstalled Chromium 145; the integrated Axe run uses the pinned Playwright 1.58.2 browser and completed successfully.
- Source defines visible focus, 44 px interactive targets, and a reduced-motion override. Mobile layout and target tests passed.
- The dark pixel-light-table composition, generated runner art, pixel typography, cyan/magenta/amber layer language, clipped corners, and asymmetric workbench are product-specific rather than a generic SaaS template.

## Missed leverage

No missed-leverage finding applies. The brief asks for numbered PNG and animated GIF import, adjacent-frame comparison, independent layer controls, scrubbing, offline use, and contact-sheet export; all are present. Portable project import/export is already an additional useful capability. AI interpolation or remote sync would conflict with the stated local reviewer role and should not be added decoratively.

## What would make this perfect

Make the seeded canvas and controls visible in the first demo viewport; make offline status reflect actual service-worker readiness; list and test the non-editor boundary; fit all three facts in the desktop hero; restore the full shell and metadata on 404s; restore scroll/focus on browser history; and apply the nine exact copy rewrites in F-3-7 through F-3-15. Add regression assertions for each presentation and routing fix, then repeat every claim command, the clean and live full suites, the cold 390 px/desktop read, and the link crawl. Until all fifteen findings are gone, the review remains **FAIL**.
