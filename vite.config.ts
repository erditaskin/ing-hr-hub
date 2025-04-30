import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext",
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
  server: {
    port: 3000,
    fs: {
      strict: true,
      allow: ["."],
    },
  },
  publicDir: "public",
  root: ".",
  optimizeDeps: {
    exclude: ["lit"],
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
