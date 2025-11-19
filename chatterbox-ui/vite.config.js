import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Quando React chiama /api, inoltra la richiesta a http://127.0.0.1:8000
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        // Riscrivi il percorso da /api/generate-tts a /generate-tts
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
