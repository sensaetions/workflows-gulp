var gulp = require('gulp'),
    connect = require('gulp-connect-php');

gulp.task('connect', function () {
    connect.server();
});

gulp.task('default', ['connect']);
