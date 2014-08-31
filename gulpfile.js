var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass')
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var minifyHTML = require('gulp-minify-html');
var clean = require('gulp-clean');
var shell = require('gulp-shell');
var runSequence = require('run-sequence');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var jpegtran = require('imagemin-jpegtran');

gulp.task('clean', function () {
  return gulp.src('demo/build', {read: false})
  .pipe(clean());
});

gulp.task('compress-scripts', function() {
  gulp.src('demo/source/scripts/*.js')
  .pipe(sourcemaps.init())
  .pipe(concat('scripts.js'))
  .pipe(uglify({
    mangle: true,
    preserveComments: false
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('demo/build/scripts'))
});

gulp.task('compress-css', function () {
  gulp.src('demo/source/styles/*.scss')
  .pipe(sass({
    sourceComments: 'map'
  }))
  .pipe(gulp.dest('demo/build/styles/'));
});

gulp.task('compress-html', function() {
  var opts = {
    comments: false,
    spare: false
  };

  gulp.src('demo/source/*.html')
  .pipe(minifyHTML(opts))
  .pipe(gulp.dest('demo/build/'))
});

gulp.task('build', function() {
  runSequence('clean', 'compress-scripts', 'compress-css', 'compress-html', 'compress-images');
})

gulp.task('watch', function() {
  gulp.watch('demo/source/**/*', ['build']);
});


gulp.task('compress-images', function () {
    return gulp.src('demo/source/images/*')
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 7,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush(),jpegtran({ progressive: true })]
        }))
        .pipe(gulp.dest('demo/build/images/'));
});

gulp.task('default', ['watch']);
