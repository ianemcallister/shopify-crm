/*
*   GULP FILE
*/

//  DEFINE DEPENDENCIES

//  DIST
var gulp 	        = require('gulp');                  // build tools
var less            = require('gulp-less');
//var babel           = require('gulp-babel');						
var concat          = require('gulp-concat');
var uglify          = require('gulp-uglify');
var rename          = require('gulp-rename');
var cleanCSS        = require('gulp-clean-css');
var del             = require('del');
var merge           = require('merge-stream');

var paths = {
    styles: {
      src: 'public/styles/**/*.less',
      dest: 'dist/assets/styles/'
    },
    libraries: {
      src: 'public/vendorScripts/**/*.js',
      dest: 'dist/assets/scripts/'
    },
    scripts: {
      src: 'public/scripts/**/*.js',
      dest: 'dist/assets/scripts/'
    },
    views: {
        src: "public/views/**/*.htm",
        dest: "dist/assets/views"
    },
    index: {
        src: 'public/**/index.html',
        dest: 'dist/'
    }
  };

  function clean() {
    return del([ 'dist' ]);
  };

/*
 * Define our tasks using plain functions
 */
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(less())
        .pipe(cleanCSS())
        // pass in options to the stream
        .pipe(rename({
        basename: 'main',
        suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest));
}

function lib() {
    return gulp.src(paths.libraries.src, { sourcemaps: true })
          .pipe(concat('lib.min.js'))
          .pipe(gulp.dest(paths.libraries.dest));
}
   
function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
    //      .pipe(babel())
    //      .pipe(uglify())
          .pipe(concat('main.min.js'))
          .pipe(gulp.dest(paths.scripts.dest));
}

function views() {
    return gulp.src(paths.views.src)
        .pipe(gulp.dest(paths.views.dest));
}

function index() {
    return gulp.src(paths.index.src)
        .pipe(gulp.dest(paths.index.dest));
}
   
function watch() {
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
  }

  /*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(clean, gulp.parallel(styles, lib, scripts, views, index));

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;