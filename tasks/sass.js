'use strict';
var path = require('path');
var eachAsync = require('each-async');
var assign = require('object-assign');
var sass = require('node-sass');

module.exports = function (grunt) {
	grunt.verbose.writeln('\n' + sass.info + '\n');

	grunt.registerMultiTask('sass', 'Compile Sass to CSS', function () {
		eachAsync(this.files, function (el, i, next) {

			var opts = this.options({
				precision: 10
			});

			var src = el.src[0];

			if (!src || path.basename(src)[0] === '_') {
				next();
				return;
			}

			sass.render(assign({}, opts, {
				file: src,
				outFile: el.dest,
			}),function(err, result) { // >= v3.0.0
				if (err) {
					grunt.log.error(err.message + '\n  ' + 'Code ' + err.status + '  Line ' + err.line + '  Column ' + err.column + '  ' + path.relative(process.cwd(), err.file) + '\n');
					grunt.warn('');
					next(err);
				}
				else {
					grunt.file.write(el.dest, result.css.toString());

					if (opts.sourceMap && !opts.sourceMapEmbed) {
						grunt.file.write(opts.sourceMap === true ? (el.dest + '.map') : path.relative(process.cwd(), opts.sourceMap), result.map.toString());
					}

					grunt.log.writeln('Grunt-SASS'.red + ' compiled file in ' + result.stats.duration + 'ms \n Source: ' + result.stats.entry + '\n Dest: ' + el.dest);

					next();
				}
			})
		}.bind(this), this.async());
	});
};