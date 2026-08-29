# Independent verification 3 — PASS

- Candidate: `31758ad87df3ed75b91c52c28e39e8cad8a16768` on `main`
- Live URL: <https://onion-next-frame.sociobot.in>
- Verified: 2026-08-29 UTC
- Decision: **PASS**

The previously reported deployment-only problem was not reproducible. The fresh
production build's JavaScript and CSS hashes exactly match the live assets.

## First read and required claims

In a cold Chromium context, the landing screen plainly says the product compares
the frames before and after, says it is for pixel artists checking motion, and
offers “Try it with sample data” with “Loads a 6-frame run cycle.” The one-click
action opens the isolated `/demo` path. This passes the plain-words and demo
gates.

After `npm ci` (0 audit vulnerabilities), every exact command in
`.factory/claims.json` was run separately and passed one Playwright test:

| Claim | Command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS |
| `sequence-import` | `npm test -- --grep @claim:sequence-import` | PASS |
| `three-layer-preview` | `npm test -- --grep @claim:three-layer-preview` | PASS |
| `contact-sheet` | `npm test -- --grep @claim:contact-sheet` | PASS |
| `project-transfer` | `npm test -- --grep @claim:project-transfer` | PASS |
| `privacy-local` | `npm test -- --grep @claim:privacy-local` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `local-restore` | `npm test -- --grep @claim:local-restore` | PASS |
| `free-use` | `npm test -- --grep @claim:free-use` | PASS |

The manifest exists and every claim has its matching `@claim:<id>` test.

## Test and build evidence

- Fresh local `npm test`: **21/21 passed**.
- `npm run build`: PASS (`tsc --noEmit` and Vite); `dist/index.html` exists.
- `PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test`:
  **21/21 passed**, including all claims, history/keyboard/focus, 390 px checks,
  metadata/headers, PWA cache generation, and Axe serious/critical checks on
  `/`, `/demo`, `/privacy`, `/terms`, and 404.
- Application JS is 34.82 KB raw / **12.04 KB gzip**; CSS is 18.18 KB raw /
  **4.70 KB gzip**. Both meet the static PWA budgets.
- Live JS SHA-256: `784429593dd8699de06fb9b82d9e4d52bc299759c8b1acf3f62c4031f608934e`.
- Live CSS SHA-256: `f78d80ef5070bde1cfee19a10d9ea09d1a7861a4f083a63066cb34161f088e6a`.

## Independent product checks

Fresh live testing confirmed frame 03/06, Right to 04/06, Shift+Right to
06/06, 0% and 100% opacity, PNG contact-sheet download, and Reset back to
03/06. An invalid `.jpg` shows the actionable format error; a valid two-PNG
import recovers with “Loaded 2 frames”; malformed project JSON shows the
recovery instruction. No console or page errors occurred.

At 390×844 all inspected routes have `documentElement.scrollWidth === 390`.
Demo labels provide at least 44 px activated areas; the live test suite also
measured all visible landing links and enabled buttons at least 44×44 px. Tab
shows the cyan 3 px focus ring. With reduced motion, transition duration is
`0.01ms`. Desktop and mobile visual review found the canvas, controls, status,
and export action legible and unobscured.

During a complete live demo flow (load, edits, export, reset), Chromium logged
13 outgoing requests, all same-origin at `https://onion-next-frame.sociobot.in`.
There were no iframes, account/password controls, analytics, advertising,
uploads, third-party runtime resources, console errors, or page errors.

Live `/`, `/demo`, hashed JS, and `/sw.js` return HTTPS 200. Security headers
include a same-origin CSP, `frame-ancestors 'none'`, `nosniff`, strict referrer
policy, HSTS, and restricted Permissions-Policy. Hashed JS has `public,
max-age=31536000, immutable`; HTML and the worker have 30-second revalidation.
A stale `onion-next-frame-v1` cache was removed on worker install, leaving
`onion-next-frame-v2`. After first visit, offline `/demo` reloads at frame 03/06
and reports “Offline mode.”

This static local-first PWA has no product server endpoint, sign-in, billing,
or product-unlock call. Rate-limit/429 and Entra tenant checks are not
applicable.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Reproduce

```sh
npm ci
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test
```
