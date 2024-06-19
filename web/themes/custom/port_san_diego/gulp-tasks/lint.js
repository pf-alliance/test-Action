const { src } = require("gulp");
const jshint = require("gulp-jshint");
const sassLint = require("gulp-sass-lint");

// Lints SCSS files.
function sass_lint() {
  return src([
    "_/source/styles/sass/style.scss",
    "_/source/styles/sass/**/*.scss",
    "!_/source/styles/sass/foundation-sites/**/*",
  ])
    .pipe(
      sassLint({
        options: {
          configFile: ".sass-lint.yml",
        },
      })
    )
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
}

// Lints JS files.
function js_lint() {
  return src(["_/source/scripts/*.js"])
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
}

module.exports = {
  sass_lint,
  js_lint,
};
