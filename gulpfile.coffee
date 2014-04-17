gulp = require 'gulp'
gutil = require 'gulp-util'
coffee = require 'gulp-coffee'
compile = require 'gulp-compile-js'
modules = require 'gulp-module-system'
concat = require 'gulp-concat'

paths = {
  src: './src/**/*.coffee'
}

gulp.task 'build', ->
  gulp.src(paths.src)
    .pipe(compile({coffee: {bare: true}}))
    .pipe(modules({type: 'brunch', file_name: 'hexxi.js'}))
    .pipe(gulp.dest('./build'))

gulp.task 'watch_src', ->
  gulp.watch(paths.src, ['build'])

gulp.task('default', ['build', 'watch_src'])
