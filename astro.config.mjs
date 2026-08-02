// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Static by default. §01–§05 are a marketing journey with nothing to
  // personalise; §06–§07 opt into server rendering when the seat inventory
  // and the manifest need it.
  output: "static",
  adapter: vercel(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    // One stylesheet rather than per-component <style> tags — the grain,
    // tokens and type roles are global by design and shipping them inline in
    // several places would duplicate them.
    inlineStylesheets: "auto",
  },
});
