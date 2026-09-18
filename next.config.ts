import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  turbopack: {
    resolveAlias: {
      // monaco-editor's exports map rewrites subpaths (./*.js -> ./esm/vs/*.js),
      // which breaks y-monaco's import of editor.api.js under Turbopack.
      "monaco-editor/esm/vs/editor/editor.api.js":
        "./node_modules/monaco-editor/esm/vs/editor/editor.api.js",
      "monaco-editor/esm/vs/editor/editor.worker.js":
        "./node_modules/monaco-editor/esm/vs/editor/editor.worker.js",
    },
  },
};

export default nextConfig;