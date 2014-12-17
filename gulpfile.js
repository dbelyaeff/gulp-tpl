var gulp = require('gulp'),
    jade = require('gulp-jade'),
    stylus = require('gulp-stylus'),
    coffee = require('gulp-coffee'),
    livereload = require('gulp-livereload'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    connect = require('connect'),
    serveStatic = require('serve-static'),
    nib = require('nib');


/*
 * Создаём задачи 
 *
 * stylus – для CSS-препроцессора Stylus
 * jade – для HTML-препроцессора Jade
 * coffee – для JavaScript-препроцессора CoffeеScript
 * concat – для склейки всех CSS и JS в отдельные файлы
 */

gulp.task('stylus', function() {
    gulp.src('./styl/*.styl')
    	.pipe(stylus({use: nib(), compress: true}))
	    .on('error', console.log) // Выводим ошибки в консоль
	    .pipe(gulp.dest('./public/css/')) // Выводим сгенерированные CSS-файлы в ту же папку по тем же именем, но с другим расширением
	    .pipe(livereload()); // Перезапускаем сервер LiveReload
});

gulp.task('jade', function(){
	gulp.src('./*.jade')
		.pipe(jade({pretty: true}))
		.on('error', console.log) // Выводим ошибки в консоль
	  .pipe(gulp.dest('./public/')) // Выводим сгенерированные HTML-файлы в ту же папку по тем же именем, но с другим расширением
	  .pipe(livereload()); // Перезапускаем сервер LiveReload
});

gulp.task('coffee',function(){
	gulp.src('./coffee/*.coffee')
		.pipe(coffee({bare: true}))
		.on('error', console.log) // Выводим ошибки в консоль
	   .pipe(gulp.dest('./public/js')) // Выводим сгенерированные JavaScript-файлы в ту же папку по тем же именем, но с другим расширением
	   .pipe(livereload()); // Перезапускаем сервер LiveReload
});

gulp.task('concat', function(){
  gulp.task('coffee');
	gulp.src('./public/js/*.js')
		.pipe(concat('scripts.js'))
    .pipe(gulp.dest('./public/min/'))
		.pipe(livereload());
  gulp.task('styl');
	gulp.src('./public/css/*.css')
		.pipe(concat('styles.css'))
    .pipe(gulp.dest('./public/min/'))
		.pipe(livereload());
});

gulp.task('imagemin',function(){
	 gulp.src('./img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/img/'));
});

/*
 * Создадим веб-сервер, чтобы работать с проектом через браузер
 */
 gulp.task('server', function() {
    connect()
    	.use(require('connect-livereload')())
    	.use(serveStatic(__dirname + '/public'))
      .listen('3333');

    console.log('Сервер работает по адресу http://localhost:3333');
});

 /*
  * Создадим задачу, смотрящую за изменениями
  */
 gulp.task('watch', function(){
      livereload.listen();
  		gulp.watch('./styl/*.styl',['stylus']);
    	gulp.watch('./*.jade',['jade']);
  		gulp.watch('./coffee/*.coffee',['coffee']);
   		gulp.watch(['./public/js/*.js','./public/css/*.css'],['concat']);
    	gulp.watch('./img/**/*',['imagemin']);
  	  gulp.start('server');
  });

 gulp.task('default',['watch','stylus','jade','coffee','concat','imagemin']);
