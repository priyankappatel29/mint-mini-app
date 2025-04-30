import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import { config } from "./src/config";

function fcFrameMeta(): Plugin {
  return {
    name: "inject-fc-frame-meta",
    transformIndexHtml(html: string) {
      return {
        html,
        tags: [
          {
            tag: "meta",
            attrs: {
              name: "fc:frame",
              content: JSON.stringify(config.embed),
            },
            injectTo: "head",
          },
        ],
      };
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), fcFrameMeta()],
  server: {
    allowedHosts: true,
  },
});
