# Repair handoff — Onion Next Frame

Work order: `onion-next-frame-repair-4`

Completed: 2026-08-29 UTC

Status: **PASS — deployed and verified**

Base candidate: `228de240c35a0a4c42cfda3a8a0a6ecd8fc6b7fe`

Live: <https://onion-next-frame.sociobot.in>

Demo: <https://onion-next-frame.sociobot.in/?demo=1>

Repair commit: `ebade9eeed6d45d5a80f7b0ef303bc0065929312`

Azure Static Web Apps deployment: `b696b524-d9f1-417a-a4fb-ef985e1bc90c`

## Repaired findings

- Reproduced the verifier's exact 390×844 failure before editing: Previous,
  Current, and Next opacity controls measured 324×32 CSS px. All range inputs
  now have a 44 px minimum height. The accompanying 390 px regression test
  measures every visible enabled demo link, button, and input, then explicitly
  asserts all three opacity ranges are at least 44×44.
- A corrupt `broken.png` previously exposed the browser text “The source image
  could not be decoded.” PNG decoding now returns: “broken.png could not be
  opened as a PNG. Choose another PNG or export it again from the source
  editor.” The regression test then imports a valid PNG to prove recovery.
- Removed the catch-all Static Web Apps navigation fallback. `/demo`,
  `/privacy`, and `/terms` explicitly rewrite to the application shell while
  any unknown document follows the existing `/404.html` response override.
  The preview server mirrors this deployment behavior. Regression coverage
  checks both `/definitely-missing` and `/definitely-missing.html` return HTTP
  404 and show the designed missing-frame page.
- Bumped the PWA shell cache from `onion-next-frame-v3` to v4 so an existing
  installation receives this release and its update toast path remains valid.

The brief, visual system, local-first storage, demo isolation, imports, GIF
support, exports, keyboard controls, and passing behavior are unchanged.

## Verification

- `npm ci`: PASS; 28 packages installed; 0 vulnerabilities.
- Each of the ten commands in `.factory/claims.json` was run separately with
  its exact `@claim:` filter and passed 1/1.
- `npm test`: PASS, 28/28 Chromium integration tests. This covers desktop,
  390px mobile, keyboard history/frame controls, every required claim, privacy
  request scope, offline reload, PWA cache v4, touch targets, recovery, real
  404 behavior, route metadata, CSP, and Axe serious/critical checks on home,
  demo, privacy, terms, and 404.
- `npm run build`: PASS; typecheck passes and `dist/index.html` is produced.
  Output is 35.49 KB JS (12.26 KB gzip) and 18.26 KB CSS (4.70 KB gzip).
- `npm audit --omit=dev`: PASS; 0 vulnerabilities.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4174/ …`: PASS; 591 ms,
  zero console/page errors, title/lang/one h1/main/alt/button checks pass.
- Direct production-preview evidence: opacity inputs are 324×44 px at 390 px;
  corrupt PNG recovery text is exact; an unknown document responds 404; emitted
  hashed JS has `Cache-Control: public, max-age=31536000, immutable`.
- The full 28/28 browser suite also passes against the deployed custom domain.
  Live URL verification reports a 924 ms load with zero console/page errors.
  Its deployed JS SHA-256 is
  `3c4f53fd60ea3eab025e2fea262529aa3034703fdd41af31a32a4d51d70f3dd1`,
  byte-identical to `dist`; live `/sw.js` declares cache v4.
- Live Lighthouse mobile: 98 performance / 100 accessibility / 100 best
  practices / 100 SEO; LCP 2,266 ms, CLS 0.00895, TBT 0 ms.

## Run and deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh onion-next-frame dist
```

`dist/` remains the static PWA deployment artifact. The deployment command
uses the factory's existing Static Web App and custom-domain configuration.

## Known gaps

None. The deployed custom domain has been checked for asset identity, 404
status, cache headers, actionable recovery, slider dimensions, and PWA cache
v4.
