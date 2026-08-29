# Handoff — Onion Next Frame

Work order: `onion-next-frame-verify-8`
Verified: 2026-08-29 UTC
Status: **PASS**
Candidate: `85c08b3f08efe57e7ed01955cc078f2214af4fca`
Live: <https://onion-next-frame.sociobot.in>
Demo: <https://onion-next-frame.sociobot.in/?demo=1>

Independent QA found the candidate deployed and healthy. The live page uses the JavaScript and CSS hashes from a fresh build of this exact candidate; before this documentation-only handoff commit, `origin/main` resolved to the same SHA.

How verified:

- `npm ci` completed with 0 audit vulnerabilities.
- Every exact command in `.factory/claims.json` passed separately: **13/13**.
- `npm test` passed locally: **37/37**.
- `npm run build` passed and generated `dist/` (type checking is included).
- `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test` passed: **37/37** against the live deployment.
- Live browser QA confirmed the first-read contract, one-click six-frame demo, normal and invalid import recovery, keyboard export/navigation, mobile 390px layout, focus visibility, reduced motion, 0 serious/critical Axe findings, same-origin-only requests, headers, offline reload, and service-worker update registration.

The fresh build has 12.78 KB gzip JavaScript and 4.65 KB gzip CSS. The complete evidence and exact observed behavior are in [verification-8.md](verification-8.md).

Known gaps: none. This verification changed documentation only; it did not modify product code.
