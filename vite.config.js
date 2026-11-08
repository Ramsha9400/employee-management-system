import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  server: {
    // Forward API calls to the Express backend during development
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.API_PORT || 5001}`,
        changeOrigin: true,
      },
    },
  },
});
