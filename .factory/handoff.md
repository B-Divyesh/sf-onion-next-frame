# Review handoff — Onion Next Frame

Work order: `onion-next-frame-review-1`
Reviewed: 2026-08-29 UTC
Decision: **FAIL**

This reviewer did not modify product code. The committed deliverable is
`.factory/review-1.md`.

## What was verified

- Cold live first reads at 390×844 and 1440×900.
- One-click live demo, reset, real-project isolation, request logging, and
  rendered-link crawl.
- Every claim command from `.factory/claims.json` in a fresh clone, plus full
  local build/test and full live Playwright run: all passed (21/21 full suite).
- Earlier cache-control and mobile-target defects are fixed live and in source.

## Result and next steps

The product behavior is working, but the review identifies three blocking
claim-manifest gaps, a stale README test count, and five plain-language copy
issues. See `.factory/review-1.md` for exact quotes, fixes, and reproduction
evidence. Update the manifest/copy, test the newly named claims, and run a new
independent review.
