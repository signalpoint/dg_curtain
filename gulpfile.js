var gulp = require('gulp'),
    watch = require('gulp-watch'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css');

var dgCurtainModuleSrc = [
  './src/_dg_curtain.js',
  './src/widgets/widget.*.js'
];

var dgCurtainCssSrc = ['./css/*.css'];

// Task to build the dg_curtain.min.js file.
gulp.task('minifyJS', function(){
  return gulp.src(dgCurtainModuleSrc)
      .pipe(gp_concat('concat.js'))
      .pipe(gulp.dest(''))
      .pipe(gp_rename('dg_curtain.min.js'))
      .pipe(gp_uglify())
      .pipe(gulp.dest(''));
});

// Task to build the dg_curtain.min.css file.
gulp.task('minifyCSS', function(){
  gulp.src(dgCurtainCssSrc)
      .pipe(gp_concat('concat.css'))
      .pipe(gulp.dest(''))
      .pipe(gp_rename('dg_curtain.min.css'))
      .pipe(minifyCSS())
      .pipe(gulp.dest(''));
});

gulp.task('default', function () {
  watch(dgCurtainModuleSrc, function(event) { gulp.start('minifyJS') });
  watch(dgCurtainCssSrc, function(event) { gulp.start('minifyCSS') });
  gulp.start(['minifyJS', 'minifyCSS']);
});
