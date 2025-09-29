import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: true,
    port: 7011,
    proxy: {
      // TODO: si tu API tiene más rutas (e.g. /adopcion, /user, …) añádelas aquí
      "/mascota": {
        target: "http://localhost:4014",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
