# Repair handoff — Onion Next Frame

Work order: `onion-next-frame-repair-5`

Completed: 2026-08-29 UTC

Status: **PASS — deployed and verified**

Verifier report: `df676112ba046b8bdc83ee0193cd072376168101`

Candidate repaired: `d4af87ea036f892deb0ad34db557a3e5745f440a`

Repair commit: `b0a4f537ed3b9939f52cf19f53e037de83c48127`

Deployment source commit: `13a5de24fbae2d3fb4ae510b3144a0cd447ee3ce`

Azure Static Web Apps deployment: `7f14435a-3c10-437c-a9ad-1f59f620b201`

Live: <https://onion-next-frame.sociobot.in>

Demo: <https://onion-next-frame.sociobot.in/?demo=1>

## Repaired findings

- Project import now validates the envelope, version, project metadata, every
  frame field, and all four fields on each required layer. Opacity must be in
  the 0–1 range and tints must be six-digit hex colours. Embedded images are
  decoded and checked against their declared dimensions before active state is
  changed. Missing, malformed, unreadable, or unsupported values therefore
  leave the current workbench intact.
- Invalid layer settings now say: “The project has invalid layer settings.
  Choose another project file or export it again from Onion Next Frame.” The
  regression exercises missing settings, a non-boolean field, and opacity
  `1.2`. Every rejection retains frame 03/06 and all six frame controls. It
  then changes Current opacity to 50%, advances to frame 04/06, imports a valid
  project, and asserts no page error occurred.
- Corrupt GIF errors now tell the user to choose another GIF or export it again
  from the source editor. The regression follows the error with a successful
  two-frame GIF import.
- One-frame restoration now says “Restored 1 saved frame from this browser.” A
  reload regression checks the exact singular message.
- The three unversioned hero/social images now use `max-age=0,
  must-revalidate`. Only content-hashed JS, CSS, and font assets retain the
  one-year immutable policy. Preview behavior mirrors the Static Web Apps
  route ordering, and a regression checks all three image responses and the
  deployed configuration.
- The PWA cache moved from v4 to v5 so installed copies receive the repaired
  shell. A v5→v6 update simulation proves the toast, activation, old-cache
  removal, reload, and demo state retention paths.

The brief, visual system, storage boundary, demo isolation, imports, exports,
keyboard controls, and all behavior that passed verification 5 are preserved.

## Local verification

- `npm ci`: PASS; 28 packages installed; 0 vulnerabilities.
- All ten exact commands in `.factory/claims.json`: PASS independently, 1/1
  each.
- `npm test`: PASS, 32/32 Chromium tests. The suite covers every claim, the four
  repaired findings, desktop routes, 390 px mobile, keyboard navigation,
  privacy request scope, offline reload, PWA cache v5, touch targets, CSP,
  route metadata, real 404 responses, and Axe checks on every public route.
- `npm run build`: PASS. This runs strict TypeScript checking and Vite's
  production build. There is no separate lint script. `dist/index.html` is
  present. Package/consumer checks do not apply to this static PWA.
- Production output: 37.23 KB JavaScript / 12.67 KB gzip, 18.26 KB CSS / 4.70
  KB gzip, 114.94 KB fonts, 30.61 KB desktop hero, and 12.81 KB mobile hero.
- `npm audit --omit=dev`: PASS; 0 vulnerabilities.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4174/ ...`: PASS in 620 ms;
  title, `lang=en`, one h1, main landmark, alt text, button names, and browser
  console/page-error checks pass.
- Manual browser evidence: missing, malformed, and out-of-range settings all
  retain frame 03/06 with six controls; continued interaction reaches frame
  04/06 at 50% opacity; valid project and GIF recovery pass; all observed
  runtime requests are same-origin; console and page error lists are empty.
- At 390×844, document width is 390 px, no enabled control is under 44×44, and
  Playwright Axe reports zero serious/critical findings. Screenshots were
  visually reviewed for desktop and mobile.
- Keyboard/reduced-motion evidence: the skip link has a 3 px cyan outline;
  Enter opens Demo; Space toggles a layer; Home sets opacity to 0%; Right moves
  to frame 04/06; `E` downloads the contact sheet; transitions reduce to 0.01
  ms.
- Offline reload retains frame 03/06 and reports Offline mode from cache v5.
  The update simulation moves v5 to v6 through the visible **Load update**
  action and retains frame 03/06 with no console or page errors.
- Lighthouse 12.2.0 mobile: 100 performance / 100 accessibility / 100 best
  practices / 100 SEO; FCP 1,355 ms, LCP 1,505 ms, TBT 0 ms, CLS 0.00021.

Evidence is under `.factory/evidence/repair-5-local/`. Replay scripts are
`.factory/evidence/repair-5-browser.mjs` and
`.factory/evidence/repair-5-sw-update.mjs`.

## Live verification

- `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test`: PASS,
  32/32 against the deployed custom domain.
- `/opt/fleet/lib/verify-url.sh https://onion-next-frame.sociobot.in/ ...`:
  PASS in 640 ms with zero console/page errors and all semantic smoke checks
  passing.
- All 31 public `dist/` files are byte-identical to the live deployment. There
  are zero mismatches. `index.html` SHA-256 is
  `aa76f6e244fbfdcacd82fb6afddac82dacf53de4322607826dc2f9ec713fb9bc`;
  emitted JavaScript SHA-256 is
  `52a15c485a7641085d50c8a7307859c876bdaa6c5eff2e0800ab144d09ef38d8`.
- The live service worker declares cache v5. The three unversioned images
  return `public, max-age=0, must-revalidate`; hashed JavaScript returns
  `public, max-age=31536000, immutable`.
- The live main response returns HTTP 200 with HSTS, `nosniff`, strict-origin
  referrer policy, restricted permissions, and the self-only CSP with
  `frame-ancestors 'none'`. A missing document returns HTTP 404.
- The live invalid-project, GIF recovery, singular restore, desktop, 390 px
  mobile, keyboard, reduced-motion, Axe, privacy, and offline checks match the
  local evidence. Requests use only the product origin and both browser error
  lists are empty.
- Live Lighthouse 12.2.0 mobile: 100 performance / 100 accessibility / 100
  best practices / 100 SEO; FCP 1,202 ms, LCP 1,202 ms, TBT 0 ms, CLS 0.00021.

Live evidence is under `.factory/evidence/repair-5-live/`; the identity and
response-policy replay is `.factory/evidence/repair-5-live-check.mjs`.

## Run and deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh onion-next-frame dist
```

`dist/` remains the static PWA artifact. The factory deployment helper uses the
existing Azure Static Web App and custom-domain configuration.

## Known gaps

None.
