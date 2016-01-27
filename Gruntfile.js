module.exports = function(grunt) {

	// configure
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		qunit: {
			options: {
				timeout: 30000,
				coverage: {
					src:["src/<%= pkg.name %>.js"],
					instrumentedFiles: "temp/",
					htmlReport: "build/coverage",
					lcovReport: "build/coverage-lcov",
					linesThresholdPct: 0
				}
			},
			files: ['test/*.html']
		}
	});

	// include libraries
	grunt.loadNpmTasks("grunt-qunit-istanbul");

	// run tasks
	grunt.registerTask('testEModal', ['qunit']);
};