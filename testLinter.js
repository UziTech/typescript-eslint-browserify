function testLinter(name, tsEslint) {
	if (typeof tsEslint.configs.recommended === "object") {
		console.log(`Passed`);
	} else {
		console.error(`Failed`);
		process.exit(1);
	}
}

module.exports = {testLinter};
