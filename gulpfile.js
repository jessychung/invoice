var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('styles', function () {
    console.log('gulp is running...');
    return gulp.src('styles/**/*.scss')
        .pipe(sass({
            includePaths : ['/styles'],
            onError: function (err) {
                return notify().write(err);
            }
        }))
        .pipe(gulp.dest('styles'));
});

gulp.task('default', function () {
    gulp.watch('styles/**/*.scss', ['styles']);
});