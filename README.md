# eslint-linter-browserify

Use ESLint in the browser.

## Installation

```sh
npm install eslint-linter-browserify
```

## Usage

### Bundlers (ESM / CommonJS)

```js
import * as eslint from "eslint-linter-browserify";
// or const eslint = require("eslint-linter-browserify");

const linter = new eslint.Linter();

const messages = linter.verify("var foo;", {
  rules: {
    semi: ["error", "never"]
  }
}, { filename: "foo.js" });

console.log(messages);
```

### TypeScript

To lint TypeScript, configure `@typescript-eslint/parser` or use `typescript-eslint` recommended configurations:

```js
import * as eslint from "eslint-linter-browserify";
import tseslint from "typescript-eslint";

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

Loading the UMD bundle directly via a `<script>` tag exposes `window.eslint.Linter`:

```html
<script src="https://cdn.jsdelivr.net/npm/eslint-linter-browserify/linter.min.js"></script>
<script>
  const linter = new eslint.Linter();

  const messages = linter.verify("var foo;", {
    rules: {
      semi: ["error", "never"]
    }
  }, { filename: "foo.js" });

  console.log(messages);
</script>
```

## Bundle Variants

| File / Package Specifier | Format | Description |
| --- | --- | --- |
| `eslint-linter-browserify` | ESM (`linter.mjs`) / CJS (`linter.cjs`) | Default entry points for bundlers (Vite, Rollup, Webpack, etc.) and Node.js |
| `linter.min.js` | UMD (minified) | Standalone minified bundle for browser `<script>` tags (`window.eslint.Linter`) |
| `linter.js` | UMD (unminified) | Standalone unminified bundle for development and debugging |

## Examples

- [CodeMirror JavaScript Example](./example) - Using ESLint with CodeMirror for JavaScript.
- [CodeMirror TypeScript Example](./example-typescript) - Using ESLint and `typescript-eslint` recommended configuration with CodeMirror for TypeScript.

## Documentation

For full details on the `Linter` API and supported options, see the [ESLint Node.js API Documentation](https://eslint.org/docs/latest/integrate/nodejs-api#linter).

