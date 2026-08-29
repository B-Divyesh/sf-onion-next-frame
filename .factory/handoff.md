# Review handoff — Onion Next Frame

Work order: `onion-next-frame-review-2`
Completed: 2026-08-29 UTC
Status: **FAIL — review findings remain; product code was not changed.**

Live: <https://onion-next-frame.sociobot.in>
Demo: <https://onion-next-frame.sociobot.in/?demo=1>
Full report: [`.factory/review-2.md`](review-2.md)

## Done and verified

- Cold desktop and 390 px first-read gate passed: purpose, audience, and first action are visible before scrolling.
- The one-click sample demo, banner, reset behavior, in-memory sandbox boundary, local restore, offline reload, and same-origin privacy flow passed.
- All ten exact `claims.json` commands passed from `/tmp/onion-next-frame-review-2`, a separate clean checkout.
- `npm test` passed 32/32 locally; `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test` passed 32/32 live; `npm run build` passed and produced `dist/`.
- Routes, metadata, 404, links, keyboard/history focus, 390 px touch targets, CSP, and earlier findings were independently rechecked.

## Left to fix

The review records four minor but acceptance-blocking-for-this-round issues:

1. Remove the inaccessible “FRAME STUDY / 03” lettering baked into the hero raster; it contradicts the no-text asset specification.
2. Replace README “small review surface” / “It sits beside a main editor” with the plain proposed description.
3. Replace the footer’s undefined “light table” metaphor with the proposed product one-liner.
4. Replace the README `gifuct-js` disposal-mode implementation detail with actionable GIF-import recovery guidance.

After copy/asset repair, rerun:

```sh
npm ci
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test
```
