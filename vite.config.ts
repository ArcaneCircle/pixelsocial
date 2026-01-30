import { buildXDC, eruda, mockWebxdc } from "@webxdc/vite-plugins";
import preact from "@preact/preset-vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import path from "path";
import { execSync } from "child_process";
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

function getVersion(): string {
  try {
    return execSync("git describe --tags", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim()
      .replace(/^v/, "");
  } catch {
    return "0.0.0";
  }
}

function replaceVersionInToml() {
  const placeholder = '{{APP_VERSION}}';
  const outFile = resolve(__dirname, 'dist', 'manifest.toml');

  return {
    name: 'vite:replace-version-toml',
    // Runs after Vite has copied the `public` folder into `dist`
    closeBundle() {
      const content = readFileSync(outFile, 'utf8');
      const newContent = content.replace(placeholder, getVersion());
      writeFileSync(outFile, newContent, 'utf8');
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    replaceVersionInToml(),
    buildXDC(),
    eruda(),
    mockWebxdc(),
    Icons({
      scale: 1,
      compiler: "jsx",
      jsx: "react",
      customCollections: {
        custom: {
          "heart-filled":
            '<svg viewBox="0 0 24 24"><path fill="currentColor" d="m9 2h-4v2h-2v2h-2v6h2v2h2v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h2v-2h2v-6h-2v-2h-2v-2h-4v2h-2v2h-2v-2h-2z"/></svg>',
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
