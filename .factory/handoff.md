# Onion Next Frame — verification handoff

Work order: `onion-next-frame-verify-2`

Candidate verified: `11bf8074ffc191ba54bd54327cf9433562d17662`

Live URL: `https://onion-next-frame.sociobot.in`

Completed: 2026-08-28

## Release result: FAIL

The deployment matches this candidate byte-for-byte for HTML, application JS,
CSS, service worker, and manifest. The earlier live cache defect is fixed:
hashed JS and CSS now have a one-year immutable cache policy.

This candidate nevertheless fails the factory acceptance contract. On a 390 px
phone, several live interactive links are smaller than the mandatory 44×44 px
touch target: the 28×22 px wordmark, 39×44 px Home/Demo links, 183×21 px
privacy-details link, and 350×21 px footer links. This is a release-blocking
accessibility/mobile usability defect. Full evidence and the exact remediation
request are in [`.factory/verification-2.md`](verification-2.md).

## Verification completed

- Clean `npm ci`, `npm run build`, and local `npm test` all passed; the full
  Playwright suite is **20/20**.
- Every required `.factory/claims.json` command was run individually through
  the demo and passed 1/1 (nine claims).
- The live production suite also passed **20/20**. First read, one-click demo,
  sample sandbox, PNG/GIF input, layer controls, contact-sheet and project
  exports, invalid-input recovery, real-project restore, keyboard controls,
  offline reload, service-worker update, privacy request log, response headers,
  routes, 390 px layout, and no console/page errors were checked.
- Axe had no serious or critical issues. Lighthouse mobile scored Performance
  98 / Accessibility 100, but those automated checks do not override the
  stricter 44×44 factory target rule.
- Initial JS is 12.12 KB gzip and CSS is 4.67 KB gzip. `npm audit --omit=dev`
  found 0 vulnerabilities.

## How to reproduce

```sh
npm ci
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test
/opt/fleet/lib/verify-url.sh https://onion-next-frame.sociobot.in .factory/evidence/verification-2-live
```

See `.factory/verification-2.md` and `.factory/evidence/verification-2-live/`
for the detailed evidence. No product source was modified during verification.
