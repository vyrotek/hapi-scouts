'use strict';

const gulp = require('gulp');
const rimraf = require('gulp-rimraf');
const shell = require('gulp-shell');

gulp.task('clean', function () {
    return gulp.src('out', { read: false }).pipe(rimraf());
});

gulp.task('compile', shell.task([
    'npm run tsc',
]))

gulp.task('watch', shell.task([
    'npm run tsc-watch',
]))

gulp.task('configs', (cb) => {
    return gulp.src("src/configs/*.json").pipe(gulp.dest('./out/configs'));
});

gulp.task('build', ['compile', 'configs'], () => {
    console.log('Building the project ...');
});

gulp.task('default', ['build']);