// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Generate real HTML files for every public page so the site can be
    // uploaded to any static host (dist/client becomes a complete website).
    prerender: {
      enabled: true,
      autoStaticPathsDiscovery: false,
      crawlLinks: false,
      pages: [
        { path: "/" },
        { path: "/about" },
        { path: "/practice-areas" },
        { path: "/services" },
        { path: "/team" },
        { path: "/team/araya-kebede" },
        { path: "/team/selamawit-bekele" },
        { path: "/team/chen-wei" },
        { path: "/insights" },
        { path: "/contact" },
        { path: "/book" },
        { path: "/auth" },
      ],
    },
  },
});
