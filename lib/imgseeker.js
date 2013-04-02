/*
 * imgseeker
 * https://github.com/valiton/node-imgseeker
 *
 * @author: Bastian Behrens
 * @copyright: 2013 Valiton GmbH
 * Licensed under the MIT license.
 */

'use strict';

/*
 * module dependencies
 */
var url     = require('url'),
    _       = require('lodash'),
    Crawler = require('crawler').Crawler;

/*
 * config defaults
 */
var defaults = {
  maxConnections: 10,
  defaultImg: true
};

function ImgSeeker () {}

ImgSeeker.prototype = {

  init: function (config) {
    var _this = this;
    this.config = _.extend({}, defaults, config);
    this.crawler = new Crawler({
      maxConnections: _this.config.maxConnections
    });
    return this;
  },

  seek: function (url, opts, cb) {
    var _this = this;
    if (typeof opts === 'function') {
      cb = opts;
      opts = {};
    }
    this.crawler.queue([{
      uri: url,
      callback: function(error, result, $) {
        _this.response(error, result, $, _.extend({_url: this.uri}, opts, _this.config), cb);
      }
    }]);
  },

  response: function(err, result, $, config, cb) {
    var img;
    if (!err) { img = this.grab(config, $); }
    if (typeof cb === 'function') {
      cb(err, img);
    }
  },

  grab: function (config, $) {
    var host = url.parse(config._url).hostname;
    if (config[host]) {
      return $(config[host])[0].src || $('meta[property="og:image"]').attr('content');
    }
    return $('meta[property="og:image"]').attr('content') || (config.defaultImg ? $('img')[0].src : null);
  }

};

exports = module.exports = new ImgSeeker();