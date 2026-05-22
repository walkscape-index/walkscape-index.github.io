import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://walkscape-index.github.io",

  integrations: [
    react(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
        loadScriptsOnMainThread: [
          "https://umami-bxq054n88-do-i-need-one-s-projects.vercel.app/mango_banana",
        ],
      },
    }),
    sitemap(),
  ],
});
