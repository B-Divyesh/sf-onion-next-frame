import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

const contentSecurityPolicy = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'";
const immutableAssetCache = 'public, max-age=31536000, immutable';
const appRoutes = new Set(['/', '/demo', '/privacy', '/terms']);
const previewNotFoundPage = readFileSync(new URL('./public/404.html', import.meta.url), 'utf8');

export default defineConfig({
  plugins: [{
    name: 'preview-static-asset-policy',
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        const url = new URL(request.url ?? '/', 'http://localhost');
        if (url.pathname.startsWith('/assets/')) {
          response.setHeader('Cache-Control', immutableAssetCache);
        }
        // Mirror Static Web Apps: known client routes receive the shell, while
        // an unknown document gets the designed 404 page with a real 404.
        if (request.method === 'GET' && request.headers.accept?.includes('text/html')) {
          if (appRoutes.has(url.pathname)) request.url = `/index.html${url.search}`;
          else if (url.pathname !== '/404.html') {
            response.writeHead(404, {
              'Content-Type': 'text/html; charset=utf-8',
              'Content-Security-Policy': contentSecurityPolicy
            });
            response.end(previewNotFoundPage);
            return;
          }
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
