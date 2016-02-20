// fix for autoprefixer
require('es6-promise').polyfill();

// Plugins
var gulp = require('gulp'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),

    // sass related plugins
    combineMq = require('gulp-combine-mq'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    pixrem = require('gulp-pixrem'),
    sass = require('gulp-sass'),

    // scripts related plugins
    concat = require('gulp-concat'),

    // server related plugins
    connect = require('gulp-connect'), // server for HTML static files
    connectPhp = require('gulp-connect-php'), // server for dynamic PHP files
    browserSync = require('browser-sync'), // required for reloading dynamic files

    reload = browserSync.reload; // required for reloading dynamic files

var dynamicMarkupInput = [
    'builds/development/*.php',
    'builds/development/**/*.php',
];

var staticMarkupInput = [
    'builds/development/*.html',
    'builds/development/**/*.html'
];

var sassInput = [
    'components/sass/**/*.scss'
];

var sassDir = [
    'components/sass/**/*.scss'
];

var scriptInput = [
    'bower_components/jquery/dist/jquery.js',
    'components/scripts/scripts.js'
];
var outputDir = ['builds/development/'];


// PLUGIN OPTIONS
var sassOptions = {
    errLogToConsole: true,
    includePaths: [
        'bower_components/susy/sass',
        'bower_components/breakpoint-sass/stylesheets'],
    outputStyle: 'expanded'
};
var autoprefixerOptions = {
    browsers: ['last 2 versions', '> 1%', 'ie 8', 'ie 9']
};
var combineMqOptions = {
    beautify: true
};


// BEGIN TASKS
gulp.task('html', function () {
    return gulp.src(staticMarkupInput)
        .pipe(connect.reload());
})

gulp.task('php', function () {
    return gulp.src(dynamicMarkupInput)
        .pipe(reload({
            stream: true
        }));
})

gulp.task('sass', function () {
    return gulp.src(sassInput)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(combineMq(combineMqOptions))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(pixrem())
        //.pipe(cssmin())
        //.pipe(rename(renameOptions))
        .pipe(sourcemaps.write('/maps'))
        .pipe(gulp.dest('builds/development/styles/'))
        .pipe(connect.reload());
});

gulp.task('scripts', function () {
    return gulp.src(scriptInput)
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('builds/development/scripts/'))
        .pipe(connect.reload());
});

gulp.task('connect', function () {
    connect.server({
        root: 'builds/development/',
        livereload: true
    });
});

gulp.task('connectPhp', function () {
    connectPhp.server({
        hostname: '0.0.0.0',
        port: 8000,
        base: '/builds/development/index.php',
    });
});

gulp.task('connectSync', ['connectPhp'], function () {
    connectPhp.server({}, function () {
        browserSync({
            proxy: 'localhost:8000',
            open: {
                browser: 'Google Chrome'
            }
        });
    });

    gulp.watch(dynamicMarkupInput).on('change', function () {
        browserSync.reload();
    });
});

// run 'default' task before running watch
gulp.task('watch', function () {
    gulp.watch(staticMarkupInput, ['html']);
    gulp.watch(dynamicMarkupInput, ['php']);
    gulp.watch(sassInput, ['sass']);
    gulp.watch(scriptInput, ['scripts']);
});

// Default task
gulp.task('static', ['html', 'sass', 'scripts', 'connect', 'watch']);
gulp.task('dynamic', ['php', 'sass', 'scripts', 'connectSync', 'watch']);
gulp.task('default', ['php', 'sass', 'scripts', 'connectSync', 'watch']);
