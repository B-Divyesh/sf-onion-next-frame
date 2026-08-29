# Handoff — adversarial review 3

- Work order: `onion-next-frame-review-3`
- Reviewed source: `faa640db14c3eae529f3079229a9a975edcbd569`
- Live target: <https://onion-next-frame.sociobot.in>
- Result: **FAIL**

## What was done

Completed a cold 390×844 and 1440×900 first-read review, sentence-level landing/README copy audit, one-click demo and storage-isolation check, clean-clone claim verification, full clean/live suites, prior-finding recheck, route/link/metadata/accessibility review, and missed-leverage check. Product code was not modified.

The complete result is in [review-3.md](review-3.md). It records one blocking finding: the demo's first viewport does not visibly show the seeded workbench or sample frames. Fourteen minor copy, claim-listing, first-screen, 404, and history-restoration findings also remain.

## Verification

- Clean clone: `/tmp/onion-next-frame-review-3` at `faa640d`
- All 13 exact `.factory/claims.json` commands: passed independently
- Clean `npm test`: 37/37 passed
- Clean `npm run build`: passed; `dist/` produced; JavaScript 12.78 KB gzip
- Live `npm test`: 37/37 passed
- Live demo isolation, reset, real-project restoration, request log, and offline reload: passed
- `/opt/fleet/lib/verify-url.sh`: passed with no console errors
- Integrated Playwright Axe checks: zero serious or critical violations on all tested routes
- Link crawl: every rendered link returned 200

## Remaining work

Resolve F-3-1 through F-3-15 in [review-3.md](review-3.md), add the requested regression tests, deploy the repaired build, and repeat the complete review. The standalone axe CLI was not usable because its ChromeDriver 152 did not match the preinstalled Chromium 145; the repository's pinned Playwright Axe integration ran successfully instead.
