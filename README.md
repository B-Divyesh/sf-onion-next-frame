# Onion Next Frame

Compare a pixel animation with its previous and next frames.

Onion Next Frame helps solo pixel artists and small game teams compare nearby animation frames beside their main editor. It does not add painting, hosting, collaboration, or generated frames.

Live site: <https://onion-next-frame.sociobot.in>

## What it does

- Imports naturally sorted PNG sequences and animated GIF frames.
- Shows previous, current, and next drawings on one canvas.
- Gives each layer its own visibility, opacity, and tint controls.
- Exports every source frame in one PNG contact sheet.
- Exports and imports a portable project JSON file.
- Restores the latest real sequence from browser storage after a reload.
- Works offline after the first successful visit.

Images stay on the device. There is no account, upload, analytics, advertising, or payment gate. Real projects use IndexedDB. The sample demo uses memory only.

## Try the isolated demo

Open `/?demo=1` or <https://onion-next-frame.sociobot.in/?demo=1>. Six original sample frames load immediately. The cyan banner remains visible while demo mode is active. **Reset demo** restores the sample. **Start for real** discards it and returns to an empty or previously saved project. `/demo` remains available as a short link.

Demo details and its storage boundary are in [`.factory/demo.md`](.factory/demo.md). Every product claim and its browser test are in [`.factory/claims.json`](.factory/claims.json).

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Vite prints the local URL. Open `/?demo=1` for the seeded path.

## Test and build

Playwright 1.58.2 is pinned because the factory image provides that browser version.

```sh
npm test
npm run build
```

`npm test` builds and serves the production app before running the browser test suite. The exact deploy command is `npm run build`. Static output lands in `dist/`, with `dist/index.html` at its root.

## Deploy

Upload `dist/` to the static host. `staticwebapp.config.json` provides the history fallback, 404 page, security headers, and asset rules expected by Azure Static Web Apps. Deployment, DNS, and billing stay outside this repository.

## Browser notes

If PNG import fails, update your browser or use a current desktop browser. If a GIF fails to import, export its frames as numbered PNG files. Very large sequences can reach the browser's IndexedDB quota; original source files remain the backup.

## Product records

- [Brief](.factory/brief.json)
- [Visual thesis and asset provenance](.factory/design.md)
- [Demo sandbox](.factory/demo.md)
- [Testable claims](.factory/claims.json)
- [Handoff](.factory/handoff.md)

## License

MIT. See [LICENSE](LICENSE).
