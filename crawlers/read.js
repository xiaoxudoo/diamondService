var originRequest = require('request');
var cheerio = require('cheerio');
var debug = require('debug')('blog:update:read');

/**
 * 请求指定URL
 *
 * @param {String} url
 * @param {Function} callback
 */
function request(url, callback) {
  originRequest(url, callback);
}

/**
 * 获取店铺名称
 *
 * @param {String} url
 * @param {Function} callback
 */
exports.shopName = function (url, callback) {
  debug('读取店铺名称：%s', url);

  request(url, function (err, res) {
    if (err) return callback(err);

    // 根据网页内容创建DOM操作对象
    var $ = cheerio.load(res.body.toString());
    // 读取博文类别列表
    var shopname = $('.store-header .shop-name').text().trim().slice(6);
    shopname = shopname.replace(/\s/g, "_");
    // 返回结果
    callback(null, shopname);
  });
};

/**
 * 获取文章分类列表
 *
 * @param {String} url
 * @param {Function} callback
 */
exports.topList = function (url, callback) {
  debug('读取最热商品列表：%s', url);

  request(url, function (err, res) {
    if (err) return callback(err);

    // 根据网页内容创建DOM操作对象
    var $ = cheerio.load(res.body.toString());
    // 读取博文类别列表
    var topList = [];
    $('ul.items-list > li.item').each(function (index) {
      if(index > 23) return;
      var $me = $(this);
      var imgUrl = $me.find('.img > .pic > .pic-rind > img').attr('image-src');
      console.log(imgUrl)
      var orderNum = $me.find('.detail > .recent-order').text().trim().slice(7, -1);
      imgUrl = 'http:' + imgUrl.slice(0, -12); 
      
      var filename = `${index}***${orderNum}***` + imgUrl.slice(57)
      var item = {
        name: filename,
        url:  imgUrl,
        orders: orderNum
      };
      topList.push(item);
    });

    console.log(topList.length)

    // 返回结果
    callback(null, topList);
  });
};

