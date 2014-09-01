# <img src="http://cdn.tjw.io/images/sails-logo.png" height='43px' />-inject-models

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]

## Install
```sh
$ npm install sails-inject-models --save
```

## Usage
e.g. with [sails-permissions](https://www.npmjs.org/package/sails-permissions):

```js
// api/hooks/permissions.js
module.exports = require('sails-permissions');
```
The additional models `User`, `Role`, `Permission`, and `Model` will be initialized and available in the global namespace.

## License
MIT

## Attribution
Much of this implementation is adapted from:
- [this Stackoverflow post](http://stackoverflow.com/questions/21085624/how-to-create-a-normal-sails-model-without-being-in-the-models-folder)
- sails [lib/hooks/orm/index.js](https://github.com/balderdashy/sails/blob/master/lib/hooks/orm/index.js)

[sails-logo]: http://cdn.tjw.io/images/sails-logo.png
[sails-url]: https://sailsjs.org
[npm-image]: https://img.shields.io/npm/v/sails-inject-models.svg?style=flat
[npm-url]: https://npmjs.org/package/sails-inject-models
[travis-image]: https://img.shields.io/travis/tjwebb/sails-inject-models.svg?style=flat
[travis-url]: https://travis-ci.org/tjwebb/sails-inject-models
[daviddm-image]: http://img.shields.io/david/tjwebb/sails-inject-models.svg?style=flat
[daviddm-url]: https://david-dm.org/tjwebb/sails-inject-models
