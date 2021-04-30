const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require("gulp-rename");
const del = require('del');
const pug = require('gulp-pug');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

const html = () => {
    return gulp.src('app/pug/*.pug')
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest('build'))
}

const styles = () => {
    return gulp.src('app/styles/**/*.scss')
        .pipe(sass().on('err',sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('build/css'))
}

const scripts = () => {
    return gulp.src('app/js/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('build/js'))
}

const imagesGeneral = () => {
    return gulp.src('app/images/general/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/images/general'))
}

const imagesMobile = () => {
    return gulp.src('app/images/mobile/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/images/mobile'))
}

const watch = () => {
    gulp.watch('app/pug/**/*.pug', html);
    gulp.watch('app/styles/**/*.scss', styles);
    gulp.watch('app/js/*.js', scripts);
    gulp.watch('app/images/mobile/*.*', imagesMobile);
    gulp.watch('app/images/general/*.*', imagesGeneral);
}

const server = () => {
    browserSync.init({
        server: {
            baseDir: "./build"
        },
        notify: false
    });
    browserSync.watch('build', browserSync.reload);
}

const deleteBuild = (cb) => {
    return del('build/**/*.*').then(() => { cb() });
}

exports.default = gulp.series(
    deleteBuild, 
    gulp.parallel(html, styles, scripts, imagesMobile, imagesGeneral),
    gulp.parallel(watch, server),
    );