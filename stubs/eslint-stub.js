import * as eslintBrowserify from "eslint-linter-browserify";
import rulesModule from "eslint/lib/rules/index.js";
import sourceCodeModule from "eslint/lib/languages/js/source-code/index.js";

const builtinRules = (rulesModule && rulesModule.default) ? rulesModule.default : rulesModule;
const SourceCode = (sourceCodeModule && sourceCodeModule.SourceCode) || (sourceCodeModule && sourceCodeModule.default) || sourceCodeModule;

export class ESLint {}
export class FlatESLint {}
export class LegacyESLint {}
export class RuleTester {}
export const Linter = eslintBrowserify.Linter;
export { SourceCode, builtinRules };

const stub = {
	Linter,
	SourceCode,
	ESLint,
	FlatESLint,
	LegacyESLint,
	RuleTester,
	builtinRules,
};
stub.default = stub;

export default stub;
