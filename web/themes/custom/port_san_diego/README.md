# FreshForm Gulp Project Base
This project includes a base for any theme using Node.js, Gulp and Foundation. This project assumes that at least Node.js 20 is installed.

## Install Dependencies
**IMPORTANT:** To ensure the installation process and resource compilation work correctly, make sure you have at least `Node 20.14.0` and `npm 10.7` version installed before continuing.

```
$ npm install
```

## Run Gulp Tasks
If this is your first time downloading the project, make sure to execute the "Default" or "Production" tasks before the "Development" task.

1. **Default:** build CSS and JS, merge SVGs files into one.

```
$ npm run compile
```

2. **Production:** Minify compiled CSS and JS.

```
$ npm run build
```

3. **Development:** Watch files and run associated tasks.

```
$ npm run watch
```
