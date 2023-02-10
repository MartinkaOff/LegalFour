"use strict";

const gulp = require("gulp");
const webpack = require("webpack-stream");
const browsersync = require("browser-sync");
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const sass = require('gulp-sass')(require('sass'));

const dist = "./dist/";
// const dist = "/Applications/MAMP/htdocs/test"; // Тут адрес к вашему серверу

gulp.task("copy-html", () => {
    return gulp.src("./src/index.html")
                .pipe(gulp.dest(dist))
                .pipe(browsersync.stream());
});

gulp.task("build-js", () => {
    return gulp.src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'development',
                    output: {
                        filename: 'script.js'
                    },
                    watch: false,
                    devtool: "source-map",
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist))
                .on("end", browsersync.reload);
});

// gulp.task("copy-sass", () => {
//     return gulp.src("./src/sass/**/*.*")
//                 .pipe(gulp.dest(dist + "/sass"))
//                 .on("end", browsersync.reload);
// });

gulp.task('styles', function() {
  return gulp.src("src/sass/**/*.+(scss|sass)")
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(rename({suffix: '.min', prefix: ''}))
      .pipe(autoprefixer())
      // .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest("dist/css"))
      .pipe(browsersync.stream());
});


gulp.task('icons', function () {
  return gulp.src("src/icons/**/*")
      .pipe(gulp.dest("dist/icons"))
      .pipe(browsersync.stream());
});

gulp.task('images', function () {
  return gulp.src("src/img/**/*")
      .pipe(gulp.dest("dist/img"))
      .pipe(browsersync.stream());
});

gulp.task('fonts', function () {
  return gulp.src("src/fonts/**/*")
      .pipe(gulp.dest("dist/fonts"))
      .pipe(browsersync.stream());
});

gulp.task("watch", () => {
    browsersync.init({
		server: "./dist/",
		port: 4000,
		notify: true
    });
    
    gulp.watch("./src/index.html", gulp.parallel("copy-html"));
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    gulp.watch("./src/js/**/*.js", gulp.parallel("build-js"));
    gulp.watch("src/fonts/**/*").on('all', gulp.parallel('fonts'));
    gulp.watch("src/icons/**/*").on('all', gulp.parallel('icons'));
    gulp.watch("src/img/**/*").on('all', gulp.parallel('images'));
});

gulp.task("build", gulp.parallel("copy-html", "styles", "build-js", "images", "icons", "fonts" ));

gulp.task("build-prod-js", () => {
    return gulp.src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'production',
                    output: {
                        filename: 'script.js'
                    },
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist));
});

gulp.task("default", gulp.parallel("watch", "build", "styles", "fonts"));