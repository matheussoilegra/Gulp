//gulp
var gulp = require('gulp');

//chamando o plugin
var imagemin = require('gulp-imagemin');

//css
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var autoPrefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var htmlmin = require('gulp-htmlmin');
var uglifyJS = require('gulp-uglify');

gulp.task('reduzir-imagem', () => {    //cria uma tarefa que quando chamada pelo terminal executa uma função
    var diretorioProjeto = 'src/img/**/*';  //informa o diretório src do projeto com todas suas subpastas e todos seus arquivos
    var diretorioBuild = 'build/img/*';

    gulp.src(diretorioProjeto)              //informa onde o gulp pegará a tarefa
        .pipe(imagemin())                   //informa a tarefa a ser executada
        .pipe(gulp.dest(diretorioBuild))    //informa o destino de envio da tarefa
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('styles', () => {
    var diretoriosCSS = [
        'src/css/creative.css',
        'src/vendor/fontawesome-free/css/fontawesome.css',
        'src/vendor/magnific-popup/magnific-popup.css'
    ]

    var diretorioBuild = 'build/css';
    gulp.src(diretoriosCSS)
        .pipe(concat('main.css'))
        .pipe(autoPrefixer('last 1 version'))
        .pipe(minifyCSS())
        .pipe(gulp.dest(diretorioBuild))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('font-awesome', function(done) {
    gulp.src('src/vendor/fontawesome-free/webfonts/*')
        .pipe(gulp.dest('build/fonts'));
    done();
});

gulp.task('browserSync', () => {
    browserSync.init({
        server: {
            baseDir: 'build'
        }
    })
});

gulp.task('js', () => {
    var filesJS = [
        'src/vendor/jquery/jquery.min.js',
        'src/vendor/bootstrap/js/bootstrap.bundle.min.js',
        'src/vendor/jquery-easing/jquery.easing.min.js',
        'vendor/magnific-popup/jquery.magnific-popup.min.js',
        'js/creative.min.js'
    ];

    gulp.src(filesJS)
        .pipe(concat('main.js'))
        .pipe(uglifyJS())
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
})

gulp.task('html', () => {
    gulp.src(['src/**/*.html', '!src/**/*.original.html'])    
    //!src/**/*.original.html o exclamação no começo exclui o arquivo
        .pipe(htmlmin({
            collapseWhitespace: true    //remove espaços em branco
        }))
        .pipe(gulp.dest('build/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('default', ['browserSync', 'reduzir-imagem', 'styles', 'font-awesome', 'js'], function () {
    var cssWatches = [
        'src/css/creative.css',
        'src/vendor/fontawesome-free/css/fontawesome.css',
        'src/vendor/magnific-popup/magnific-popup.css'
    ];
    var imgWatches = ['src/img/**/*']; 
    var htmlWatches = ['src/**/*.html', '!src/**/*.original.html'];
    var filesJS = [
        'src/vendor/jquery/jquery.min.js',
        'src/vendor/bootstrap/js/bootstrap.bundle.min.js',
        'src/vendor/jquery-easing/jquery.easing.min.js',
        'vendor/magnific-popup/jquery.magnific-popup.min.js',
        'js/creative.min.js'
    ];

    // gulp.watch(cssWatches, function() {
    //     gulp.run('styles'); //caso tenham mudanças em 'cssWatches', vai executar 'styles'

    gulp.watch(cssWatches, ['styles']);
    gulp.watch(imgWatches, ['reduzir-imagem']);
    gulp.watch(htmlWatches, ['html']);
    gulp.watch(filesJS, ['js']);

});

