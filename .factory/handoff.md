# Verification handoff — Onion Next Frame

Work order: `onion-next-frame-verify-4`

Completed: 2026-08-29 UTC

Status: **FAIL — release blocked**

Candidate: `228de240c35a0a4c42cfda3a8a0a6ecd8fc6b7fe`

Live: <https://onion-next-frame.sociobot.in>

Demo: <https://onion-next-frame.sociobot.in/?demo=1>

## Result

All ten claim tests pass individually. The complete local and live suites each
pass 25/25, the exact build passes, the live executable is byte-identical to
the candidate, privacy and offline behavior pass, and Lighthouse mobile scores
94 performance / 100 accessibility / 100 best practices / 100 SEO. The prior
hashed-asset cache problem is fixed.

Release remains blocked because the three layer-opacity sliders are 324×32 CSS
px at 390×844. The product contract requires every touch target to be at least
44×44 px, and these sliders are core to the requested independent layer
controls. The existing touch-target test covers only landing links and buttons,
not demo inputs.

Additional findings: a corrupt PNG exposes a raw decoder error without a next
step (medium), and unknown document paths return a soft HTTP 200 missing-page
view (low).

Full commands, hashes, headers, flow evidence, defects, and reproduction notes
are in [`.factory/verification-4.md`](verification-4.md). Screenshots, the URL
verifier result, and fresh Lighthouse JSON are in
`.factory/evidence/verification-4-live/`.

## Reproduce

```sh
npm ci
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://onion-next-frame.sociobot.in npm test
```

At 390×844, inspect
`[data-layer] input[data-field="opacity"]`: each live bounding box is 324×32
px. No product code was modified by verification.
