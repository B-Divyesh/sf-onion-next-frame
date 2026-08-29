# Perfection-loop polish 2 — finding closure

- Work order: `onion-next-frame-polish-2`
- Review baseline: `c9881b18e212561464fafe9751a8b95f514f84c7`
- Repair commits: `1c4a4e19f48d2c45a9babc1fd3c038efd41441a2`, `31a0275`
- Live URL: <https://onion-next-frame.sociobot.in>
- Final cold-live evidence: `.factory/evidence/polish-2-live-final/`

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the six-frame promise as the declared `sample-six-frame-demo` claim and dedicated observable test. | Clean-clone `@claim:sample-six-frame-demo` passed; live `/?demo=1` flow passed; `screenshot-mobile.png`. |
| F-1-2 | Kept natural filename ordering in the `sequence-import` claim and import test. | Clean-clone `@claim:sequence-import` passed; live suite passed. |
| F-1-3 | Kept actionable PNG recovery guidance instead of a browser-compatibility promise. | README review; clean-clone full suite passed. |
| F-1-4 | Kept the count-free browser-suite wording. | README review; clean-clone full suite passed. |
| F-1-5 | Kept the section label “How it works.” | `screenshot-desktop.png`; live Axe route check passed. |
| F-1-6 | Kept “Compare frames in three steps.” | `screenshot-desktop.png`; live Axe route check passed. |
| F-1-7 | Kept “Limits and privacy.” | `screenshot-desktop.png`; live Axe route check passed. |
| F-1-8 | Kept the vague review-surface sentence removed from the landing page. | `.factory/copy-audit.md`; live screenshot and suite passed. |
| F-1-9 | Kept plain labels “Compare animation frames” and “Frame comparison preview.” | `screenshot-desktop.png`; live route/Axe check passed. |
| F-2-1 | Removed the `FRAME STUDY / 03` `.hero-art::before` pseudo-label; responsive raster art remains text-free. Added a computed-style regression test. | `the hero has no decorative lettering and keeps its useful description in HTML`; final cold screenshots; <https://onion-next-frame.sociobot.in>. |
| F-2-2 | Rewrote the README introduction to say who uses the tool and what it compares. | README exact-copy review; clean-clone 34/34 passed. |
| F-2-3 | Changed the footer to “A local tool for comparing animation frames.” | `screenshot-desktop.png`; live URL. |
| F-2-4 | Replaced the `gifuct-js` note with numbered-PNG recovery guidance. | README exact-copy review; corrupt-GIF recovery test and clean-clone 34/34 passed. |
| Verification-6 low | Corrected “Clear 1 frames” to the singular confirmation. | `a one-frame project uses singular clear confirmation copy`; clean-clone 34/34 passed. |

Every entry was rechecked against <https://onion-next-frame.sociobot.in> in a cold browser context. The corresponding desktop and 390px captures are `.factory/evidence/polish-2-live-final/screenshot-desktop.png` and `.factory/evidence/polish-2-live-final/screenshot-mobile.png`; automated live evidence is the 34/34 suite and `.factory/evidence/polish-2-live-final/verify.json`.

Historical verification findings were rechecked by the final suite: immutable hashed cache headers, revalidating unversioned images, 44px mobile controls, atomic malformed-project rejection, corrupt-GIF recovery, local restore grammar, real 404, route metadata/focus, privacy request log, and offline reload all pass.

## Final evidence

- Fresh remote clone: `/tmp/onion-polish-2-final-sgvRg5`, commit `31a0275`.
- `npm ci`: passed, 28 packages installed; `npm audit --omit=dev`: 0 vulnerabilities.
- `npm run build`: passed and produced `dist/index.html`.
- Clean-clone full suite: `npm test` passed 34/34.
- Each declared claim command passed separately, 1/1: `demo-sandbox`, `sample-six-frame-demo`, `sequence-import`, `three-layer-preview`, `contact-sheet`, `project-transfer`, `privacy-local`, `offline-reload`, `local-restore`, `free-use`.
- Deployed through `/opt/fleet/lib/deploy-static.sh onion-next-frame /work/repo/dist`; Azure Static Web Apps deployment `3f4412ed-0b2f-484c-8bd8-f30234b9b94f` succeeded.
- Live full suite: `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test` passed 34/34.
- `verify-url.sh` report: `.factory/evidence/polish-2-live-final/verify.json` records HTTP 200, no console errors, title, `lang=en`, one h1, main landmark, and no missing image alternative or unlabeled button.
- Live cold screenshots: `.factory/evidence/polish-2-live-final/screenshot-desktop.png` and `.factory/evidence/polish-2-live-final/screenshot-mobile.png`.

No finding remains open.
