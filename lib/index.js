'use strict';

var _ = require('lodash');
var async = require('async');
var path = require('path');
var fs = require('fs');
_.mixin(require('congruence'));

/**
 * Inject all models found in a separate sails app, according to
 * the sails.js directory structure convention. So, they must be in api/models.
 */
var injectAppGuard = _.similar({
  sails: _.isObject,
  module: _.isString
});
function injectApp (options, next) {
  var dir = path.resolve(path.dirname(require.resolve(options.module)), './api/models');
  var models = _.compact(_.map(fs.readdirSync(dir), function (filename) {
    try {
      return {
        definition: require(path.resolve(dir, filename)),
        globalId: path.basename(filename, '.js')
      };
    }
    catch (e) {
      options.sails.log.warn('Not injecting', filename, 'because it looks invalid');
    }
  }));
  return injectModels({
    sails: options.sails,
    models: models
  }, next);
}

/**
 * @param options.sails
 * @param options.models
 * @param options.connection
 *
 * Inject some Waterline modules into a Sails app via hook.
 */
var injectModelsGuard = _.similar({
  sails: _.isObject,
  models: _.isArray,
  connection: _.isString
});
function injectModels (options, next) {
  if (!injectModelsGuard(options)) throw new TypeError('injectModels options is not valid');

  var loadUserModules = require('sails/lib/hooks/orm/load-user-modules')(options.sails);
  var normalizeModel = require('sails/lib/hooks/orm/normalize-model')(options.sails);

  async.auto({
    // load api/models, api/adapters
    load: loadUserModules,

    // normalize model definitions and merge into sails.models
    normalize: [ 'load', function (next) {
      _.each(options.models, function (plugin) {
        var definition = _.defaults({
          globalId: plugin.globalId,
          identity: plugin.globalId.toLowerCase(),
          connection: options.connection || options.sails.config.models.connection
        }, plugin.definition);
        normalizeModel(definition, plugin.globalId.toLowerCase());
      });
      next();
    }]
  }, next);
}

exports.injectModels = injectModels;
exports.injectApp = injectApp;
