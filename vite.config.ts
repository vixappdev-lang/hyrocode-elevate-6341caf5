// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

const isVercelBuild =
  process.env.VERCEL === "1" || process.env.npm_lifecycle_event === "build:vercel";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  cloudflare: isVercelBuild ? false : undefined,
  plugins: isVercelBuild
    ? [
        nitro({
          preset: "vercel",
          compatibilityDate: "2025-09-24",
          vercel: {
            functions: { runtime: "nodejs22.x" },
          },
          routeRules: {
            "/_build/**": {
              headers: { "cache-control": "public, max-age=31536000, immutable" },
            },
            "/sitemap.xml": {
              headers: { "cache-control": "public, max-age=3600" },
            },
            "/robots.txt": {
              headers: { "cache-control": "public, max-age=86400" },
            },
            "/**": {
              headers: {
                "x-content-type-options": "nosniff",
                "x-frame-options": "DENY",
                "referrer-policy": "strict-origin-when-cross-origin",
                "permissions-policy": "camera=(), microphone=(), geolocation=()",
              },
            },
          },
        }),
      ]
    : [],
  tanstackStart: {
    server: { entry: "server" },
  },
});
