const { dest } = require("gulp");

const d2 = require("gulp-download2");

// Copy files down via cURL.
function download() {
  return d2([
    "https://bitbucket.org/!api/2.0/snippets/freshform/ookRr/2fe1f38177f192a851d5b276a5c09f97c56c70c5/files/.sass-lint.yml",
    "https://bitbucket.org/!api/2.0/snippets/freshform/M5bGg/1a1ff185fe0b95f87459c70165b36f2793a4af69/files/.jshintrc",
  ]).pipe(dest("./"));
}
module.exports = {
  download,
};
