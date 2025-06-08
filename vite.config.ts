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
    Icons({ compiler: "jsx", jsx: "react" }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
