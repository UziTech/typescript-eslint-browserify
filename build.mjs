import * as esbuild from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fsPromisesStub = path.resolve(__dirname, "stubs/fs-promises-stub.js");
const workerThreadsStub = path.resolve(__dirname, "stubs/worker-threads-stub.js");
const eslintStub = path.resolve(__dirname, "stubs/eslint-stub.js");
const getTSConfigRootDirFromStackStub = path.resolve(__dirname, "stubs/get-tsconfig-root-dir-stub.js");
const semverComparatorStub = path.resolve(__dirname, "stubs/semver-comparator-stub.js");
const getTextWithParenthesesStub = path.resolve(__dirname, "stubs/get-text-with-parentheses-stub.js");
const eslintRules = path.resolve(__dirname, "node_modules/eslint/lib/rules/index.js");
const eslintSourceCode = path.resolve(__dirname, "node_modules/eslint/lib/languages/js/source-code/index.js");

const polyfillMap = require("rollup-plugin-polyfill-node/dist/modules.js").getModules();

const nodePolyfillPlugin = {
	name: "node-polyfills",
	setup(build) {
		// Specific stubs and regex rewrites
		build.onResolve({ filter: /.*\/getTSConfigRootDirFromStack(\.js)?$/ }, () => ({
			path: getTSConfigRootDirFromStackStub,
		}));
		build.onResolve({ filter: /.*(^|[\\/])comparator(\.js)?$/ }, () => ({
			path: semverComparatorStub,
		}));
		build.onResolve({ filter: /.*\/getTextWithParentheses(\.js)?$/ }, () => ({
			path: getTextWithParenthesesStub,
		}));

		// Handle node: and built-in imports
		build.onResolve({ filter: /^(node:)?([a-zA-Z0-9_\/]+)$/ }, (args) => {
			const name = args.path.replace(/^node:/, "");
			if (name === "fs/promises" || name === "worker_threads") {
				return undefined; // Handled by alias
			}
			if (polyfillMap.has(name)) {
				return { path: name, namespace: "node-polyfill" };
			}
		});

		build.onLoad({ filter: /.*/, namespace: "node-polyfill" }, (args) => {
			const contents = polyfillMap.get(args.path);
			if (contents) {
				return { contents, loader: "js", resolveDir: __dirname };
			}
		});
	},
};

const intro = `if (typeof global === 'undefined') { var global = globalThis || window; }\nvar process = global.process = global.process || { env: {}, platform: 'browser' };\ntry { process.browser = true; } catch {}\nvar __dirname = typeof __dirname !== 'undefined' ? __dirname : "/";\nvar __filename = typeof __filename !== 'undefined' ? __filename : "/index.js";`;

const umdBanner = `(function (root, factory) {
	if (typeof exports === 'object' && typeof module !== 'undefined') {
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else {
		root = typeof globalThis !== 'undefined' ? globalThis : root || self;
		root.tseslint = factory();
	}
})(this, function () {
${intro}`;

const umdFooter = `\nreturn tseslint;\n});`;

const commonOptions = {
	entryPoints: ["index.js"],
	bundle: true,
	platform: "browser",
	alias: {
		"node:fs/promises": fsPromisesStub,
		"fs/promises": fsPromisesStub,
		"node:worker_threads": workerThreadsStub,
		"worker_threads": workerThreadsStub,
		"eslint/use-at-your-own-risk": eslintStub,
		"eslint/lib/unsupported-api.js": eslintStub,
		"eslint/lib/rules/index.js": eslintRules,
		"eslint/lib/rules": eslintRules,
		"eslint/lib/languages/js/source-code/index.js": eslintSourceCode,
		"eslint/lib/languages/js/source-code": eslintSourceCode,
		eslint: eslintStub,
	},
	plugins: [nodePolyfillPlugin],
};

await Promise.all([
	// UMD (unminified)
	esbuild.build({
		...commonOptions,
		format: "iife",
		globalName: "tseslint",
		banner: { js: umdBanner },
		footer: { js: umdFooter },
		outfile: "tseslint.js",
	}),
	// UMD (minified)
	esbuild.build({
		...commonOptions,
		format: "iife",
		globalName: "tseslint",
		banner: { js: umdBanner },
		footer: { js: umdFooter },
		minify: true,
		outfile: "tseslint.min.js",
	}),
	// ESM
	esbuild.build({
		...commonOptions,
		format: "esm",
		banner: { js: intro },
		outfile: "tseslint.mjs",
	}),
	// CJS
	esbuild.build({
		...commonOptions,
		format: "cjs",
		banner: { js: intro },
		outfile: "tseslint.cjs",
	}),
]);
