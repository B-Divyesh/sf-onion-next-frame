# Perfection-loop polish 3 — finding closure

- Work order: `onion-next-frame-polish-3`
- Base: `1cbdf44df9aef2f1ea8462f68f48a5a1155d31b5`
- Repair: `428312dff58050bf159f280922d6edee410fe72b`
- Live: <https://onion-next-frame.sociobot.in>
- Deployment: `8aadcc2d-f51d-4278-94bc-7b6ed22c2f94`

All findings in `review-1.md`, `review-2.md`, `review-3.md`, `polish-1.md`, and `polish-2.md` were rechecked. “Live suite” below means `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test`; it passed 44/44 against deployment `8aadcc2d`.

| Finding | Change made | Evidence and live check |
| --- | --- | --- |
| F-1-1 | Retained the explicit six-frame claim and tagged test. | `@claim:sample-six-frame-demo`; [live demo desktop](evidence/polish-3-live/demo-desktop.png); `/?demo=1` is live. |
| F-1-2 | Kept natural filename order in the declared import claim and observable test. | `@claim:sequence-import`; live suite passed at `/`. |
| F-1-3 | Kept actionable PNG recovery guidance, not a browser-compatibility promise. | `review-three copy` test; README checked in the clean clone. |
| F-1-4 | Kept count-free test-suite wording. | `review-three copy` test; clean suite passed. |
| F-1-5 | Kept **How it works**. | `review-three copy` test; [live landing](evidence/polish-3-live/screenshot-desktop.png). |
| F-1-6 | Kept **Compare frames in three steps**. | `review-three copy` test; live landing capture. |
| F-1-7 | Kept **Limits and privacy**. | `review-three copy` test; live landing capture. |
| F-1-8 | Kept the vague review-surface sentence removed. | `review-three copy` test; live landing capture. |
| F-1-9 | Kept plain comparison labels and removed visible light-table jargon. | `review-three copy` test; live landing capture. |
| F-2-1 | Kept the hero free of decorative lettering. | `hero has no decorative lettering` test; live landing capture. |
| F-2-2 | Kept the README introduction concrete about users and work. | `review-three copy` test; clean-clone README audit. |
| F-2-3 | Kept the plain footer one-liner. | live landing capture and full live suite. |
| F-2-4 | Kept GIF recovery guidance instead of dependency jargon. | corrupt-GIF recovery test; clean suite. |
| F-3-1 | Collapsed the demo introduction and made the seeded workbench immediate after the persistent banner. | `@claim:demo-first-viewport` at 390×844 and 1440×900; [live mobile](evidence/polish-3-live/demo-mobile.png), [live desktop](evidence/polish-3-live/demo-desktop.png); `/?demo=1` live. |
| F-3-2 | Header now shows **Online** before SW readiness and **Ready offline** only afterwards. | `@claim:offline-reload` blocks SW, observes the transition, then reloads offline; live suite passed. |
| F-3-3 | Added `scope-boundaries` claim and removed untested scope wording. | `@claim:scope-boundaries` checks the local-only interface, editor/account/control absence, and request origin; live `/demo` passed. |
| F-3-4 | Rebalanced desktop hero type, column widths, art scale, and action width so all facts fit. | `desktop first screen keeps all three product facts` at 1440×900; [live landing](evidence/polish-3-live/screenshot-desktop.png). |
| F-3-5 | Rebuilt the real HTTP 404 as the shared shell with metadata, favicon, footer legal links, and **Return home**. | `unknown document routes return the designed page with a real HTTP 404`; live `/definitely-missing` passed. |
| F-3-6 | Stored scroll/focus in history entries and restored them after browser history settles. | `browser Back restores the previous route scroll position and focused control`; live suite passed. |
| F-3-7 | Replaced “onion preview” with **frame comparison**. | `review-three copy` test; live landing capture. |
| F-3-8 | Replaced “Tune each neighbour” with **Adjust the frame layers**. | `review-three copy` test; live landing capture. |
| F-3-9 | Replaced “Export the sheet” with **Export a contact sheet**. | `review-three copy` test; live landing capture. |
| F-3-10 | Replaced **RGB / ALPHA** with **COLOR / OPACITY**. | `review-three copy` test; live landing capture. |
| F-3-11 | Replaced “naturally sorted” with visible number-order language. | `review-three copy` test; clean-clone README audit. |
| F-3-12 | Replaced IndexedDB implementation jargon with **stay in this browser**. | `review-three copy` test; clean-clone README audit. |
| F-3-13 | Replaced colour-only banner reference with **demo banner**. | `review-three copy` test; clean-clone README audit. |
| F-3-14 | Replaced “seeded path” with **load the sample**. | `review-three copy` test; clean-clone README audit. |
| F-3-15 | Replaced IndexedDB quota jargon with the browser storage consequence. | `review-three copy` test; clean-clone README audit. |

## Evidence summary

- Clean remote clone: all 15 exact claim commands passed individually; full suite 43/43; build passed.
- Local final suite: 44/44; integrated Axe found zero serious or critical findings.
- Live suite: 44/44; verify-url and manual evidence report no console errors; demo, privacy, offline, mobile, keyboard, 404, routing, CSP, cache, and metadata assertions all passed.
- Local Lighthouse: 100/100/100/100 with LCP 1.36 s, CLS 0.000024, TBT 0 ms.

No blocking or minor finding remains.
