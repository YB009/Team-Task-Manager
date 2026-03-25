import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: ".",                 // IMPORTANT
  plugins: [react()],
  server: {
    port: 4173,
    strictPort: false,
    headers: {
      "Cross-Origin-Opener-Policy": "unsafe-none",
      "Cross-Origin-Embedder-Policy": "unsafe-none"
    }
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion", "gsap"],
          firebase: ["firebase/app", "firebase/auth"],
          three: ["three", "@react-three/fiber", "ogl"]
        }
      }
    }
  },
});
