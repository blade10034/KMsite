var gulp = require('gulp');
var concat = require('gulp-concat');
var gulpDebug = require('gulp-debug');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('default', function () {
	console.log("gulp?");
  return gulp.src(['./public/ng/app.js', './public/ng/**/*.js'])
    .pipe(gulpDebug({title: 'Angular:'}))
    .pipe(concat('angularApp.js'))
    .pipe(ngAnnotate())
    //.pipe(uglify())
    .pipe(gulp.dest('./public/javascripts/'))
});

gulp.task('watch', ['default'], function () {
  gulp.watch('./public/ng/**/*.js', ['default'])
});

gulp.start('watch');
