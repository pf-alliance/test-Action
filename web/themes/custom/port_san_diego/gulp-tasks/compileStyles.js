const { src, dest } = require("gulp");
const postcss = require("gulp-postcss");
const cssnext = require("postcss-cssnext");
const sourcemaps = require("gulp-sourcemaps");
const globSass = require("gulp-sass-globbing");
const sass = require("gulp-sass")(require("node-sass"));

// Merge SCSS files into style.scss.
function sass_gobbling() {
  return src(["all/**/*.scss", "editor.scss", "partials/**/*.scss"], {
    cwd: "_/source/styles/sass",
  })
    .pipe(
      globSass(
        {
          path: "style.scss",
        },
        {
          useSingleQuotes: true,
        }
      )
    )
    .pipe(dest("_/source/styles/sass"));
}

// Compile SCSS files to CSS.
function compileSass() {
  return src([
    "_/source/styles/sass/style.scss",
    "_/source/styles/sass/editor.scss",
    "_/source/styles/sass/print.scss",
  ])
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        includePaths: ["node_modules/foundation-sites/scss"],
        implementation: sass,
      }).on("error", sass.logError)
    )
    .pipe(sourcemaps.write("./"))
    .pipe(dest("_/source/styles"));
}

// Apply PostCSS & CSSNext to compiled CSS.
function post_css() {
  return src("_/css/*.css")
    .pipe(
      postcss([
        cssnext({
          browsers: "last 2 versions, ie >= 9, and_chr >= 2.3, ios_saf >= 8.4",
        }),
      ])
    )
    .pipe(dest("_/css"));
}

module.exports = {
  sass_gobbling,
  compileSass,
  post_css,
};
