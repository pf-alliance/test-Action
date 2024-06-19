"use strict";

const { series, parallel } = require("gulp");
const { compile } = require("./gulp-tasks/compile");
const { watchFiles } = require("./gulp-tasks/watch");
const { min_css, min_js } = require("./gulp-tasks/minify");

// gulp
exports.default = compile;

// gulp watch
exports.watch = series(watchFiles);

// gulp build
exports.build = series(compile, parallel(min_css, min_js));
