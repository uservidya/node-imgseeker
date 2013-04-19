# imgseeker

[![Build Status](https://travis-ci.org/valiton/node-imgseeker.png?branch=master)](https://travis-ci.org/valiton/node-imgseeker)

Finding an image for a given URL. imgseeker uses OpenGraph `og:image` as a fallback if no config for the hostname is given and og:image exists.


## Getting Started
Install the module with: `npm install imgseeker`

```
var imgseeker = require('imgseeker');
imgseeker.init({});
imgseeker.seek('http://www.some-domain.com/some/path/index.html', function (err, imgUrl)) {
  // do something with imgUrl
});
```

## Documentation

### Options reference

- defaultImg: Boolean, indicates if at least the first img on the page should be returned (Default true)
- request: Object, all properties from [mikeal's request module](https://npmjs.org/package/request) can be used

### setting the global config


__IMPORTANT__: You need to call the init-method () before seeking in an URL. The init-method itself is chainable so you can call `imgseeker.init().seek(…`

if no config for a hostname is given, imgseeker tries to fetch OpenGraphs [`og:image`](http://ogp.me/), if there is no og:image it tries to fetch the first image of the page (if defaultImg is set to true)

config-values for 1 host can be provided as String or Array. If they are given as an Array, imgseeker loops over the array, and returns the first element with a working selector.

```
var imgseeker = require('imgseeker');
imgseeker.init(); // setting the global config
```

### seek for a img-url from a page

```
imgseeker.seek('some-url', function (err, imgUrl) {
  // do something with imgUrl
});
```

### seek for a img-url from a page and define a custom selector (override global config)

```
imgseeker.seek('some-url', {'some-url': ['.img-class']}function (err, imgUrl) {
  // do something with imgUrl
});
```

## Examples

```
// init and seek with global config (including some request-config)
var imgseeker = require('imgseeker');
imgseeker.init({
  request: {
    maxConnections: 50,
    followAllRedirects: true,
    encoding: 'utf-8'
  },
  'www.some-domain.com': ['.some-class > img', '.another-class > img'],
  'another-domain.com': ['img']
}).seek('http://www.some-domain.com/some/path/index.html', function (err, imgUrl)) {
  // do something with imgUrl
});

// seek with special config (which overrides global config)
var specialConfig = {
  'www.some-domain.com': ['.some-special-selector']
};
imgseeker.seek('http://www.some-domain.com/some/path/index.html', specialConfig, function (err, imgUrl)) {
  // do something with imgUrl
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

- 0.3.1
  - bugfix og:images -> og:image

- 0.3.0
  - make all request properties available

- 0.2.1
  - make request timeout settable

- 0.2.0
  - domain-configs as arrays (existing string configs will still work)

- 0.1.1
  - resolve img-urls to absolute urls

- 0.1.0
  - Initial Commit

## Contributors

- Bastian "hereandnow" Behrens

## License
Copyright (c) 2013 Valiton GmbH
Licensed under the MIT license.
