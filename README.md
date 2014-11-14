#### Note: This project is deprecated in favor of https://github.com/tjwebb/sails-generate-entities to build addon modules. See https://github.com/tjwebb/sails-permissions/blob/master/index.js for an example.

# <img src="http://cdn.tjw.io/images/sails-logo.png" height='42px' />-inject

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]

Inject additional models, controllers, etc. into a sails.js from a hook. Extends a sails.js app by injecting another sails.js app into it

## Install
```sh
$ npm install sails-inject --save
```

## Usage
e.g. with [sails-permissions](https://www.npmjs.org/package/sails-permissions):

```js
// api/hooks/myHook.js
var injector = require('sails-inject');
injector.injectApp({
  sails: sails,
  module: module.id
}, next);
```
The additional models be initialized and available in the global namespace per usual.

## API

#### `.injectApp(options, next)`
| @param | description |
|:---|:---|:---|
| `options.sails` | global sails object |
| `options.module` | reference to the main `module.id` of the sails app to inject
| `options.connection` | optional connection to use for the injected models

#### `.injectModels(options, next)`
| @param | description |
|:---|:---|:---|
| `options.sails` | global sails object |
| `options.models` | list of models in the form `{ definition: Object, globalId: String }`
| `options.connection` | optional connection to use for the injected models

## License
MIT

## Attribution
Much of this implementation is adapted from:
- [this Stackoverflow post](http://stackoverflow.com/questions/21085624/how-to-create-a-normal-sails-model-without-being-in-the-models-folder)
- sails [lib/hooks/orm/index.js](https://github.com/balderdashy/sails/blob/master/lib/hooks/orm/index.js)

[sails-logo]: http://cdn.tjw.io/images/sails-logo.png
[sails-url]: https://sailsjs.org
[npm-image]: https://img.shields.io/npm/v/sails-inject.svg?style=flat
[npm-url]: https://npmjs.org/package/sails-inject
[travis-image]: https://img.shields.io/travis/tjwebb/sails-inject.svg?style=flat
[travis-url]: https://travis-ci.org/tjwebb/sails-inject
[daviddm-image]: http://img.shields.io/david/tjwebb/sails-inject.svg?style=flat
[daviddm-url]: https://david-dm.org/tjwebb/sails-inject
