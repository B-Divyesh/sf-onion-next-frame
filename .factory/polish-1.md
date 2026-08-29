# Perfection-loop polish 1 — finding closure

- Work order: `onion-next-frame-polish-1`
- Source review: `37f5c92abb2afeeddd324588894a89b0155d6bc3`
- Product repair commit: `10052a068807e7609f173eaa59571b52b1c92be0`
- Deployed URL: <https://onion-next-frame.sociobot.in>
- Result: all nine findings closed; no earlier `review-*.md` or `polish-*.md` files existed.

## Finding map

| Finding | Change made | Automated evidence | Screenshot evidence | Cold live check |
| --- | --- | --- | --- | --- |
| F-1-1 | Added `sample-six-frame-demo` to `.factory/claims.json` and a dedicated observable six-frame assertion. | `@claim:sample-six-frame-demo`: counter `FRAME 03 / 06`, six frame controls, and loaded status; passed alone from clean clone and in live 25/25 suite. | `.factory/evidence/polish-1-live/demo-mobile.png` shows the six numbered frames and `FRAME 03 / 06`. | `/?demo=1` showed six frames in a fresh, service-worker-blocked context. |
| F-1-2 | Expanded `sequence-import` to promise natural filename order, named both page locations, and asserted `frame-2.png` before `frame-10.png`. | `@claim:sequence-import` passed alone from clean clone and live. | `.factory/evidence/polish-1-live/screenshot-desktop.png` shows “File names set the frame order.” | Landing copy is present; the live tagged test observed the natural order and GIF import. |
| F-1-3 | Replaced the untested browser-support promise with recovery guidance: update the browser or use a current desktop browser. | Clean-clone README audit and `git diff --check`; no compatibility claim remains in `.factory/claims.json` or site copy. | `.factory/evidence/polish-1-live/screenshot-desktop.png` confirms no browser-support promise is marketed on the site. | Cold live copy scan found no evergreen-browser promise. |
| F-1-4 | Removed the stale numeric test count; README now says “the browser test suite.” | Clean clone ran 25/25 tests; README no longer contains `17 browser tests`. | `.factory/evidence/polish-1-live/screenshot-desktop.png` is the deployed build verified by that suite. | Live suite completed 25/25. |
| F-1-5 | Replaced “Three keys” with “How it works.” | Landing copy audit passes; route Axe test passes. | `.factory/evidence/polish-1-live/demo-mobile.png` shows “HOW IT WORKS.” | Cold DOM check found the replacement and rejected the old text. |
| F-1-6 | Replaced “From files to a useful reference” with “Compare frames in three steps.” | Landing copy audit passes; route Axe test passes. | `.factory/evidence/polish-1-live/demo-mobile.png` shows the new section heading. | Cold DOM check found the replacement and rejected the old text. |
| F-1-7 | Replaced “Operator note” with “Limits and privacy.” | Landing copy audit passes; route Axe test passes. | `.factory/evidence/polish-1-live/demo-mobile.png` shows “LIMITS AND PRIVACY.” | Cold DOM check found the replacement and rejected the old text. |
| F-1-8 | Deleted “It keeps the review surface small.” | Landing copy audit contains only the concrete product limits. | `.factory/evidence/polish-1-live/demo-mobile.png` shows the shortened limits paragraph. | Cold DOM check rejected the removed sentence. |
| F-1-9 | Replaced “A light table for frame sequences” and “Live onion preview” with “Compare animation frames” and “Frame comparison preview.” | Landing copy audit passes; home route Axe test passes. | `.factory/evidence/polish-1-live/screenshot-mobile.png` shows both plain-language labels. | Cold DOM check found both replacements and neither old label. |

## Required acceptance work beyond the nine findings

- The first-screen action now preserves and opens `/?demo=1` in one click. `/demo` remains a direct alias.
- Demo mode uses only generated in-memory frames. Direct cold entry creates no `onion-next-frame` IndexedDB database. The banner, **Reset demo**, and **Start for real** persist while demo mode is active.
- Client navigation preserves query strings, uses `pushState`, moves focus to the new `h1`, and updates title, description, canonical, Open Graph, and Twitter metadata.
- `/privacy`, `/terms`, `/demo`, unknown SPA paths, the static `/404.html`, manifest, robots, and sitemap all returned successful live responses where applicable.
- The 390 px workbench has no horizontal overflow and all visible landing actions meet the 44 px target test.
- Service-worker cache generation advanced to `onion-next-frame-v3` so installed copies receive this repair.
- `.factory/catalog-description.txt` is a 60-character, verb-first sentence.

## Evidence summary

- Clean clone: `/tmp/onion-polish-K1EuLb`, remote commit `10052a068807e7609f173eaa59571b52b1c92be0`.
- Every one of the ten exact claim commands passed separately from that clean clone.
- Full clean-clone suite: 25/25 passed; `npm run build` produced `dist/index.html`.
- Full live suite: 25/25 passed.
- Axe: `@axe-core/playwright` ran on `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and a missing route; zero serious or critical findings.
- Offline and privacy: `@claim:offline-reload` and `@claim:privacy-local` passed clean and live.
- Local Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.4 s, CLS 0.0002, TBT 0 ms.
- Live Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.2 s, CLS 0.0002, TBT 34 ms.
- Budgets: emitted JS 35.35 KB raw / 12.21 KB gzip; CSS 18.18 KB raw / 4.70 KB gzip; WOFF2 fonts total 65.32 KB; hero images 12.81 KB and 30.61 KB.
- Console/basic accessibility report: `.factory/evidence/polish-1-live/verify.json` has zero console errors, one `h1`, `lang=en`, a main landmark, and no missing image alt text.
- Manual assertions: `.factory/evidence/polish-1-live/live-check.txt`.

No finding of any severity remains open.
