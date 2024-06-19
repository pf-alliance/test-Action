const { watch, series } = require("gulp");
const { svg_store } = require("./sprite");
const { copy_css, copy_js } = require("./copy");
const { sass_lint, js_lint } = require("./lint");
const { sass_gobbling, compileSass, post_css } = require("./compileStyles");

function watchFiles() {
  watch(
    [
      "_/source/styles/sass/**/*.scss",
      "!_/source/styles/sass/style.scss",
      "!_/source/styles/sass/foundation-sites/**/*.scss",
    ],
    series(sass_gobbling, sass_lint, compileSass, copy_css, post_css)
  );

  watch("_/source/scripts/**/*.js", series(js_lint, copy_js));

  watch("_/source/svg/**/*.svg", series(svg_store));
}

module.exports = {
  watchFiles,
};
