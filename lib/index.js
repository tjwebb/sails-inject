/* global sails: true */

'use strict';

var async = require('async');
var Waterline = require('waterline');

exports.injectModels = function injectModels(models, cb) {
  // copy sails/lib/hooks/orm/loadUserModules to make it accessible here
  var loadUserModelsAndAdapters = require('./loadUserModules')(sails);

  async.auto({
    // 1. load api/models, api/adapters
    _loadModules: loadUserModelsAndAdapters,

    // 2. Merge additional models,  3. normalize model definitions
    modelDefs: ['_loadModules', function (next){
      _.each(models, function (model) {
         _.merge(sails.models, model);
      });

      _.each(sails.models, sails.hooks.orm.normalizeModelDef);
      next(null, sails.models);
    }],

    // 4. Load models into waterline, 5. tear down connections, 6. reinitialize waterline
    instantiatedCollections: ['modelDefs', function(next, stack){
      var modelDefs = stack.modelDefs;

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
      }, function(){
         waterline.initialize({
           adapters: sails.adapters,
           connections: connections
         }, next);
      });
    }],

    // 7. Expose initialized models to global scope and sails
    _prepareModels: ['instantiatedCollections', sails.hooks.orm.prepareModels]

  }, cb);
};

exports.injectBlueprints = function injectBlueprints (models) {
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
};
