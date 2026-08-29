# Perfection-loop polish 4 — finding closure

- Work order: `onion-next-frame-polish-4`
- Review baseline: `e83b63fea3ddfa0b1cac981f0fd04a82c5b2d24c`
- Released product commit: `faea8ba455e88c6a021ca3b62139573995af376d`
- Static deployment: `5643d59f-cadb-41c1-9840-5ce66a98a69e`
- Live URL: <https://onion-next-frame.sociobot.in>

The final release keeps the pixel-light-table identity. The phone repair removes a desktop-only flex basis after the hero actions switch to a column, so the sample action is a normal 48px key rather than a 252px block. All three required facts now finish at y=569.6 in the 390×844 cold view, before the runner artwork begins.

Evidence abbreviations below: **claims** means all 15 exact `claims.json` commands passed individually in a fresh remote clone at `/tmp/onion-next-frame-polish4-WfnHC7`; **local/live suite** means 45/45 passed with `npm test -- --workers=4` locally and `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test -- --workers=4` live. The cold live landing and demo captures are `.factory/qa-evidence-8/polish-4-live-mobile.png` and `.factory/qa-evidence-8/polish-4-live-demo.png`.

| Finding | Change made | Evidence and live check |
| --- | --- | --- |
| F-1-1 | Kept the six-frame hero promise as the declared `sample-six-frame-demo` claim. | `@claim:sample-six-frame-demo` in **claims**; cold `/?demo=1` capture and live suite. |
| F-1-2 | Kept number-order wording and observable `frame-2.png` before `frame-10.png` import behavior. | `@claim:sequence-import` in **claims**; live `/` suite. |
| F-1-3 | Kept actionable PNG recovery guidance instead of a browser-compatibility promise. | README audit in `review-three copy uses one plain name…`; live suite. |
| F-1-4 | Kept README test wording count-free. | Clean-clone README audit; live suite. |
| F-1-5 | Kept **How it works** as the workflow section label. | `review-three copy uses one plain name…`; cold live landing capture. |
| F-1-6 | Kept **Compare frames in three steps**. | `review-three copy uses one plain name…`; cold live landing capture. |
| F-1-7 | Kept **Limits and privacy**. | `review-three copy uses one plain name…`; cold live landing capture. |
| F-1-8 | Kept the vague “review surface” sentence removed. | `review-three copy uses one plain name…`; cold live landing capture. |
| F-1-9 | Kept the plain comparison labels and removed unexplained landing jargon. | `review-three copy uses one plain name…`; cold live landing capture. |
| F-2-1 | Kept the hero free of baked or pseudo-element lettering; useful HTML alt text and legend remain. | `the hero has no decorative lettering…`; cold live landing capture. |
| F-2-2 | Kept the README introduction concrete about users and the comparison job. | Clean-clone README audit; live suite. |
| F-2-3 | Kept the footer one-liner “A local tool for comparing animation frames.” | Cold live landing capture; live suite. |
| F-2-4 | Kept GIF recovery guidance in user terms. | `a corrupt GIF gives an actionable recovery message…`; clean-clone build. |
| Verification-6 low | Kept singular clear-confirmation copy for a one-frame project. | `a one-frame project uses singular clear confirmation copy`; local/live suite. |
| F-3-1 | Kept the seeded workbench immediately visible under the persistent demo banner. | `@claim:demo-first-viewport`; `.factory/qa-evidence-8/polish-4-live-demo.png`; live `/?demo=1`. |
| F-3-2 | Kept truthful **Online** then **Ready offline** service-worker status. | `@claim:offline-reload`; live suite. |
| F-3-3 | Kept the local-only scope boundary as a declared, observable claim. | `@claim:scope-boundaries`; live `/demo` suite. |
| F-3-4 | Kept the desktop facts within the initial view. | `the desktop first screen keeps all three product facts…`; live `/`. |
| F-3-5 | Kept the designed HTTP 404 with shared shell, metadata, legal links, and return action. | `unknown document routes return the designed page…`; live `/definitely-missing`. |
| F-3-6 | Kept history scroll and focused-control restoration. | `browser Back restores the previous route scroll position…`; live suite. |
| F-3-7 | Kept **frame comparison**, not “onion preview.” | `review-three copy uses one plain name…`; cold live landing capture. |
| F-3-8 | Kept **Adjust the frame layers**. | `review-three copy uses one plain name…`; cold live landing capture. |
| F-3-9 | Kept **Export a contact sheet**. | `review-three copy uses one plain name…`; cold live landing capture. |
| F-3-10 | Kept **COLOR / OPACITY**, not RGB/Alpha jargon. | `review-three copy uses one plain name…`; live suite. |
| F-3-11 | Kept README wording **number order**, not “naturally sorted.” | `review-three copy uses one plain name…`; clean-clone audit. |
| F-3-12 | Kept visitor-facing storage wording **stay in this browser**. | `review-three copy uses one plain name…`; clean-clone audit. |
| F-3-13 | Kept **demo banner**, not a colour-only reference. | `review-three copy uses one plain name…`; clean-clone audit. |
| F-3-14 | Kept **load the sample**, not “seeded path.” | `review-three copy uses one plain name…`; clean-clone audit. |
| F-3-15 | Kept browser storage-limit recovery wording, not IndexedDB jargon. | `review-three copy uses one plain name…`; clean-clone audit. |
| F-4-1 | Reflowed the 390px hero; reduced vertical rhythm and reset the column-mode action flex basis. Added a direct viewport regression assertion. | `the mobile first screen keeps all three product facts readable`; `.factory/qa-evidence-8/polish-4-live-mobile.png`; cold live `/` has all three facts before y=569.6. |

## Final verification

- Fresh clone: all 15 declared claim commands passed separately; `npm run build` passed and created `dist/index.html`.
- Final local suite: 45/45 passed. Its six route checks use `@axe-core/playwright` and found zero serious or critical violations.
- Final live suite: 45/45 passed against the deployed static site, covering demo isolation, privacy request origin, offline reload, keyboard, focus/history, metadata, legal routing, real 404, cache policy, and PWA update cache.
- `/opt/fleet/lib/verify-url.sh` passed live: `.factory/qa-evidence-8/verify-live/verify.json` records HTTP 200, no console errors, title, `lang=en`, one h1, a main landmark, no missing image alt text, and no unlabeled buttons.
- Local verification report: `.factory/qa-evidence-8/verify-local/verify.json`; latest local and live screenshots accompany it in the same evidence directory.
- The static deploy tool uploaded the verified `dist/` with the work-order configuration and returned deployment `5643d59f-cadb-41c1-9840-5ce66a98a69e` successfully.

No blocking or minor finding remains open.
