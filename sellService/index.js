process.env.PORT = '8090'

let workers; // 块级作用域
if(process.env.EGG_SERVER_ENV == 'prod') {

  workers = Number(process.argv[2] || require('os').cpus().length);

} else {

  workers = 1

}

require('egg').startCluster({
  workers,
  host:'localhost',
  baseDir: __dirname,
  port: process.env.PORT
});
