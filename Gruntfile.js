'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.
		clean: {
			files: ['dist']
		},
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			dist: {
				files: {
					'dist/jquery-tabs-effect.js': ['src/jquery-tabs-effect.js'],
					'dist/jquery-tabs-history.js': ['src/jquery-tabs-history.js'],
					'dist/jquery-tabs-keyboard.js': ['src/jquery-tabs-keyboard.js'],
					'dist/jquery-tabs-all.js': ['src/*.js'],
				}
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				files: {
					'dist/jquery-tabs-effect.min.js': ['dist/jquery-tabs-effect.js'],
					'dist/jquery-tabs-history.min.js': ['dist/jquery-tabs-history.js'],
					'dist/jquery-tabs-keyboard.min.js': ['dist/jquery-tabs-keyboard.js'],
					'dist/jquery-tabs-all.min.js': ['dist/jquery-tabs-all.js'],
				}
			}
		},
		qunit: {
			files: ['test/**/*.html']
		},
		jshint: {
			gruntfile: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: 'Gruntfile.js'
			},
			src: {
				options: {
					jshintrc: 'src/.jshintrc'
				},
				src: ['src/**/*.js']
			},
			test: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src: ['test/**/*.js']
			},
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			src: {
				files: '<%= jshint.src.src %>',
				tasks: ['jshint:src', 'qunit']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'qunit']
			},
		},
		jsbeautifier: {
			files: ["Gruntfile.js", "src/**/*.js"],
			options: {
				"indent_size": 1,
				"indent_char": "	",
				"indent_level": 0,
				"indent_with_tabs": true,
				"preserve_newlines": true,
				"max_preserve_newlines": 10,
				"jslint_happy": false,
				"brace_style": "collapse",
				"keep_array_indentation": false,
				"keep_function_indentation": false,
				"space_before_conditional": true,
				"eval_code": false,
				"indent_case": false,
				"unescape_strings": false
			}
		},
		recess: {
			css: {
				src: ["less/**/*.less"],
				dest: 'css/<%= pkg.name %>.css',
				options: {
					compile: true
				}
			}
		},
		replace: {
			bower: {
				src: ['bower.json'],
				overwrite: true, // overwrite matched source files
				replacements: [{
					from: /("version": ")([0-9\.]+)(")/g,
					to: "$1<%= pkg.version %>$3"
				}]
			},
			jquery: {
				src: ['tabs.jquery.json'],
				overwrite: true, // overwrite matched source files
				replacements: [{
					from: /("version": ")([0-9\.]+)(")/g,
					to: "$1<%= pkg.version %>$3"
				}]
			},
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.loadNpmTasks('grunt-jsbeautifier');
	grunt.loadNpmTasks('grunt-recess');
	grunt.loadNpmTasks('grunt-text-replace');

	// Default task.
	grunt.registerTask('default', ['jshint',  'clean', 'concat', 'uglify']);

	grunt.registerTask('dist', ['concat', 'uglify']);

	grunt.registerTask('js', ['jsbeautifier', 'jshint']);
	grunt.registerTask('css', ['recess']);

	grunt.registerTask('version', [
		'replace:bower',
		'replace:jquery'
	]);
};
