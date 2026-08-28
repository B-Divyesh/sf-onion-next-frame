# Onion Next Frame — visual thesis

## Direction

**Pixel light table / demoscene instrument.** The interface should feel like a small, purpose-built tool running beside an artist's editor: dark phosphor glass, crisp one-pixel rules, keyed controls, and the cyan/magenta neighbour colours used in the actual canvas. It must not resemble a broad creative suite or a centred SaaS landing page.

The landing page opens as an asymmetric workbench. A narrow explanatory rail sits beside a large live onion-skin viewport. Numbered frame ticks, a scanline edge, and the onion-shaped frame mark tie the identity to the review job rather than to generic retro nostalgia.

## Tokens

- `--ink: #f5f3e8` — primary text on the dark workbench.
- `--muted: #b8c0bd` — secondary text; stays above 4.5:1 on the base.
- `--void: #090d12` — page background, like an unlit editor canvas.
- `--panel: #111922` and `--panel-high: #192532` — recessed and raised tool surfaces.
- `--line: #395064` — rules and inactive controls.
- `--cyan: #55e6df` — previous-frame tint and focus colour.
- `--magenta: #ff6fae` — next-frame tint.
- `--amber: #ffd166` — current-frame marker, warnings, and primary action.
- `--danger: #ff7b6b`; `--success: #75e6a4`.

The visual thesis is intentionally single-mode. A dark light-table surface makes translucent pixels legible and matches the environments where pixel artists compare frames. Colour never carries state alone; every tint is named.

## Type and spacing

- Display: `Silkscreen`, self-hosted WOFF2, for short headings, counters, and the wordmark. Its square counters match pixel grids.
- Body: `Atkinson Hyperlegible Next`, self-hosted WOFF2, for controls and explanations. Its distinct forms support long tool sessions.
- Type steps: 14, 16, 18, 24, 36, and fluid 56 px.
- Spacing follows an 8 px unit, with 4 px only inside dense meter controls. Content measure stays under 70 characters.
- Corners are clipped with `clip-path` or 2–4 px radii. One-pixel lines and offset shadows form the shape language.

## Interaction grammar

- The primary action is a solid amber key with a dark offset shadow.
- Secondary actions are outlined dark keys. Pressing a key moves it one pixel toward its shadow.
- Frame changes update the numbered tick and use a short horizontal pixel-wipe. Sliders always expose their numeric value.
- The canvas is the largest object. Tool chrome groups by proximity around it rather than nesting everything in cards.
- Keyboard: Left/Right changes the current frame; Shift+Left/Right jumps to the ends; `E` exports the contact sheet. Shortcuts are shown beside their controls.

## Motion

Frame changes use a 180 ms stepped fade and a moving scan edge. No decoration loops. With `prefers-reduced-motion: reduce`, transitions and smooth scrolling become instant and the scan edge is static.

## Original asset plan

- Generated hero/social source: an abstract three-frame pixel-art runner study displayed on a dark CRT light table. Cyan echoes indicate the previous pose, magenta echoes indicate the intended next pose, and amber marks the current pose. It contains no interface text, logos, brands, or copyrighted characters.
- Prompt: “Wide editorial pixel-art illustration for a tiny animation review utility, side view of an original small caped creature taking three running poses on a dark navy phosphor light table, central current pose in warm cream and amber, previous pose as translucent cyan pixel echo, next pose as translucent magenta pixel echo, chunky 16-bit demoscene pixels, subtle ordered dithering, crisp hard edges, asymmetric composition with empty dark space at left, limited palette #090d12 #55e6df #ff6fae #ffd166 #f5f3e8, no text, no letters, no watermark, no logo, no real people, no existing characters, no gradients, no photorealism.”
- Generated with the factory image model (`factory-image`) on 2026-08-28. The chosen source and prompt sidecar live in `assets/src/`. Generated imagery is original to this product.
- Runtime derivatives: responsive WebP hero crops at 640 and 1200 pixels, each under 300 KB; a composed 1200×630 Open Graph image; hand-authored SVG favicon and PWA icon source.

## Page rhythm

The first screen is a split workbench, not a generic centred hero. Sections alternate between a narrow numbered margin and a wide content track. The three how-to steps read like a frame strip. Privacy and non-goals appear as an operator's note rather than feature cards. The 404 page shows an empty frame slot and points back to the light table.
