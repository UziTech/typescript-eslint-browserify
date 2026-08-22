"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextWithParentheses = getTextWithParentheses;
const utils = require("@typescript-eslint/utils");

function getTextWithParentheses(sourceCode, node) {
	// Capture parentheses before and after the node
	let beforeCount = 0;
	let afterCount = 0;
	if (utils.ASTUtils.isParenthesized(node, sourceCode)) {
		const bodyOpeningParen = utils.ESLintUtils.nullThrows(
			sourceCode.getTokenBefore(node, utils.ASTUtils.isOpeningParenToken),
			utils.ESLintUtils.NullThrowsReasons.MissingToken("(", "node")
		);
		const bodyClosingParen = utils.ESLintUtils.nullThrows(
			sourceCode.getTokenAfter(node, utils.ASTUtils.isClosingParenToken),
			utils.ESLintUtils.NullThrowsReasons.MissingToken(")", "node")
		);
		beforeCount = node.range[0] - bodyOpeningParen.range[0];
		afterCount = bodyClosingParen.range[1] - node.range[1];
	}
	return sourceCode.getText(node, beforeCount, afterCount);
}
