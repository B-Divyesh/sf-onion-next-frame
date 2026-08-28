import { defineConfig } from 'vite';

const contentSecurityPolicy = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'";
const immutableAssetCache = 'public, max-age=31536000, immutable';

export default defineConfig({
  plugins: [{
    name: 'preview-static-asset-policy',
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.startsWith('/assets/')) {
          response.setHeader('Cache-Control', immutableAssetCache);
        }
        next();
      });
    }
  }],
  build: {
    target: 'es2022',
    sourcemap: true,
    // Fontsource ships small unicode subsets. Keep every font a same-origin
    // file so the production `font-src 'self'` policy remains enforceable.
    assetsInlineLimit: 0
  },
  // Azure Static Web Apps reads this same policy from staticwebapp.config.json.
  // Serving it in the production-preview test makes CSP breakage observable
  // before deploy.
  preview: {
    headers: {
      'Content-Security-Policy': contentSecurityPolicy
    }
  }
});
