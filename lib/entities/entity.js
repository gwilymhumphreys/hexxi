// Generated by CoffeeScript 1.7.1
(function() {
  var Entity, EventEmitter, entity_count, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  EventEmitter = require('../lib/event_emitter');

  entity_count = 0;

  module.exports = Entity = (function(_super) {
    __extends(Entity, _super);

    function Entity(options) {
      this.options = options != null ? options : {};
      this.hasComponent = __bind(this.hasComponent, this);
      this.getComponent = __bind(this.getComponent, this);
      this.addCreatedComponent = __bind(this.addCreatedComponent, this);
      this.addComponent = __bind(this.addComponent, this);
      this.equals = __bind(this.equals, this);
      Entity.__super__.constructor.apply(this, arguments);
      this.id = ++entity_count;
      this.components = {};
      this.children = [];
    }

    Entity.prototype.equals = function(entity) {
      return this.id === entity.id;
    };

    Entity.prototype.addComponent = function(component_name, component_path, options) {
      var Component, component;
      if (arguments.length === 1) {
        Component = this._loadComponent(component_name);
      } else if (_.isObject(component_path)) {
        options = component_path;
        Component = this._loadComponent(component_name);
      } else {
        Component = this._loadComponent(component_path);
      }
      options || (options = this.options[component_name]);
      component = new Component(this, options);
      return this.addCreatedComponent(component_name, component);
    };

    Entity.prototype.addCreatedComponent = function(component_name, component) {
      if (arguments.length === 1) {
        component = component_name;
        component_name = component._name;
      }
      this.components[component_name] = component;
      return this[component_name] = component;
    };

    Entity.prototype.getComponent = function(name) {
      return this.components[name];
    };

    Entity.prototype.hasComponent = function(component_name) {
      return !!this[component_name];
    };

    Entity.prototype._loadComponent = function(component_name) {
      return require("../components/" + component_name);
    };

    return Entity;

  })(EventEmitter);

}).call(this);