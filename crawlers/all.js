var async = require('async');
var config = require('./config');
var read = require('./read');
var save = require('./save');
var debug = require('debug')('blog:update:all');

var shopName = '';
var topList = [];

async.series([
  function (done) {
    read.shopName(config.topSelling.url, function (err, name) {
      shopName = name;
      done(err);
    });
  },

  // 获取文章分类列表
  function (done) {
    read.topList(config.topSelling.url, function (err, list) {
      topList = list;
      done(err);
    });
  },

  // 保存文章分类
  function (done) {
    save.topList(shopName, topList, done)
  }

], function (err) {
  if (err) console.error(err.stack);

  console.log('完成');
  process.exit(0);
});