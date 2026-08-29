# Polish handoff — Onion Next Frame

Work order: `onion-next-frame-polish-1`

Completed: 2026-08-29 UTC

Status: **PASS — no known gaps**

Live: <https://onion-next-frame.sociobot.in>

Demo: <https://onion-next-frame.sociobot.in/?demo=1>

Deployed repair commit: `10052a068807e7609f173eaa59571b52b1c92be0`

## What changed

All nine findings in `.factory/review-1.md` are closed. The page uses plain section labels, the six-frame and natural-order promises have dedicated claim coverage, the README has no unsupported browser claim or stale test count, and the first-screen sample action opens the isolated `/?demo=1` route.

The demo keeps its frames and settings in memory, shows a persistent sample-data banner, resets to frame 3, and exits without altering saved real work. Client routing now preserves the demo query and updates route-specific canonical, Open Graph, and Twitter metadata as well as title, description, focus, and announcements. The pixel-light-table design and static offline-PWA deployment class are unchanged.

The exact finding-to-change-to-evidence map is in `.factory/polish-1.md`. The full landing copy inventory is in `.factory/copy-audit.md`.

## Verification

- Fresh remote clone at commit `10052a0`: `npm ci` reported 0 vulnerabilities.
- All ten commands listed in `.factory/claims.json` passed individually from the fresh clone.
- `npm test`: 25/25 passed from the fresh clone and 25/25 passed against the deployed URL.
- `npm run build`: passed and produced `dist/index.html`.
- Accessibility: Playwright Axe checked home, query demo, `/demo`, Privacy, Terms, and missing-route views; zero serious or critical findings.
- Browser and structure: zero console errors; one `h1`; `lang=en`; main landmark; image alt text present; route titles, canonical/OG/Twitter metadata, focus, history, 404, legal links, and CSP passed.
- Mobile: 390×844 has no horizontal overflow; every visible landing link/button is at least 44×44 CSS px.
- Privacy: the full demo flow made only same-origin requests and exposed no account, password, iframe, ad, or checkout control.
- Offline: a fresh `/demo` visit reloaded with its sample viewer working after the browser context went offline.
- PWA: `onion-next-frame-v3` installs, claims clients, and precaches the shell.
- Live Lighthouse mobile: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.2 s, CLS 0.0002, TBT 34 ms.
- Output budgets: JS 35.35 KB raw / 12.21 KB gzip; CSS 18.18 KB raw / 4.70 KB gzip; WOFF2 65.32 KB; responsive hero assets 12.81 KB and 30.61 KB.

Evidence is under `.factory/evidence/polish-1-local/` and `.factory/evidence/polish-1-live/`. The cold live verifier report is `polish-1-live/verify.json`; manual result is `polish-1-live/live-check.txt`.

## Run and verify

```sh
npm ci
npm test
npm run build
```

To repeat live verification:

```sh
PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test
```

Deploy output is the `dist/` directory. The work-order deploy script uploaded it to the existing Azure Static Web App and confirmed HTTPS 200 on the custom domain.

## Known gaps and next steps

None. Every current and cumulative review finding is resolved in source and on the deployed site.
