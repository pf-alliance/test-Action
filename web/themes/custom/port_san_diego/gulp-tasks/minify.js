const fs = require("fs");
const { dest, src } = require("gulp");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");

const pkg = JSON.parse(fs.readFileSync("package.json"));

// Minify CSS files.
function min_css() {
  return src([
    "_/css/" + pkg.name + ".css",
    "_/css/editor.css",
    "_/css/print.css",
  ])
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("_/css/"));
}

// Minify JS files.
function min_js() {
  return src("_/js/" + pkg.name + ".js")
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("_/js/"));
}

module.exports = {
  min_css,
  min_js,
};
