# Handoff — perfection-loop polish 4

- Work order: `onion-next-frame-polish-4`
- Review baseline: `e83b63fea3ddfa0b1cac981f0fd04a82c5b2d24c`
- Released product commit: `faea8ba455e88c6a021ca3b62139573995af376d`
- Deployment: Azure Static Web Apps `5643d59f-cadb-41c1-9840-5ce66a98a69e`
- Live: <https://onion-next-frame.sociobot.in>

## Done

Closed the last adversarial finding, F-4-1. On a 390×844 phone, the three required product facts now appear before the workbench art. The responsive hero also corrects the desktop flex basis that made the mobile sample action unnecessarily 252px tall. The action is now a normal 48px key; the cold live fact list ends at y=569.6.

All earlier review and polish findings remain closed: plain first-screen copy, one-click isolated `?demo=1` with banner/reset/start-for-real, declared and observable claims, local-only privacy, import/order/export behavior, titles and route metadata, focus/history, legal links, real 404, mobile touch targets, cache policy, PWA/offline behavior, and the distinct pixel-light-table visual system. The catalog description is now the verb-first, 9-word sentence: “Compare animation frames locally, then export a contact sheet.”

## Verification

- Fresh remote clone at `/tmp/onion-next-frame-polish4-WfnHC7`: `npm ci`, every one of the 15 exact `.factory/claims.json` test commands separately, and `npm run build` all passed. The build emitted `dist/index.html`.
- Final local: `npm test -- --workers=4` passed **45/45**; `npm run build` passed. The suite includes Playwright Axe checks for `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and a real 404, with zero serious or critical violations.
- Final live: `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test -- --workers=4` passed **45/45** after deployment.
- `verify-url.sh https://onion-next-frame.sociobot.in .factory/qa-evidence-8/verify-live` passed. The report records HTTP 200, zero console errors, title, `lang=en`, one h1, main landmark, zero missing image alt text, and zero unlabeled buttons.
- Cold live evidence: `.factory/qa-evidence-8/polish-4-live-mobile.png` and `.factory/qa-evidence-8/polish-4-live-demo.png`. The mobile landing capture shows the complete fact list before the runner art. `.factory/qa-evidence-8/verify-live/verify.json` is the machine-readable report.
- Budgets from the final build: JS 38.80 KB raw / 13.20 KB gzip; CSS 19.44 KB raw / 4.88 KB gzip; responsive hero images 12.81 KB and 30.61 KB.

## Deploy and run

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh onion-next-frame dist
```

The app is a static PWA; `dist/` is the deployment root. Open `/?demo=1` for the isolated six-frame sample.

## Known gaps

None. No review finding of any severity remains unresolved.

See `.factory/polish-4.md` for the finding-by-finding closure map and evidence.
