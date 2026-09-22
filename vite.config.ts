// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Connect, Plugin } from "vite";

// The Unity WebGL build in public/games/speed-slope/ is served from pre-compressed
// .unityweb files, so the dev and preview servers have to send the same response
// headers the production host does (see public/_headers). Without "Content-Encoding:
// gzip" Unity inflates the ~9 MB wasm module and the ~15 MB data file in JavaScript
// at startup, and without Cache-Control the browser re-downloads them every visit.
const UNITY_ASSET_HEADERS: { suffix: string; headers: Record<string, string> }[] = [
  {
    suffix: ".wasmcode.unityweb",
    headers: { "Content-Encoding": "gzip", "Content-Type": "application/wasm" },
  },
  {
    suffix: ".wasm.unityweb",
    headers: { "Content-Encoding": "gzip", "Content-Type": "application/wasm" },
  },
  {
    suffix: ".wasmframework.unityweb",
    headers: { "Content-Encoding": "gzip", "Content-Type": "application/javascript" },
  },
  {
    suffix: ".framework.js.unityweb",
    headers: { "Content-Encoding": "gzip", "Content-Type": "application/javascript" },
  },
  {
    suffix: ".framework.unityweb",
    headers: { "Content-Encoding": "gzip", "Content-Type": "application/javascript" },
  },
  {
    suffix: ".memory.unityweb",
    headers: { "Content-Encoding": "gzip", "Content-Type": "application/octet-stream" },
  },
  {
    suffix: ".data.unityweb",
    headers: { "Content-Encoding": "gzip", "Content-Type": "application/octet-stream" },
  },
  // Slope's data file is stored UNcompressed (raw UnityWebData), so it must not
  // get a Content-Encoding: gzip header — only the long-lived cache.
  { suffix: "slope_data.unityweb", headers: {} },
  { suffix: ".loader.js", headers: {} },
];

const addUnityAssetHeaders: Connect.NextHandleFunction = (req, res, next) => {
  const url = (req.url ?? "").split("?")[0] ?? "";
  const match = UNITY_ASSET_HEADERS.find((entry) => url.endsWith(entry.suffix));
  if (match) {
    for (const [name, value] of Object.entries(match.headers)) res.setHeader(name, value);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
  next();
};

const unityWebglHeaders: Plugin = {
  name: "unity-webgl-headers",
  configureServer(server) {
    server.middlewares.use(addUnityAssetHeaders);
  },
  configurePreviewServer(server) {
    server.middlewares.use(addUnityAssetHeaders);
  },
};

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [unityWebglHeaders],
  },
});

