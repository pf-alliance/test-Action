var fs = require("fs");

const { src, dest } = require("gulp");
const rename = require("gulp-rename");

const pkg = JSON.parse(fs.readFileSync("package.json"));

// Copy CSS files to build dir.
function copy_css() {
  return src([
    "node_modules/slick-carousel/slick/slick.css",
    "_/source/styles/style.css",
    "_/source/styles/editor.css",
    "_/source/styles/print.css",
  ])
    .pipe(
      rename(function (path) {
        switch (path.basename) {
          case "slick":
            path.dirname += "/vendor";
            break;
          case "style":
            path.basename = pkg.name;
            break;
          default:
            break;
        }
        return path;
      })
    )
    .pipe(dest("_/css"));
}

// Copy JS files to build dir.
function copy_js() {
  return src([
    "_/source/scripts/script.js",
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/foundation-sites/dist/js/plugins/foundation.core.min.js",
    "node_modules/foundation-sites/dist/js/plugins/foundation.core.min.js.map",
    "node_modules/foundation-sites/dist/js/plugins/foundation.util.box.min.js",
    "node_modules/foundation-sites/dist/js/plugins/foundation.util.box.min.js.map",
    "node_modules/foundation-sites/dist/js/plugins/foundation.util.keyboard.min.js",
    "node_modules/foundation-sites/dist/js/plugins/foundation.util.keyboard.min.js.map",
    "node_modules/foundation-sites/dist/js/plugins/foundation.util.mediaQuery.min.js",
    "node_modules/foundation-sites/dist/js/plugins/foundation.util.mediaQuery.min.js.map",
    "node_modules/foundation-sites/dist/js/plugins/foundation.util.motion.min.js",
    "node_modules/foundation-sites/dist/js/plugins/foundation.util.motion.min.js.map",
    "node_modules/foundation-sites/dist/js/plugins/foundation.util.timer.min.js",
    "node_modules/foundation-sites/dist/js/plugins/foundation.util.timer.min.js.map",
    "node_modules/foundation-sites/dist/js/plugins/foundation.util.imageLoader.min.js",
    "node_modules/foundation-sites/dist/js/plugins/foundation.util.imageLoader.min.js.map",
    "node_modules/foundation-sites/dist/js/plugins/foundation.util.triggers.min.js",
    "node_modules/foundation-sites/dist/js/plugins/foundation.util.triggers.min.js.map",
    "node_modules/foundation-sites/dist/js/plugins/foundation.accordion.min.js",
    "node_modules/foundation-sites/dist/js/plugins/foundation.accordion.min.js.map",
    "node_modules/foundation-sites/dist/js/plugins/foundation.reveal.min.js",
    "node_modules/foundation-sites/dist/js/plugins/foundation.reveal.min.js.map",
    "node_modules/foundation-sites/dist/js/plugins/foundation.tabs.min.js",
    "node_modules/foundation-sites/dist/js/plugins/foundation.tabs.min.js.map",
    "node_modules/foundation-sites/dist/js/plugins/foundation.tooltip.min.js",
    "node_modules/foundation-sites/dist/js/plugins/foundation.tooltip.min.js.map",
    "node_modules/foundation-sites/dist/js/plugins/foundation.responsiveAccordionTabs.min.js",
    "node_modules/foundation-sites/dist/js/plugins/foundation.responsiveAccordionTabs.min.js.map",
    "node_modules/slick-carousel/slick/slick.min.js",
    "node_modules/css-element-queries/src/ResizeSensor.js",
    "node_modules/sticky-sidebar/dist/jquery.sticky-sidebar.min.js",
  ])
    .pipe(
      rename(function (path) {
        if (path.basename === "script") {
          path.basename = pkg.name;
        } else {
          path.dirname += "/vendor";
        }
        return path;
      })
    )
    .pipe(dest("_/js"));
}

module.exports = {
  copy_css,
  copy_js,
};
