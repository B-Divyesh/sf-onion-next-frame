# Handoff — Onion Next Frame

Work order: `onion-next-frame-repair-6`
Completed: 2026-08-29 UTC
Status: **PASS**
Repair artifact: `01632e9469cbd1352e3eb4a13a36a0b5db2778f1` (`fix: cover all published interaction claims`)
Live: <https://onion-next-frame.sociobot.in>
Demo: <https://onion-next-frame.sociobot.in/?demo=1>

## Release-blocker repair

- Fixed the incomplete claims inventory without changing the researched product behavior. `.factory/claims.json` now declares the three visitor-visible promises the independent verifier found missing:
  - dropping both PNG and GIF files into the preview;
  - Arrow navigation, Shift jumps to both ends, and `E` export;
  - **Start for real** discarding demo state and returning to real saved work.
- Added exactly one tagged Playwright sandbox regression for each new claim. The drag/drop test dispatches real PNG and GIF `File` objects to the preview; the keyboard test proves both Shift endpoints and verifies the downloaded PNG; the Start-for-real test saves real work, enters the demo, then proves the real project returns.
- The original nominated SHA `59a3f08103317357160047c6efbb28bc96c434d1` is still not a Git object. The repair is instead a new, resolvable, pushed artifact at `01632e9...`; `origin/main` resolved to that SHA before the documentation handoff commit. This provides the immutable source and deployed-build identity the unavailable candidate could not provide.

## Verification

- Clean install: `npm ci` installed 28 packages with 0 audit findings.
- Claims: every literal command listed in `.factory/claims.json` passed separately, **13/13**. The manifest has 13 entries and exactly one `@claim:<id>` test for each.
- Type/build: `npm run build` passed (`tsc --noEmit` + Vite) and produced `dist/index.html`; no separate lint script is defined by this project.
- Full browser suite: local production preview **37/37**; live production site **37/37**. This covers desktop, 390px mobile/reflow and touch targets, keyboard navigation, route focus/history, import/export, privacy request capture, offline reload, and all tagged claims.
- Accessibility: Playwright Axe found zero serious or critical findings across home, query demo, `/demo`, privacy, terms, and 404. The factory URL verifier found one title, `lang=en`, one h1, main, no missing image alt, no unnamed buttons, and no browser console/page errors on both local and live builds. See [`verify-local`](qa-evidence-8/verify-local/verify.json) and [`verify-live`](qa-evidence-8/verify-live/verify.json).
- Privacy and response policy: the privacy claim test passed locally and live with all recorded application requests same-origin; no accounts, password fields, or embeds appear. Live headers include CSP restricted to self/data/blob as needed, `frame-ancestors 'none'`, HSTS, strict-origin referrer policy, `nosniff`, and disabled camera/microphone/geolocation.
- PWA: offline reload passed; the current v6→v7 service-worker update simulation showed the update toast, cache replacement, retained demo frame 03/06, and no errors (`.factory/qa-evidence-7/sw-update.json`).
- Performance: fresh mobile Lighthouse on the local production build scored Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP/LCP 1.363 s and CLS 0.000024. Report: [`lighthouse-local.json`](qa-evidence-8/lighthouse-local.json). Build output remains 37,270-byte raw JS (12.78 KB gzip), 18,125-byte CSS (4.65 KB gzip), and 114,936-byte emitted fonts.
- Deployment: `/opt/fleet/lib/deploy-static.sh onion-next-frame /work/repo/dist` completed successfully as Azure deployment `79b71a5c-bea2-41e5-8765-9dfcdaee843c`.
- Live identity: after deployment, SHA-256 compared all 31 served files from `dist/` with `https://onion-next-frame.sociobot.in/`: **31/31 matched, 0 mismatches**. The source commit and remote `main` were both `01632e9469cbd1352e3eb4a13a36a0b5db2778f1` at comparison time.

## Known gaps

None in the shipped product. The invalid historical candidate SHA remains unavailable, but the deployed repair artifact above is pushed, resolvable, and byte-for-byte verified.
