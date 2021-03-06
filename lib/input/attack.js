// Generated by CoffeeScript 1.7.1
(function() {
  var AttackContext, Context, Engine, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  Engine = require('../engine/engine');

  Context = require('./context');

  module.exports = AttackContext = (function(_super) {
    __extends(AttackContext, _super);

    function AttackContext(options) {
      this.onDeselect = __bind(this.onDeselect, this);
      this.onSelect = __bind(this.onSelect, this);
      this.toggleSelect = __bind(this.toggleSelect, this);
      var entity, _i, _len, _ref;
      _.extend(this, options);
      this.targets = Engine.entitiesByComponent('selectable');
      _ref = this.targets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entity = _ref[_i];
        entity.on('click', this.toggleSelect);
      }
    }

    AttackContext.prototype.toggleSelect = function(event, entity) {
      if (this.selected_entity) {
        return this.onDeselect(entity);
      } else {
        return this.onSelect(entity);
      }
    };

    AttackContext.prototype.onSelect = function(entity) {
      this.selected_entity = entity;
      entity.selectable.selected = true;
      return entity.emit('selectable/select', entity);
    };

    AttackContext.prototype.onDeselect = function(entity) {
      entity.selectable.selected = false;
      return entity.emit('selectable/deselect', entity);
    };

    return AttackContext;

  })(Context);

}).call(this);
