'use strict';

var imgseeker = require('../lib/imgseeker.js');

var zeroMock = {src: "http://myurl.com/src-image.png"};
var attrMock = function () {
  return "http://myurl.com/attr-image.png";
};

exports['imgseeker'] = {

  'setUp': function (done) {
    imgseeker.init();
    this.queueBackup = imgseeker.crawler.queue;
    imgseeker.crawler.queue = function (arr) {
      var _$ = function () {
        return {
          0: zeroMock,
          attr: attrMock,
          css: function () { return ''; }
        };
      };
      arr[0].callback(null, "", _$);
    };
    done();
  },

  'tearDown': function (done) {
    imgseeker.crawler.queue = this.queueBackup;
    done();
  },

  'seek with config but matcher fails': function(test) {
    test.expect(2);
    zeroMock.src = undefined;
    imgseeker.config = {'myurl.com': '.some-class img', defaultImg: true};
    imgseeker.seek('http://myurl.com/some/path/', function (err, imgUrl) {
      test.equal(err, null,  "no error");
      test.equal(imgUrl, "http://myurl.com/attr-image.png", "attr-image is returned because config for myurl.com is given but matcher fails");
      test.done();
    });
  },

  'seek with config and working matcher': function(test) {
    test.expect(2);
    zeroMock = {src: "http://myurl.com/src-image.png"};
    imgseeker.config = {'myurl.com': '.some-class img', defaultImg: true};
    imgseeker.seek('http://myurl.com/some/path/', function (err, imgUrl) {
      test.equal(err, null,  "no error");
      test.equal(imgUrl, "http://myurl.com/src-image.png", "src-image is returned because config for myurl.com is given and matcher worked");
      test.done();
    });
  },

  'seek without config and existing og:image': function(test) {
    test.expect(2);
    zeroMock = {src: "http://myurl.com/src-image.png"};
    imgseeker.config = {defaultImg: true};
    imgseeker.seek('http://myurl.com/some/path/', function (err, imgUrl) {
      test.equal(err, null,  "no error");
      test.equal(imgUrl, "http://myurl.com/attr-image.png", "attr-image is returned because no config is given and og:image is present");
      test.done();
    });
  },

  'seek without config and nonexisting og:image': function(test) {
    test.expect(2);
    zeroMock = {src: "http://myurl.com/src-image.png"};
    attrMock = function () {
      return;
    };
    imgseeker.config = {defaultImg: true};
    imgseeker.seek('http://myurl.com/some/path/', function (err, imgUrl) {
      test.equal(err, null,  "no error");
      test.equal(imgUrl, "http://myurl.com/src-image.png", "src-image is returned because no config is given and og:image is missing");
      test.done();
    });
  },

  'seek without config and nonexisting og:image and defaultImg set to false should return and error': function(test) {
    test.expect(2);
    zeroMock = {src: "http://myurl.com/src-image.png"};
    attrMock = function () {
      return;
    };
    imgseeker.config = {defaultImg: false};
    imgseeker.seek('http://myurl.com/some/path/', function (err, imgUrl) {
      test.equal(err, "no image found for url http://myurl.com/some/path/",  "no error");
      test.equal(imgUrl, null, "null is returned because no config is given and og:image is missing and defaultImg is set to false");
      test.done();
    });
  },

  'seek with relative paths should return full url': function(test) {
    test.expect(2);
    zeroMock = {src: "src-image.png"};
    attrMock = function () {
      return;
    };
    imgseeker.config = {'myurl.com': '.some-class img', defaultImg: true};
    imgseeker.seek('http://myurl.com/some/path/', function (err, imgUrl) {
      test.equal(err, null,  "no error");
      test.equal(imgUrl, "http://myurl.com/some/path/src-image.png", "full uri is returned because image-uri is relative");
      test.done();
    });
  },

  'seek with another relative path should return full url': function(test) {
    test.expect(2);
    zeroMock = {src: "../src-image.png"};
    attrMock = function () {
      return;
    };
    imgseeker.config = {'myurl.com': '.some-class img', defaultImg: true};
    imgseeker.seek('http://myurl.com/some/path/', function (err, imgUrl) {
      test.equal(err, null,  "no error");
      test.equal(imgUrl, "http://myurl.com/some/src-image.png", "full uri is returned because image-uri is relative");
      test.done();
    });
  },

  'seek with another relative path and no config should return full url': function(test) {
    test.expect(2);
    zeroMock = {src: "../src-image.png"};
    attrMock = function () {
      return "../attr-image.png";
    };
    imgseeker.config = {defaultImg: true};
    imgseeker.seek('http://myurl.com/some/path/', function (err, imgUrl) {
      test.equal(err, null,  "no error");
      test.equal(imgUrl, "http://myurl.com/some/attr-image.png", "full uri is returned because image-uri is relative");
      test.done();
    });
  }

};
