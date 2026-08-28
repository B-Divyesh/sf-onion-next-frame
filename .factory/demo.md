# Demo sandbox

- URL: `https://onion-next-frame.sociobot.in/demo` (locally: `http://127.0.0.1:5173/demo`).
- Sample: six hand-authored 192×192 PNG frames of an original moth-like runner. Frame 3 opens as the current drawing.
- Reset: choose **Reset demo** in the cyan banner. This restores frame 3 and every layer default.
- Leave: choose **Start for real**. The demo frames are discarded.
- Storage boundary: demo frames and settings live in memory only. The demo never opens the `onion-next-frame` IndexedDB database used for real imports.
- Offline check: load `/demo` once, wait for the service worker, disable the network, and reload `/demo`.
