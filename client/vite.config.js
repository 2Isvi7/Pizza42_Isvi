import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Puerto donde corre tu Frontend (React)
    port: process.env.PORT || 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Apunta al puerto del Backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});