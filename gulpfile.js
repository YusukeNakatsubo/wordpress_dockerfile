'use strict';

/*
* Install Plugins
*/
const { watch, series, task, gulp, src, dest, parallel } = require('gulp')
// Plugins
const GULP_NOTIFY       = require('gulp-notify')
const GULP_PLUMBER      = require('gulp-plumber')
const GULP_BROWSER_SYNC = require('browser-sync').create()
const GULP_SASS         = require('gulp-sass')(require('sass'))
const GULP_SOURCEMAPS   = require('gulp-sourcemaps')
const GULP_SASS_GLOB    = require('gulp-sass-glob')
const GULP_AUTOPREFIXER = require('gulp-autoprefixer')
const WEBPACK             = require('webpack')
const GULP_WEBPACK_STREAM = require('webpack-stream')
const WEB_PACK_CONFIG     = require('./webpack.config');
// const GULP_BABEL        = require('gulp-babel')
// const GULP_UGLIFY       = require('gulp-uglify-es').default
// const GULP_SLIM         = require('gulp-slim')
const GULP_IMAGE        = require('gulp-image')
const GULP_CHANGED      = require('gulp-changed')
const GULP_HTMLLINT     = require('gulp-htmllint')
const FANCY_LOG         = require('fancy-log')
const ANSI_COLORS       = require('ansi-colors')
const GULP_CSSLINT      = require('gulp-csslint')
const GULP_ESLINT       = require('gulp-eslint')

/*
* Theme Setting
*/
const THEME_PATH = 'wp-content/themes/test/'


/*
 * Path Settings
 */
const GULP_PATHS = {
  ROOT_DIR: THEME_PATH,
  // ALL_DIR: '**/*.index.html',
  // SRC_SLIM: THEME_PATH + 'src/slim/**/*.slim',
  SRC_SASS: 'src/assets/scss/**/*.scss',
  SRC_JS: 'src/assets/js/**/*.js',
  SRC_IMG: 'src/assets/img/**/*',
  // OUT_SLIM: THEME_PATH,
  OUT_CSS: THEME_PATH + 'assets/css',
  OUT_JS: THEME_PATH + 'assets/js',
  OUT_IMG: THEME_PATH + 'assets/img'
};


/*
 * Browser-sync Task
 */
const browserSyncAbility = () =>
  GULP_BROWSER_SYNC.init({
    // server: {baseDir:GULP_PATHS.ROOT_DIR},
    // port: 8080,
    // reloadOnRestart: true
    files: ['./**/*.php'],
    // Set WordPress Local Port Number
    proxy: 'localhost:8000'
  });
const watchBrowserSync = () => watch(GULP_PATHS.ROOT_DIR, browserSyncAbility)

// const browserReloadAbility = () =>
//   GULP_BROWSER_SYNC.reload()


/*
 * Slim Task
 */
// const compileSlim = () =>
//   src(GULP_PATHS.SRC_SLIM)
//   .pipe(GULP_PLUMBER({errorHandler:GULP_NOTIFY.onError('<%= error.message %>')}))
//   .pipe(GULP_SLIM({
//     require: 'slim/include',
//     pretty: true,
//     options: 'include_dirs=["src/slim/inc"]'
//   }))
//   .pipe(dest(GULP_PATHS.OUT_SLIM))
//   .pipe(GULP_BROWSER_SYNC.stream())
// 相対パスで外部ファイルがうまく読み込めない


/*
* Scss Task
*/
const compileSass = () =>
  src(GULP_PATHS.SRC_SASS)
  .pipe(GULP_SOURCEMAPS.init())
  .pipe(GULP_PLUMBER({errorHandler:GULP_NOTIFY.onError('<%= error.message %>')}))
  .pipe(GULP_SASS_GLOB())
  .pipe(GULP_SASS({outputStyle:'compressed'}))
  .pipe(GULP_AUTOPREFIXER({cascade:false}))
  .pipe(GULP_SOURCEMAPS.write('maps'))
  .pipe(dest(GULP_PATHS.OUT_CSS))
  .pipe(GULP_BROWSER_SYNC.stream())


/*
* Javascript Task
*/
// const compileJs = () =>
//   src(GULP_PATHS.SRC_JS)
//   .pipe(GULP_SOURCEMAPS.init())
//   .pipe(GULP_PLUMBER({errorHandler:GULP_NOTIFY.onError('<%= error.message %>')}))
//   .pipe(GULP_BABEL())
//   .pipe(GULP_UGLIFY({compress:true}))
//   .pipe(GULP_SOURCEMAPS.write('maps'))
//   .pipe(dest(GULP_PATHS.OUT_JS))
//   .pipe(GULP_BROWSER_SYNC.stream())
// -> Migrate to webpack

// 'return' is always required. Why?
const bundleJs = () => {
  return GULP_WEBPACK_STREAM(WEB_PACK_CONFIG, WEBPACK)
    .pipe(GULP_SOURCEMAPS.init())
    .pipe(GULP_SOURCEMAPS.write('maps'))
    .pipe(dest(GULP_PATHS.OUT_JS))
    .pipe(GULP_BROWSER_SYNC.stream())
}


/*
* Images Task
*/
const compressImg = () =>
  src(GULP_PATHS.SRC_IMG)
  .pipe(GULP_CHANGED(GULP_PATHS.OUT_IMG))
  .pipe(GULP_IMAGE({
    pngquant: true,
    optipng: false,
    zopflipng: true,
    jpegRecompress: false,
    mozjpeg: true,
    gifsicle: true,
    svgo: true,
    concurrent: 10,
    quiet: true // defaults to false
  }))
  .pipe(dest(GULP_PATHS.OUT_IMG))


/*
* Watch Files
*/
const watchSassFiles = () => watch(GULP_PATHS.SRC_SASS, compileSass)
const watchJsFiles = () => watch(GULP_PATHS.SRC_JS, bundleJs)
// const watchSlimFiles = () => watch(GULP_PATHS.SRC_SLIM, compileSlim)
const watchImgFiles = () => watch(GULP_PATHS.SRC_IMG, compressImg)


/*
* Default Task
*/
const watchStaticContents = () =>
  watchSassFiles()
  watchJsFiles()
  // watchSlimFiles()
  watchImgFiles()

const defaultTask = () =>
  watchBrowserSync()
  watchStaticContents()
  compileSass()
  bundleJs()
  // compileJs()
  // compileSlim()
  compressImg()

exports.default = defaultTask


/*
* lint Task
*/
const lintHtml = () =>
  src(GULP_PATHS.OUT_SLIM)
  .pipe(GULP_HTMLLINT({}, htmllintReporter))

const htmllintReporter = (filepath, issues) => {
  if (issues.length > 0) {
    issues.forEach((issue) => {
      FANCY_LOG(ANSI_COLORS.cyan('[gulp-htmllint] ') + ANSI_COLORS.white(filepath + ' [' + issue.line + ',' + issue.column + ']: ') + ANSI_COLORS.red('(' + issue.code + ') ' + issue.msg))
    })
    process.exitCode = 1
  }
}

const lintCss = () =>
  src(GULP_PATHS.OUT_CSS)
  .pipe(GULP_CSSLINT())
  .pipe(GULP_CSSLINT.formatter())

const lintEs = () =>
  src(GULP_PATHS.OUT_JS)
  .pipe(GULP_ESLINT())
  .pipe(GULP_ESLINT.format())
  .pipe(GULP_ESLINT.failAfterError())

const lintTask = () =>
  lintHtml()
  lintCss()
  lintEs()

exports.lint = lintTask