# Handoff — Onion Next Frame

Work order: `onion-next-frame-polish-2`
Completed: 2026-08-29 UTC
Status: **PASS**
Live: <https://onion-next-frame.sociobot.in>
Demo: <https://onion-next-frame.sociobot.in/?demo=1>

## Delivered

- Closed every finding in reviews 1 and 2, all earlier polish/verification records, and the remaining one-frame confirmation grammar defect.
- Removed the inaccessible decorative hero text at its real source: `.hero-art::before`. The original cyan/amber/magenta frame art and HTML previous/current/next legend remain.
- Rewrote the README and footer in plain words; GIF guidance now tells people to export numbered PNG frames when import fails.
- Preserved the isolated one-click `?demo=1` path, persistent banner/reset/start-real controls, local-only storage boundary, real routes/titles/404/legal links, mobile layout, PWA cache/update behavior, and visual identity.
- Updated the verb-first catalog description: “Compare nearby animation frames in your browser.”

## Verification

- Final product commits: `1c4a4e1` and `31a0275` (this handoff follows in the documentation commit).
- Fresh GitHub clone `/tmp/onion-polish-2-final-sgvRg5`: `npm ci`, `npm run build`, and `npm test` passed; browser suite was 34/34.
- Every exact command in `.factory/claims.json` passed separately from that clean clone, one test per claim.
- `npm audit --omit=dev`: 0 vulnerabilities.
- Deployed with `/opt/fleet/lib/deploy-static.sh onion-next-frame /work/repo/dist`; Azure deployment `3f4412ed-0b2f-484c-8bd8-f30234b9b94f` succeeded.
- Live: `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test` passed 34/34.
- Live factory verifier passed; [`verify.json`](evidence/polish-2-live-final/verify.json) records 200, no console errors, title, `lang`, h1, main, image alts, and button labels.
- Cold live visual checks: [`desktop`](evidence/polish-2-live-final/screenshot-desktop.png) and [`mobile`](evidence/polish-2-live-final/screenshot-mobile.png). The 390px layout fits, has 44px controls, and the hero contains no decorative lettering.

See [polish-2.md](polish-2.md) for the complete finding-to-evidence map.

## Known gaps

None.
