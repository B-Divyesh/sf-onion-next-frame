# Verification handoff — Onion Next Frame

Work order: `onion-next-frame-verify-6`

Completed: 2026-08-29 UTC

Status: **PASS — candidate and live deployment verified**

Candidate: `45d2494a6c89a519363d287ccd9055ce5d411e91`

Live: <https://onion-next-frame.sociobot.in>

Demo: <https://onion-next-frame.sociobot.in/?demo=1>

Full report: [`.factory/verification-6.md`](verification-6.md)

## Verification summary

- Every command in `.factory/claims.json`: PASS, 10/10 independently.
- Cold first read and one-click sample demo: PASS.
- `npm test`: PASS locally, 32/32.
- `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test`: PASS,
  32/32 live.
- `npm run build`: PASS, including `tsc --noEmit`; `dist/` produced.
- `npm audit --omit=dev`: PASS, 0 vulnerabilities. No lint script exists.
- All 31 served build files match live byte for byte.
- Desktop, 390 px mobile, keyboard-only paths, reduced motion, 200% reflow,
  link crawl, and Axe serious/critical scans: PASS.
- Invalid files/projects and recovery, 1/6/100-frame exports, persistence, and
  demo/real storage isolation: PASS.
- Live request log: 68/68 same-origin; no uploads, tracking, API, unlock,
  payment, AI, or authentication calls.
- Live offline reload and candidate service-worker update activation: PASS.
- Lighthouse mobile: 97 performance / 100 accessibility / 100 best practices /
  100 SEO; LCP 1,210 ms, TBT 182.5 ms, CLS 0.00021.
- No product code was changed during verification.

## Finding

Low: the one-frame clear confirmation says “Clear 1 frames from this browser?”
The confirmation and deletion behavior are correct. A future copy-only change
should use the singular “frame.” This is not release-blocking.

## Reproduce

```sh
npm ci
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test
node .factory/qa-evidence-6/manual-live.mjs
node .factory/qa-evidence-6/offline-live.mjs
node .factory/qa-evidence-6/sw-update.mjs
```

Evidence is under `.factory/qa-evidence-6/`. The static PWA has no server-side
endpoint, so rate-limit/429, backend concurrency, health, and Entra sign-in
checks are not applicable.
