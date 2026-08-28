import { defineConfig } from 'vite';

const contentSecurityPolicy = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'";

export default defineConfig({
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
