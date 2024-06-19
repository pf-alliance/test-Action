const { series, parallel } = require("gulp");
const { sass_gobbling, compileSass, post_css } = require("./compileStyles");
const { download } = require("./download");
const { sass_lint, js_lint } = require("./lint");
const { copy_css, copy_js } = require("./copy");
const { svg_store } = require("./sprite");

module.exports = {
  compile: series(
    parallel(sass_gobbling),
    download,
    parallel(sass_lint, js_lint),
    compileSass,
    parallel(copy_css, copy_js),
    post_css,
    svg_store
  ),
};
