import commonjs from "@rollup/plugin-commonjs";
import {nodeResolve} from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import nodePolyfills from "rollup-plugin-polyfill-node";
import terser from "@rollup/plugin-terser";
import alias from "@rollup/plugin-alias";
import path from "node:path";
import {fileURLToPath} from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fsPromisesStub = path.resolve(__dirname, "stubs/fs-promises-stub.js");
const workerThreadsStub = path.resolve(__dirname, "stubs/worker-threads-stub.js");
const eslintStub = path.resolve(__dirname, "stubs/eslint-stub.js");
const getTSConfigRootDirFromStackStub = path.resolve(__dirname, "stubs/get-tsconfig-root-dir-stub.js");
const eslintRules = path.resolve(__dirname, "node_modules/eslint/lib/rules/index.js");
const eslintSourceCode = path.resolve(__dirname, "node_modules/eslint/lib/languages/js/source-code/index.js");

function generateRollup(output) {
	const plugins = [
		alias({
			entries: [
				{ find: "node:fs/promises", replacement: fsPromisesStub },
				{ find: "fs/promises", replacement: fsPromisesStub },
				{ find: "node:worker_threads", replacement: workerThreadsStub },
				{ find: "worker_threads", replacement: workerThreadsStub },
				{ find: "eslint/use-at-your-own-risk", replacement: eslintStub },
				{ find: "eslint/lib/unsupported-api.js", replacement: eslintStub },
				{ find: "eslint/lib/rules/index.js", replacement: eslintRules },
				{ find: "eslint/lib/rules", replacement: eslintRules },
				{ find: "eslint/lib/languages/js/source-code/index.js", replacement: eslintSourceCode },
				{ find: "eslint/lib/languages/js/source-code", replacement: eslintSourceCode },
				{ find: /^eslint$/, replacement: eslintStub },
				{ find: /.*\/getTSConfigRootDirFromStack(\.js)?$/, replacement: getTSConfigRootDirFromStackStub },
				{ find: /^node:(.*)/, replacement: '$1' },
			],
		}),
		nodeResolve({
			preferBuiltins: false,
			browser: true,
		}),
		commonjs({
			ignoreGlobal: true,
			requireReturnsDefault: "preferred",
			strictRequires: "auto",
		}),
		json(),
		nodePolyfills(),
	];

	if (output.file.match(/\.min\./)) {
		plugins.push(terser());
	}

	return {
		context: "globalThis",
		input: "index.js",
		output: {
			intro: "if (!global) { var global = globalThis || window; }\nvar process = global.process = global.process || { env: {}, platform: 'browser' };",
			...output,
		},
		plugins,
	};
}

export default [
	generateRollup({
		file: "tseslint.js",
		format: "umd",
		exports: "named",
		name: "tseslint",
	}),
	generateRollup({
		file: "tseslint.min.js",
		format: "umd",
		exports: "named",
		name: "tseslint",
	}),
	generateRollup({
		file: "tseslint.mjs",
		format: "esm",
	}),
	generateRollup({
		file: "tseslint.cjs",
		format: "cjs",
		exports: "named",
	}),
];
