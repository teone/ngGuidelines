'use strict';

var gulp = require('gulp');
var wrench = require('wrench');

var options = {
  src: 'src/',
  scripts: 'src/js/',
  tmp: 'src/.tmp',
  bower: 'bower_components/'
};

wrench.readdirSyncRecursive('./gulp')
.map(function(file) {
  require('./gulp/' + file)(options);
});

gulp.task('default', function () {
  gulp.start('serve');
});
