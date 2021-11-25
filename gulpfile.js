const { src, dest, parallel, series, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

function browsersync() {
    browserSync.init({
        server: { baseDir: "dist/" },
        notify: false,
        online: true,
    });
}

function scripts() {
    return src(["dist/js/script.js"])
        .pipe(concat("dist.min.js"))
        .pipe(uglify())
        .pipe(dest("dist/js/"))
        .pipe(browserSync.stream());
}

function styles() {
    return src("dist/scss/**/*.scss")
        .pipe(sass())
        .pipe(concat("dist/min.css"))
        .pipe(autoprefixer({ overrideBrowserslist: ["last 3 versions"] }))
        .pipe(
            cleanCSS({
                level: { 1: { specialComments: 0 } },
                // format: "beautify",
            })
        )
        .pipe(dest("dist/css/"))
        .pipe(browserSync.stream());
}

function startWatch() {
    watch('dist/**/*.scss', styles);
    watch(["dist/**/*.js", "!dist/**/*.min.js"], scripts);
    watch('dist/**/*.html').on('change', browserSync.reload)
}

exports.browsersync = browsersync;
exports.styles = styles;
exports.scripts = scripts;
exports.default = parallel(scripts, styles, browsersync, startWatch)