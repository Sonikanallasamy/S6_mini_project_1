import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/predict": "http://localhost:8000",
      "/login": "http://localhost:8000",
      "/register": "http://localhost:8000",
      "/history": "http://localhost:8000",
      "/uploads": "http://localhost:8000",
    },
  },
});