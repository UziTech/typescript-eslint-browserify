# typescript-eslint-browserify

Use typescript-eslint in the browser.

## Installation

```sh
npm install typescript-eslint-browserify
```

## Usage

### Bundlers (ESM / CommonJS)

```js
import * as eslint from "eslint-linter-browserify";
import tseslint from "typescript-eslint-browserify";
// or:
// const eslint = require("eslint-linter-browserify");
// const tseslint = require("typescript-eslint-browserify");

const linter = new eslint.Linter();

const messages = linter.verify(
  "const foo: string = 'bar';",
  [
    ...tseslint.configs.recommended,
    {
      rules: {
        semi: ["error", "never"],
      },
    },
  ],
  { filename: "foo.ts" }
);

console.log(messages);
```

### Browser (Script Tag / CDN)

Loading the UMD bundle directly via `<script>` tags exposes `window.tseslint`:

```html
<script src="https://cdn.jsdelivr.net/npm/eslint-linter-browserify/linter.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/typescript-eslint-browserify/tseslint.min.js"></script>
<script>
  const linter = new eslint.Linter();

  const messages = linter.verify(
    "const foo: string = 'bar';",
    [
      ...tseslint.configs.recommended,
      {
        rules: {
          semi: ["error", "never"],
        },
      },
    ],
    { filename: "foo.ts" }
  );

  console.log(messages);
</script>
```

## Bundle Variants

| File / Package Specifier | Format | Description |
| --- | --- | --- |
| `typescript-eslint-browserify` | ESM (`tseslint.mjs`) / CJS (`tseslint.cjs`) | Default entry points for bundlers (Vite, Rollup, Webpack, etc.) and Node.js |
| `tseslint.min.js` | UMD (minified) | Standalone minified bundle for browser `<script>` tags (`window.tseslint`) |
| `tseslint.js` | UMD (unminified) | Standalone unminified bundle for development and debugging |

## Documentation

- [typescript-eslint Documentation](https://typescript-eslint.io/)
- [eslint-linter-browserify](https://github.com/UziTech/eslint-linter-browserify)
