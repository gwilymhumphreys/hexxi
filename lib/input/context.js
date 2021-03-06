// Generated by CoffeeScript 1.9.3
(function() {
  var Context, _,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('lodash');

  module.exports = Context = (function() {
    function Context(options) {
      this.onEntityClick = bind(this.onEntityClick, this);
      this.bindEvents = bind(this.bindEvents, this);
      this.addSubContext = bind(this.addSubContext, this);
      this.onEntityDestroyed = bind(this.onEntityDestroyed, this);
      this.onEntityCreated = bind(this.onEntityCreated, this);
      _.extend(this, options);
      this.entities = [];
      this.sub_contexts = [];
      this.engine || (this.engine = require('../engine'));
      this.engine.on('entity/created', this.onEntityCreated);
      this.engine.on('entity/destroyed', this.onEntityDestroyed);
    }

    Context.prototype.onEntityCreated = function(entity) {};

    Context.prototype.onEntityDestroyed = function(entity) {};

    Context.prototype.addSubContext = function(context) {
      var Ctx;
      Ctx = require("./" + context);
      return this.sub_contexts.push(new Ctx);
    };

    Context.prototype.bindEvents = function() {
      var entity, i, len, ref, results;
      ref = this.engine.entities;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        entity = ref[i];
        results.push(entity.on('click', this.onEntityClick));
      }
      return results;
    };

    Context.prototype.onEntityClick = function() {
      if (!this.active) {

      }
    };

    return Context;

  })();

}).call(this);
