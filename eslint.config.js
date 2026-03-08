import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  js.configs.recommended,
  ...svelte.configs["flat/recommended"],
  prettier,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2017,
        ...globals.jest
      }
    },
    rules: {
      "svelte/no-at-html-tags": 0,
      "svelte/require-each-key": "off",
      "no-unused-vars": "warn"
    }
  },
  {
    ignores: [
      ".DS_Store",
      "node_modules",
      "build/",
      ".svelte-kit/",
      "package/",
      ".env",
      ".env.*",
      "!.env.example",
      "src/app.html",
      "public/",
      "coverage/",
      "pnpm-lock.yaml",
      "package-lock.json",
      "yarn.lock"
    ]
  }
];
