var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var sequence = require('run-sequence');

// Corrige o erro no build do travis
// http://stackoverflow.com/questions/32490328/gulp-autoprefixer-throwing-referenceerror-promise-is-not-defined
//require('es6-promise').polyfill();

var paths = {
  assets: [
    'client/img/**/*.*',
    'client/lib/**/*.*',
    'client/plugin/**/*.*',
    'client/fonts/**/*.*',
    'client/js/manifest.json'
  ],
  scss: [
    'node_modules/font-awesome/scss/**/*.*'
  ],
  fonts: [
    'node_modules/font-awesome/fonts/**/*.*'
  ]
}

gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: "./build",
       index: 'index.html'
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});


gulp.task('styles', function(){
  gulp.src(['client/scss/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('build/css/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
  return gulp.src('client/js/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(gulp.dest('build/js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('build/js/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('html', function() {
  return gulp.src('*.html')
    .pipe(gulp.dest('build/'))
});

gulp.task('fa-scss', function() {
  return gulp.src(paths.scss)
    .pipe(gulp.dest('client/scss/font-awesome'))
});

gulp.task('fa-fonts', function() {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('client/fonts'))
});

gulp.task('copy', function () {
  return gulp.src(paths.assets, {
    base: 'client/'
  })
    .pipe(gulp.dest('build/'));
});

gulp.task('build', function(cb) {
  sequence('fa-fonts', 'fa-scss', ['scripts', 'styles', 'html', 'copy'], cb);
})

gulp.task('default', ['build', 'browser-sync'], function(){
  gulp.watch("client/scss/**/*.scss", ['styles']);
  gulp.watch("client/js/**/*.js", ['scripts']);
  gulp.watch("client/img/**/*.*", ['copy']);
  gulp.watch("*.html", function(cb) {
    sequence('html', 'bs-reload')
  });
});

gulp.task('travis', ['build']);
