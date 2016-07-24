'use strict';

var pathUtil = require('path');
var Q = require('q');
var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var jetpack = require('fs-jetpack');

var bundle = require('./bundle');
var utils = require('../utils');

var projectDir = jetpack;
var srcDir = projectDir.cwd('./app');
var destDir = projectDir.cwd('./build');

var paths = {
    copyFromAppDir: [
        './node_modules/**',
        './helpers/**',
        './**/*.html',
        './**/*.+(jpg|png|svg)'
    ],
};

// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('clean', function () {
    return destDir.dirAsync('.', { empty: true });
});


var copyTask = function () {
    return projectDir.copyAsync('app', destDir.path(), {
            overwrite: true,
            matching: paths.copyFromAppDir
        });
};
gulp.task('copy', ['clean'], copyTask);
gulp.task('copy-watch', copyTask);


var bundleApplication = function () {
    return Q.all([
            bundle(srcDir.path('background.js'), destDir.path('background.js')),
            bundle(srcDir.path('app.js'), destDir.path('app.js')),
        ]);
};

gulp.task('bundle', ['clean'], bundleApplication);
gulp.task('bundle-watch', bundleApplication);


var lessTask = function () {
    return gulp.src('app/stylesheets/main.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest(destDir.path('stylesheets')));
};
gulp.task('less', ['clean'], lessTask);
gulp.task('less-watch', lessTask);


gulp.task('environment', ['clean'], function () {
    var configFile = 'config/config.json';
    projectDir.copy(configFile, destDir.path('env.json'));
});


gulp.task('package-json', ['clean'], function () {
    var manifest = srcDir.read('package.json', 'json');
    destDir.write('package.json', manifest);
});


gulp.task('watch', function () {
    watch('app/**/*.js', batch(function (events, done) {
        gulp.start('bundle-watch', done);
    }));
    watch(paths.copyFromAppDir, { cwd: 'app' }, batch(function (events, done) {
        gulp.start('copy-watch', done);
    }));
    watch('app/**/*.less', batch(function (events, done) {
        gulp.start('less-watch', done);
    }));
});


gulp.task('build', ['bundle', 'less', 'copy', 'environment', 'package-json']);
