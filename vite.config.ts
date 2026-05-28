import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  optimizeDeps: {
    exclude: ["@dimforge/rapier3d-compat"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "three-core": ["three"],
          "three-r3f": ["@react-three/fiber", "@react-three/drei"],
          postprocessing: ["@react-three/postprocessing", "postprocessing"],
          pixi: ["pixi.js"],
          physics: ["@dimforge/rapier3d-compat", "@react-three/rapier"],
          motion: ["framer-motion"],
        },
      },
    },
  },
}));
