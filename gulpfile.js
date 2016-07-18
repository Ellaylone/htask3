'use strict';

const gulp = require('gulp');
const watch = require('gulp-watch');
const postcss = require('gulp-postcss');
const imageOp = require('gulp-image-optimization');
const pug = require('gulp-pug');
const gutil = require('gulp-util');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

const browserSync = require('browser-sync');
const reload = browserSync.reload;

const cssNext = require('postcss-cssnext');
const cssNano = require('cssnano');
const size = require('postcss-size');
const cssMqpacker = require('css-mqpacker');
const browserReporter = require('postcss-browser-reporter');
const stylelint = require('stylelint');
const postcssImport = require('postcss-import');

let path = {
    src: {
        html: 'src/pug/*.pug',
        js: 'src/js/*.js',
        img: 'src/img/*.*',
        css: 'src/pcss/*.*',
        video: 'src/video/*.*',
        audio: 'src/audio/*.*',
        sub: 'src/sub/*.*'
    },
    build: {
        html: 'build/',
        js: 'build/js/',
        img: 'build/img',
        css: 'build/css/',
        video: 'build/video/',
        audio: 'build/audio/',
        sub: 'build/sub/'
    }
};

let config = {
    server: {
        baseDir: './build'
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: 'htask3'
};

//NOTE build tasks
gulp.task('html:build', ['html:clean'], () => {
    return gulp.src(path.src.html)
        .pipe(pug({
            pretty: false
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', ['js:clean'], () => {
    return gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .on('error', gutil.log)
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('img:build', ['img:clean'], () => {
    return gulp.src(path.src.img)
        .pipe(imageOp({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('css:build', ['css:clean'], () => {
    const processors = [
        stylelint('./.stylelintrc'),
        postcssImport,
        size,
        cssNext({
            warnForDuplicates: false
        }),
        cssMqpacker,
        cssNano,
        browserReporter
    ];
    return gulp.src(path.src.css)
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(sourcemaps.write())
        .on('error', gutil.log)
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('video:build', ['video:clean'], () => {
    return gulp.src(path.src.video)
        .pipe(gulp.dest(path.build.video))
        .pipe(reload({stream: true}));
});

gulp.task('audio:build', ['audio:clean'], () => {
    return gulp.src(path.src.audio)
        .pipe(gulp.dest(path.build.audio))
        .pipe(reload({stream: true}));
});

gulp.task('sub:build', ['audio:clean'], () => {
    return gulp.src(path.src.sub)
        .pipe(gulp.dest(path.build.sub))
        .pipe(reload({stream: true}));
});

gulp.task('html:clean', () => {
    return gulp.src(path.build.html + '*.html', {read: false})
        .pipe(clean());
});

gulp.task('js:clean', () => {
    return gulp.src(path.build.js, {read: false})
        .pipe(clean());
});

gulp.task('img:clean', () => {
    return gulp.src(path.build.img, {read: false})
        .pipe(clean());
});

gulp.task('css:clean', () => {
    return gulp.src(path.build.css, {read: false})
        .pipe(clean());
});

gulp.task('video:clean', () => {
    return gulp.src(path.build.video, {read: false})
        .pipe(clean());
});

gulp.task('audio:clean', () => {
    return gulp.src(path.build.audio, {read: false})
        .pipe(clean());
});

gulp.task('sub:clean', () => {
    return gulp.src(path.build.sub, {read: false})
        .pipe(clean());
});

gulp.task('build', [
    'html:build',
    'js:build',
    'img:build',
    'css:build',
    'video:build',
    'audio:build',
    'sub:build'
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
    watch([path.src.video], (event, cb) => {
        gulp.start('video:build');
    });
    watch([path.src.audio], (event, cb) => {
        gulp.start('audio:build');
    });
});

gulp.task('default', [
    'build',
    'webserver',
    'watch'
]);
