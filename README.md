# WordPress on Docker

## 1. Install WordPress
[Reference](https://docs.docker.jp/compose/wordpress.html)

```yml
version: '3'

services:
   db:
     image: mysql:5.7
     volumes:
       - db_data:/var/lib/mysql
     restart: always
     environment:
       MYSQL_ROOT_PASSWORD: somewordpress
       MYSQL_DATABASE: wordpress
       MYSQL_USER: wordpress
       MYSQL_PASSWORD: wordpress

   wordpress:
     depends_on:
       - db
     image: wordpress:latest
     ports:
       - "8000:80"
     restart: always
     environment:
       WORDPRESS_DB_HOST: db:3306
       WORDPRESS_DB_USER: wordpress
       WORDPRESS_DB_PASSWORD: wordpress
     volumes:
       - ./:/var/www/html # setting root

volumes:
    db_data:
```

```bash
# create
$ docker-compose up -d

# access http://localhost:8000/
# install WordPress

# shotdown
$ docker-compose down

# shotdown & remove DB
docker-compose down --volumes
```

```bash
$ touch .gitignore
```

Reference source -> [https://gist.github.com/samhotchkiss/6190462](https://gist.github.com/samhotchkiss/6190462)
```
# This is a template .gitignore file for git-managed WordPress projects.
#
# Fact: you don't want WordPress core files, or your server-specific
# configuration files etc., in your project's repository. You just don't.
#
# Solution: stick this file up your repository root (which it assumes is
# also the WordPress root directory) and add exceptions for any plugins,
# themes, and other directories that should be under version control.
#
# See the comments below for more info on how to add exceptions for your
# content. Or see git's documentation for more info on .gitignore files:
# http://kernel.org/pub/software/scm/git/docs/gitignore.html

# Ignore everything in the root except the "wp-content" directory.
/*
!.gitignore
!wp-content/

# Ignore everything in the "wp-content" directory, except the "plugins"
# and "themes" directories.
wp-content/*
!wp-content/plugins/
!wp-content/themes/

# Ignore everything in the "plugins" directory, except the plugins you
# specify (see the commented-out examples for hints on how to do this.)
# wp-content/plugins/*
# !wp-content/plugins/my-directory-plugin/

# Ignore everything in the "themes" directory, except the themes you
# specify (see the commented-out example for a hint on how to do this.)
# wp-content/themes/*
# !wp-content/themes/my-theme/
```


## 2. Set Gulp.js files

```javascript
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
const GULP_BABEL        = require('gulp-babel')
const GULP_UGLIFY       = require('gulp-uglify-es').default
const GULP_SLIM         = require('gulp-slim')
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
console.log(GULP_PATHS.OUT_CSS)

/*
 * Browser-sync Task
 */
const browserSyncAbility = () =>
  GULP_BROWSER_SYNC.init({
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
const compileJs = () =>
  src(GULP_PATHS.SRC_JS)
  .pipe(GULP_SOURCEMAPS.init())
  .pipe(GULP_PLUMBER({errorHandler:GULP_NOTIFY.onError('<%= error.message %>')}))
  .pipe(GULP_BABEL())
  .pipe(GULP_UGLIFY({compress:true}))
  .pipe(GULP_SOURCEMAPS.write('maps'))
  .pipe(dest(GULP_PATHS.OUT_JS))
  .pipe(GULP_BROWSER_SYNC.stream())


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
const watchJsFiles = () => watch(GULP_PATHS.SRC_JS, compileJs)
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
  compileJs()
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
```

### Create MySQL Dump

```
# Check Container Name
$ docker container ls

$ docker exec -it CONTAINER_NAME mysqldump -u USER_NAME -pPASSWORD DATABASE_NAME db_data/FILE_NAME.sql
```

## 3. Advanced Install WordPress
Install using the Dockerfile.

```bash
$ touch {Dockerfile,wp-install.sh}
```

### docker-compose.yml

```yml
version: '3'

services:
  db:
    image: mysql:5.7
    volumes:
      - db_data:/var/lib/mysql
      - ./db-data/mysql.dump.sql:/docker-entrypoint-initdb.d/install_wordpress.sql
    restart: always
    env_file: .env

  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    ports:
      - "8000:80"
    restart: always
    environment:
      WORDPRESS_DB_HOST: db:3306
    env_file: .env
    volumes:
      - ./:/var/www/html
      - ./wp-install.sh:/tmp/wp-install.sh # add

volumes:
    db_data:
```

### Dockerfile

```dockerfile
FROM wordpress:latest

RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
  && chmod +x wp-cli.phar \
  && mv wp-cli.phar /usr/local/bin/wp \
  && wp --info
```

### wp-install.sh

```bash
#!/bin/bash

set -ex;

# wp core install
wp core install \
  --url='http://localhost:8000' \
  --title='title' \
  --admin_user='wordpress' \
  --admin_password='wordpress' \
  --admin_email='wordpress@wordpress.com' \
  --allow-root

# wp language core install
wp language core install ja --activate \
  --allow-root

# Error when using method chains. Why?
# wp option update
wp option update timezone_string 'Asia/Tokyo' --allow-root
wp option update date_format 'Y-m-d' --allow-root
wp option update time_format 'H:i' --allow-root

# wp option update
wp option update blogdescription '' \
  --allow-root

# Error when using method chains. Why?
# wp plugin delete
wp plugin delete hello.php --allow-root
wp plugin delete akismet --allow-root

# Error when using method chains. Why?
# wp plugin install
# error -> wp plugin install advanced-custom-fields-repeater-field --activate --allow-root
wp plugin install smart-custom-fields --activate --allow-root
wp plugin install advanced-custom-fields --activate --allow-root
wp plugin install classic-editor --activate --allow-root
wp plugin install custom-post-type-ui --activate --allow-root
wp plugin install custom-post-type-permalinks --activate --allow-root
wp plugin install duplicate-post --activate --allow-root
wp plugin install google-sitemap-generator --activate --allow-root
wp plugin install intuitive-custom-post-order --activate --allow-root
wp plugin install really-simple-csv-importer --activate --allow-root
wp plugin install wp-all-export --activate --allow-root
wp plugin install wp-maintenance-mode --activate --allow-root
wp plugin install wp-multibyte-patch --activate --allow-root

# Error when using method chains. Why?
# Remove Themes
wp theme delete twentynineteen --allow-root
wp theme delete twentytwenty --allow-root
# wp theme delete twentytwentyone --allow-root

# wp option update
# wp option update permalink_structure /%postname%/ --allow-root
```

```bash
# create
$ docker build

# check
$ docker images

$ docker-compose up -d

# access http://localhost:8000/

# install WordPress
$ docker exec -it CONTAINER_NAME /bin/bash

/var/www/html# chmod +x /tmp/wp-install.sh
/var/www/html# /tmp/wp-install.sh
```
