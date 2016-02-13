// fix for autoprefixer
//require('es6-promise').polyfill();

// Task variables
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    
    // style related
    
    // js related
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),

    // server related
    connect = require('gulp-connect-php');

var scriptSources = ['components/scripts/*.js']

// TASKS

// take all scripts from components, concatentate them, copy to development folder
gulp.task('scripts', function() {
    gulp.src(scriptSources)
        .pipe(concat('scripts.js'))
        .pipe(browserify())
        .pipe(gulp.dest('builds/development/scripts'))
});

gulp.task('connect', function () {
    connect.server();
});

// Default task
gulp.task('default', ['connect']);
