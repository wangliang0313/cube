var gulp = require('gulp');

//压缩js代码
var uglify = require('gulp-uglify');

//服务器
var connect = require('gulp-connect');



gulp.task('server', function () {
    connect.server();
});
 
gulp.task('default', ['server']);


// var port = 80;
// // var port = 80;

// var build_path = 'build/';

// var pathnamePrefix = '/cude/';
// var back_pathnamePrefix = '/';
// var src_base = 'src/';
// var front_base = 'server_front';
// var front_hostname = '127.0.0.1';


// //服务器相关=======================
// function steelServer(options) {
//     $.steelServer({
//         port: port,
//         pathnamePrefix: pathnamePrefix,
//         back_pathnamePrefix: back_pathnamePrefix,
//         front_base: front_base,
//         front_hostname: front_hostname, //前端的HOST
//         gzip: !options.debug,
//         access_control_allow: true,
//         pm2: options.pm2,
//         tasks: options.tasks
//     });
// }
// //=================================