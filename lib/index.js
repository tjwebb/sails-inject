'use strict';

var async = require('async');
var path = require('path');
var fs = require('fs');

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
    }],

    // Load models into waterline, 5. tear down connections, 6. reinitialize waterline
    /*
    instantiatedCollections: ['modelDefs', function (next, tasks) {
      var modelDefs = tasks.modelDefs;

      var waterline = new Waterline();
      _.each(modelDefs, function(modelDef, modelID){
        waterline.loadCollection(Waterline.Collection.extend(modelDef));
      });

      var connections = {};

      _.each(sails.adapters, function(adapter, adapterKey) {
        _.each(sails.config.connections, function(connection, connectionKey) {
          if (adapterKey !== connection.adapter) return;
          connections[connectionKey] = connection;
        });
      });

      var toTearDown = [];

      _.each(connections, function(connection, connectionKey) {
        toTearDown.push({ adapter: connection.adapter, connection: connectionKey });
      });

      async.each(toTearDown, function(tear, callback) {
         sails.adapters[tear.adapter].teardown(tear.connection, callback);
      }, function(error){
        if (error) {
          sails.log.error(error);
          return next(error);
        }
        waterline.initialize({
          adapters: sails.adapters,
          connections: connections
        }, next);
      });
    }],
    */

    // create controller blueprints
    /*
    injectBlueprints: ['instantiatedCollections', function (next) {
      _.each(models, function (model){
        var controller = _.cloneDeep(model);
        controller._config = { rest: true };

        var controllerId = model.identity;

        if (!_.isObject(sails.controllers[controllerId])) {
          sails.controllers[controllerId] = controller;
        }

        if (!_.isObject(sails.hooks.controllers.middleware[controllerId])) {
          sails.hooks.controllers.middleware[controllerId] = controller;
        }
      });
      next();
    }]
    */

  }, next);
}

exports.injectModels = injectModels;
exports.injectApp = injectApp;
