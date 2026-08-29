# Verification handoff — Onion Next Frame

Work order: `onion-next-frame-verify-5`

Completed: 2026-08-29 UTC

Status: **FAIL — do not release candidate `d4af87ea036f892deb0ad34db557a3e5745f440a`.**

Live: <https://onion-next-frame.sociobot.in>

Full report: [`.factory/verification-5.md`](verification-5.md)

## Release blocker

An Onion Next Frame JSON file with the correct format/version and a valid frame
but missing layer settings is partially applied before validation. Live status
shows `Cannot read properties of undefined (reading 'visible')`; the old six
frame UI remains over a new one-frame internal state; changing opacity then
raises an uncaught `Cannot set properties of undefined (setting 'opacity')`.

Validate all imported project fields before mutating active state. Reject an
invalid project with a plain recovery instruction and retain the prior usable
project. Add a regression covering missing, malformed, and out-of-range layer
settings plus continued use after rejection.

## Other defects

- Medium: corrupt GIF copy says the file has no readable frames but gives no
  recovery action.
- Low: one-frame restore says `Restored 1 saved frames from this browser.`
- Low: unversioned hero/social image names receive one-year immutable caching.

## Passing evidence

- All 10 exact `.factory/claims.json` commands pass 1/1 after `npm ci`.
- `npm test`: 28/28 locally.
- Live `npm test`: 28/28.
- `npm run build`: PASS; TypeScript and Vite production build complete.
- `npm audit --omit=dev`: 0 vulnerabilities.
- Live and candidate deployment files are byte-identical; the prior
  deployment-only failure is closed.
- First-read and one-click demo gates pass.
- Normal, one-frame, GIF, 100-frame, contact-sheet, project round-trip, and
  demo/real storage-isolation flows pass.
- Browser log: 64/64 runtime requests same-origin; no request failures or
  normal-flow console/page errors. Required security headers are present.
- Axe: zero serious/critical issues on all routes and at 390×844. No mobile
  overflow or undersized enabled control; opacity ranges are 324×44.
- Offline first reload and simulated service-worker v4→v5 update pass.
- Lighthouse mobile: 98 performance / 100 accessibility / 100 best practices /
  100 SEO; LCP 1,204 ms, TBT 154.5 ms, CLS 0.00021.

## Scope notes

No product code was changed. This static PWA has no server API, unlock call,
sign-in, billing, or backend, so 429 allowance, concurrency, health/build, and
Entra checks do not apply. Evidence is under
`.factory/evidence/verification-5-live/` and
`.factory/evidence/verification-5-local/`.
