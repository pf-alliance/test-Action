const { src, dest } = require("gulp");
const cheerio = require("gulp-cheerio");
const rename = require("gulp-rename");
const svgmin = require("gulp-svgmin");
const svgstore = require("gulp-svgstore");

// Create SVG sprite.
function svg_store() {
  return src("_/source/svg/**/*.svg")
    .pipe(rename({ prefix: "icon-" }))
    .pipe(
      svgmin({
        plugins: [
          {
            removeViewBox: false,
          },
        ],
      })
    )
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(
      cheerio({
        run: ($) => {
          $("svg").attr("style", "display:none");
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(rename({ basename: "svg-defs" }))
    .pipe(dest("./"));
}

module.exports = {
  svg_store,
};
