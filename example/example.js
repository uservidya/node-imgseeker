var imgseeker = require('../lib/imgseeker');
imgseeker.init({
  request: {
    timeout: 10000,
    maxConnections: 50,
    followAllRedirects: true,
    encoding: 'utf-8'
  },
  'www.facebook.com': ['.phoneImage']
}).seek('http://www.facebook.com', function (err, imgUrl) {
  console.log(imgUrl);
});