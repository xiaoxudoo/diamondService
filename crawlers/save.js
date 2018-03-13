var mkdirp = require('mkdirp');
var async = require('async');
var debug = require('debug')('blog:update:save');
var fs = require('fs');
var http = require('http')

/**
 * 保存文章分类
 *
 * @param {Object} list
 * @param {Function} callback
 */
exports.topList = function (name, list, callback) {
  debug('保存文章分类列表到数据库中: %d', list.length);
  var dir = `./images/${name}`
  mkdirp(dir, function (err) {
    if (err) console.error(err)
    else {
      async.eachSeries(list, function (item, next) {

        download(item.url, dir, item.name, next)
    
      }, callback);
    }
  });
  
};

function download(url, dir, filename, next) {

  http.get(url, function (res) {
    var imgData = "";

    res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开


    res.on("data", function (chunk) {
      imgData += chunk;
    });

    res.on("end", function () {
      fs.writeFile(dir + "/" + filename, imgData, "binary", function (err) {
        if (err) {
          console.log("down fail");
        }
        console.log("down success");
        next();
      });
    });
  });
};

