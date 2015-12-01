const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const wiredep = require('wiredep').stream;
const babel = require('gulp-babel');
const inject = require('gulp-inject');
const angularFilesort = require('gulp-angular-filesort');

module.exports = function(options){
  // Static server
  gulp.task('browser', ['bower'], function() {
    browserSync.init({
      server: {
        baseDir: options.src,
        routes: {
          '/bower_components': options.bower
        },
      }
    });

    gulp.watch(options.src + 'js/**/*.js', ['js-watch']);
    gulp.watch(options.bower + '**/*.js', ['bower'], function(){
      browserSync.reload();
    });
    gulp.watch(options.src + '**/*.html', function(){
      browserSync.reload();
    });
  });

  // watch for js changes
  gulp.task('js-watch', ['injectScript'], function(){
    browserSync.reload();
  });

  // inject bower dependencies with wiredep
  gulp.task('bower', function () {
    return gulp.src(`${options.src}index.html`)
    .pipe(wiredep({devDependencies: false}))
    .pipe(gulp.dest(options.src));
  });

  // transpile js with sourceMaps
  gulp.task('babel', function(){
    return gulp.src(`${options.scripts}**/*.js`)
      .pipe(babel({sourceMaps: true}))
      .pipe(gulp.dest(options.tmp));
  });

  // inject scripts
  gulp.task('injectScript', ['babel'], function(){
    return gulp.src(options.src + 'index.html')
      .pipe(
        inject(
          gulp.src([
            options.tmp + '**/*.js',
            options.api + '*.js',
            options.helpers + '**/*.js'
          ])
          .pipe(angularFilesort()),
          {
            ignorePath: [options.src, '/../../ngXosLib']
          }
        )
      )
      .pipe(gulp.dest(options.src));
  });

  gulp.task('serve', ['injectScript', 'browser']);
}
