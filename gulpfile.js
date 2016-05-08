/**
 * 初始化
 */


// 引入 gulp及组件
var gulp = require('gulp'), //基础库
    imagemin = require('gulp-imagemin'), //图片压缩
    // sass = require('gulp-ruby-sass'), //sass
    minifycss = require('gulp-minify-css'), //css压缩
    // jshint = require('gulp-jshint'),           //js检查
    uglify = require('gulp-uglify'), //js压缩
    rename = require('gulp-rename'), //重命名
    concat = require('gulp-concat'), //合并文件
    clean = require('gulp-clean'), //清空文件夹
    tinylr = require('tiny-lr'), //livereload
    watch = tinylr(),
    port = 35729,
    connect = require('gulp-connect'),
    // webserver = require('gulp-webserver'),
    del = require('del'), //文件、目录删除
    sequence = require('gulp-sequence'),
    livereload = require('gulp-livereload'), //livereload
    fs = require('fs'), //文件目录遍历
    path = require('path');

// 全局配置参数
var baseSrc = './src/',
    appDst = './build/',
    appExtand = '/static/v2/'


// HTML处理
gulp.task('html', function() {
    gulp.src(baseSrc + '/**/*.html')
        .pipe(livereload(watch))
        .pipe(gulp.dest(appDst))
});

// 图片处理
gulp.task('image', function() {
    // var imgSrc = './src/**/*',
    //     imgDst = './build/images';
    // gulp.src(imgSrc)
    //     .pipe(imagemin())
    //     .pipe(livereload(watch))
    //     .pipe(gulp.dest(imgDst));

    buildStatic({
        folders: ['core','images'],
        comppnents: ['view']
    }, 'image')
})

function buildStatic(roule, suffix) {
    switch (suffix) {
        case 'js':
            build()
            break
        case 'css':
            build()
            break
        case 'image':
            imageBuild()
            break

    }

    function imageBuild() {
        var _types = '/**/*.{gif,jpeg,jpg,png,svg,woff,ttf}'
        // gulp.src(buildTypePaths(baseSrc))
        //         .pipe(imagemin())
        //         .pipe(gulp.dest(appDst + appExtand))
        //         .pipe(livereload(watch));

        // 类库、通用组件及函数打包
        roule.folders.forEach(function(fordername) {
            var compSrc = path.join(baseSrc,fordername);
            // console.log(compSrc+_types);
            gulp.src(compSrc+_types)
                .pipe(imagemin())
                .pipe(gulp.dest(appDst + appExtand + fordername))
                .pipe(livereload(watch));
        });
        // 业务模块打包
        roule.comppnents.forEach(function(viewforder) {
            var compSrc = path.join(baseSrc, viewforder);
            fs.readdirSync(compSrc).forEach(function(fordername) {
                var filePath = path.join(compSrc, fordername);
                // console.log(filePath+_types);
                if (fs.statSync(filePath).isDirectory()) {
                    gulp.src(filePath+_types)
                        .pipe(imagemin())
                        .pipe(gulp.dest(appDst + appExtand + fordername))
                        .pipe(livereload(watch));
                }
            })
        });

    }

    function build() {
        // 类库、通用组件及函数打包
        roule.folders.forEach(function(fordername) {
            gulp.src(baseSrc + fordername + '/**/*.' + suffix)
                // .pipe(suffix == 'js' ? uglify() : minifycss())
                .pipe(concat((fordername == '.' ? 'combo' : fordername) + '.' + suffix))
                .pipe(gulp.dest(appDst+appExtand))
                .pipe(livereload(watch));
        })
        //业务模块打包
        roule.comppnents.forEach(function(fordername) {
            var compSrc = path.join(baseSrc, fordername);
            // console.log(compSrc);
            fs.readdirSync(compSrc).forEach(function(filename) {
                var filePath = path.join(compSrc, filename);
                // console.log(filename)
                if (fs.statSync(filePath).isDirectory()) {
                    gulp.src(filePath + '/**/*.' + suffix)
                        // .pipe(suffix == 'js' ? uglify() : minifycss())
                        .pipe(concat('index.' + suffix))
                        .pipe(gulp.dest(path.join(appDst+appExtand, filename)))
                        .pipe(livereload(watch));
                }
            })
        })
    }

}

// css打包处理
gulp.task('css', function() {
    buildStatic({
        folders: ['.','core'],
        comppnents: ['view']
    }, 'css')
});

// js打包处理
gulp.task('js', function() {

    buildStatic({
        folders: ['core', 'plugin'],
        comppnents: ['view']
    }, 'js')
});


// 清空图片、样式、js
gulp.task('clean', function(cb) {
    del([appDst + '/**/*']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
        cb();
    });
});

// 监听任务 运行语句 gulp watch
gulp.task('watch', function() {

    watch.listen(port, function(err) {
        if (err) {
            return console.log(err);
        }

        gulp.run('devbuild');

        // 监听html
        gulp.watch(baseSrc + '/*.html', function(event) {
            gulp.run('html');
        })

        // 监听css
        gulp.watch(baseSrc + '/**/*.css', function() {
            gulp.run('css');
        });

        // 监听images
        gulp.watch([baseSrc + '/**/*.png', baseSrc + '/**/*.gif', baseSrc + '/**/*.jpg', baseSrc + '/**/*.svg'], function() {
            gulp.run('image');
        });

        // 监听js
        // gulp.watch(['./src/js/main.js','./src/js/vendor/*.js'], function(){
        gulp.watch(baseSrc + '/**/*.js', function() {
            gulp.run('js');
        });

    });
});
//server
gulp.task('webserver', function() {
    connect.server({
        port: 8700,
        host:'127.0.0.1',
        livereload: false,
        root: [appDst]
    })
    // gulp.src('build')
    // .pipe(webserver({
    //   livereload: true,
    //   directoryListing: true,
    //   open: true
    // }));
});

//资源文件打包合并
gulp.task('build', sequence('clean',['js', 'css', 'image']));
gulp.task('devbuild', sequence('clean',['js', 'css', 'image', 'html']));

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', function() {
    gulp.start(['watch', 'webserver']);
});




