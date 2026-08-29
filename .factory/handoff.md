# Handoff — adversarial review 4

- Work order: `onion-next-frame-review-4`
- Reviewed target: <https://onion-next-frame.sociobot.in>
- Source: `7137a582897d97a732fc2f4338203510d3ade5b3`
- Product code changed: no
- Result: **FAIL** — one minor finding in [review-4.md](review-4.md).

## What was verified

- Fresh cold Chromium reads at 390×844 and 1440×900; the job, audience, and sample action are clear.
- One-click demo at `/?demo=1`: seeded six-frame sample, persistent sandbox banner, working reset, Start for real isolation, no real IndexedDB in direct demo, same-origin-only requests, and offline reload.
- Fresh clone at `/tmp/onion-next-frame-review-4-8JgFUn`: `npm ci`, all 15 exact claim commands separately, combined claims 15/15, and `npm run build` all passed.
- Live suite: `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test` passed 44/44. The production build creates `dist/`.
- Route metadata, 404, links, deep navigation, focus/history, CSP, accessibility integration, and product-specific visual identity passed.

## Remaining work

At 390×844 the landing fact list starts at y=829, so “Free to use,” “Works offline after the first visit,” and “Images stay on this device” are not readable before scrolling. Reflow the mobile hero so all three facts fit in the initial viewport and add a matching 390px viewport assertion. No other gap was found.
