const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        globalThis: "readonly",
      },
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2025,
        ecmaFeatures: {
          impliedStrict: true,
        },
      },
    },
  },
  {
    ignores: [
      "tseslint.js",
      "tseslint.cjs",
      "tseslint.min.js",
      "tseslint.mjs",
    ],
  },
];
