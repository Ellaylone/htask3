'use strict';

const gulp = require('gulp');
const watch = require('gulp-watch');
const postcss = require('gulp-postcss');
const imageOp = require('gulp-image-optimization');
const ejs = require('gulp-ejs');
const pug = require('gulp-pug');
const gutil = require('gulp-util');

const browserSync = require('browser-sync');
const reload = browserSync.reload;

const cssNext = require('postcss-cssnext');
const cssNano = require('cssnano');
const size = require('postcss-size');
const cssMqpacker = require('css-mqpacker');

var path = {
    src: {
        html: 'src/pug/*.pug',
        js: 'src/ejs/*.ejs',
        img: 'src/img/*.*',
        css: 'src/pcss/*.*'
    },
    build: {
        html: 'build/',
        js: 'build/js/',
        img: 'build/img',
        css: 'build/css/'
    }
};

var config = {
    server: {
        baseDir: './build'
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: 'htask3'
};

//NOTE build tasks
gulp.task('html:build', () => {
    gulp.src(path.src.html)
        .pipe(pug({
            pretty: false
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', () => {
    gulp.src(path.src.js)
        .pipe(ejs())
        .on('error', gutil.log)
        .pipe(gulp.dest(path.build.js));
});

gulp.task('img:build', () => {
    gulp.src(path.src.img)
        .pipe(imageOp({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}))
});

gulp.task('css:build', () => {
    const processors = [
        size,
        cssNext,
        cssMqpacker,
        cssNano({
            autoprefixer: ['ie >= 10', '> 2% in RU']
        }),
    ];
    return gulp.src(path.src.css)
        .pipe(postcss(processors))
        .on('error', gutil.log)
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('build', [
    'html:build',
    'js:build',
    'img:build',
    'css:build'
]);

gulp.task('webserver', () => {
    browserSync(config);
});

//NOTE watch tasks
gulp.task('watch', () => {
    watch([path.src.html], (event, cb) => {
        gulp.start('html:build');
    });
    watch([path.src.js], (event, cb) => {
        gulp.start('js:build');
    });
    watch([path.src.img], (event, cb) => {
        gulp.start('img:build');
    });
    watch([path.src.css], (event, cb) => {
        gulp.start('css:build');
    });
});

gulp.task('default', [
    'build',
    'webserver',
    'watch'
]);
