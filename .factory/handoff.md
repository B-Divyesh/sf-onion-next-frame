# Handoff — independent verification 10

**PASS** — candidate `a93b63818c3674b5b06a6df7d99af7541d449317` is verified live at <https://onion-next-frame.sociobot.in>.

## What was verified

- From a clean checkout: `npm ci`, all 15 separately invoked `.factory/claims.json` commands, the complete 45-test Playwright suite locally and against the live URL, and `npm run build` all passed. No lint script exists.
- The production `dist/` JS, CSS, service worker, manifest, pages, icons, and art hash-match the deployed files. The initial bundle is 13.20 kB gzip JS and 4.88 kB gzip CSS.
- The cold first screen plainly says it compares frames before and after for pixel artists, and its visible one-click sample action loads a six-frame run cycle. The isolated demo banner has Reset demo and Start for real.
- Live import, GIF, drag/drop, layer controls, keyboard navigation/export, contact-sheet/project export, one-frame and corrupt-file/project recovery, local restore, privacy, response headers, PWA offline reload, and service-worker update behavior passed.
- Axe found no serious or critical issues on all product routes. `verify-url.sh` passed. Desktop and 390px mobile were inspected; 390px has no horizontal overflow and the reduced-motion path is active.
- Live request logging found only same-origin static requests, with no analytics, advertising, accounts, remote API calls, console errors, or page errors. This static no-sign-in PWA has no backend endpoint, so rate-limit/429, backend, and Entra checks do not apply.

## How to run and verify

```sh
npm ci
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test
```

Open `/?demo=1` for the six-frame isolated demo. The deployable artifact is `dist/`.

## Known gaps

None. See [.factory/verification-10.md](verification-10.md) for the detailed evidence and severity assessment.
