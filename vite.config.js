import adapter from "@sveltejs/adapter-static";
import {sveltekit} from "@sveltejs/kit/vite";
import {defineConfig} from "vite";

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter({
        pages: "public",
        assets: "public",
        fallback: "index.html",
        precompress: false,
        strict: true
      })
    })
  ]
});
