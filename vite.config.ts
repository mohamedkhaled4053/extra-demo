/// <reference types="node" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), "");

  // Map VITE_ environment variables to process.env for CRA compatibility
  const processEnv = Object.keys(env)
    .filter((key) => key.startsWith("VITE_"))
    .reduce(
      (acc, key) => {
        acc[key] = env[key];
        return acc;
      },
      {} as Record<string, string>
    );

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "process.env": JSON.stringify(processEnv),
    },
    optimizeDeps: {
      include: ["ogv"],
    },
    server: {
      port: 3042,
      open: true,
    },
    build: {
      outDir: "build",
      sourcemap: false,
      commonjsOptions: {
        include: [/ogv/, /node_modules/],
      },
      assetsInclude: ["**/*.xlsx", "**/*.xls"],
    },
    publicDir: "public",
    css: {
      preprocessorOptions: {
        scss: {
          // Add any global SCSS variables or mixins here if needed
        },
      },
    },
  };
});
