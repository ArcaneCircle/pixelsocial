import { buildXDC, eruda, mockWebxdc } from "@webxdc/vite-plugins";
import preact from "@preact/preset-vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
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
