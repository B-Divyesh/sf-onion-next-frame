# Handoff — Onion Next Frame

Work order: `onion-next-frame-verify-7`
Completed: 2026-08-29 UTC
Status: **FAIL**
Requested candidate: `59a3f08103317357160047c6efbb28bc96c434d1`
Available checkout and remote `main`: `59a3f077a72799d641a16fb34f3e75cdc8283d9c`
Live: <https://onion-next-frame.sociobot.in>
Demo: <https://onion-next-frame.sociobot.in/?demo=1>

## Verification outcome

- The requested candidate cannot be resolved locally or fetched from GitHub (`upload-pack: not our ref`). Candidate testing and live/candidate identity are therefore impossible.
- The live deployment is byte-identical across all 31 served files to the available base `59a3f077...`; the previously reported deployment-only failure is absent for that build.
- After `npm ci`, every exact claim command passed (10/10), the full local and live suites passed (34/34 each), TypeScript passed, the production build created `dist/`, and the production audit found no vulnerabilities.
- Independent desktop/mobile, normal, 100-frame, one-frame, invalid-input, recovery, keyboard, export/import, privacy, offline, service-worker update, caching, headers, accessibility, and performance checks otherwise passed.
- Release remains blocked because `.factory/claims.json` omits visitor-facing drag/drop, keyboard/`E`, and Start-for-real promises and their required tagged claim tests.

## Quality snapshot

- Lighthouse mobile: Performance 90, Accessibility 100, Best Practices 100, SEO 100; LCP 1.230 s, CLS 0.000024, 117,423 bytes transferred.
- Bundle: 37,270-byte JS and 18,125-byte CSS; emitted fonts 114,936 bytes; mobile hero 12,814 bytes.
- Playwright request log: 48/48 requests same-origin, no failed request, console error, or page error.
- Axe: zero serious/critical findings on independently checked desktop and 390 px mobile screens.
- Offline reload and simulated cache v6→v7 update: PASS.

## Required next steps

1. Publish the exact requested candidate commit, or issue a corrected immutable SHA and rerun independent verification against it.
2. Add claim entries and exactly one tagged sandbox test each for drag/drop, the documented keyboard shortcuts (including Shift and `E`), and Start for real; alternatively remove those promises.
3. Rerun all claim commands, the full local/live suite, build comparison, and deployment identity check from the corrected candidate.

Full evidence and defect detail: [verification-7.md](verification-7.md) and `.factory/qa-evidence-7/`.
