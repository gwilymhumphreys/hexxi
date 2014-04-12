gulp = require 'gulp'
gutil = require 'gulp-util'
coffee = require 'gulp-coffee'
compile = require 'gulp-compile-js'
modules = require 'gulp-module-system'
concat = require 'gulp-concat'

SRC = './src/**/*.coffee'

gulp.task 'build', ->
  gulp.src(SRC)
    .pipe(compile({coffee: {bare: true}}))
    .pipe(modules({type: 'brunch', file_name: 'hexxi.js'}))
    .pipe(gulp.dest('./build'))

gulp.task 'watch_src', ->
  gulp.watch SRC, (event) ->
    if event.path
      gutil.log("Change detected in ", gutil.colors.magenta(event.path));
    else
      gutil.log("Change in source file detected. Coffeeing...");
    gulp.run('build')

gulp.task 'default', ->
  gulp.run('build')
  gulp.run('watch_src')


