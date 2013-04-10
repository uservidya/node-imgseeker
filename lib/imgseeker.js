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
  timeout: 60000,
  defaultImg: true
};

var _ensure = function ($, selector, index, property) {
  var $selected = $(selector);
  if(!$selected[index]) { return null; }
  return $selected[index][property];
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
      timeout: _this.config.timeout,
      callback: function(error, result, $) {
        _this.response(error, result, $, _.extend({_url: this.uri}, opts, _this.config), cb);
      }
    }]);
  },

  response: function(err, result, $, config, cb) {
    var img;
    if (!err) { img = this.grab(config, $); }
    if (!img && !err) { err = 'no image found for url ' + config._url; }
    if (typeof cb === 'function') {
      cb(err, img);
    }
  },

  grab: function (config, $) {
    var img, host = url.parse(config._url).hostname;
    if (config[host]) {
      if (typeof config[host] === 'string') { config[host] = [config[host]]; }
      img = (function () {
        var i, _img, hans;
        for (i = 0; i < config[host].length; i++) {
          _img = _ensure($, config[host][i], 0, 'src');
          if (_img) {
            return _img;
          }
        }
      })() || $('meta[property="og:images"]').attr('content');
    } else {
      img = $('meta[property="og:image"]').attr('content') || (config.defaultImg ? _ensure($, 'img', 0, 'src') : null);
    }
    return img ? url.resolve(config._url, img) : img;
  }

};

exports = module.exports = new ImgSeeker();