// Generated by CoffeeScript 1.7.1
(function() {
  var Engine, Selectables, System,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Engine = require('../engine/engine');

  System = require('./system');

  module.exports = Selectables = (function(_super) {
    __extends(Selectables, _super);

    function Selectables() {
      this.onCurrentTeam = __bind(this.onCurrentTeam, this);
      this.canSelect = __bind(this.canSelect, this);
      this.deselect = __bind(this.deselect, this);
      this.select = __bind(this.select, this);
      this.toggle = __bind(this.toggle, this);
      this.onEntityCreated = __bind(this.onEntityCreated, this);
      return Selectables.__super__.constructor.apply(this, arguments);
    }

    Selectables.prototype._name = 'selectables';

    Selectables.prototype.onEntityCreated = function(entity) {
      if (!entity.hasComponent('selectable')) {
        return;
      }
      return entity.selectable.selected = false;
    };

    Selectables.prototype.toggle = function(entity) {
      var new_target;
      if (this.selected_entity) {
        new_target = !this.selected_entity.equals(entity);
        this.deselect(this.selected_entity);
      } else {
        new_target = true;
      }
      if (new_target) {
        return this.select(entity);
      }
    };

    Selectables.prototype.select = function(entity) {
      var _ref;
      if (!((_ref = this.selected_entity) != null ? _ref.equals(entity) : void 0)) {
        this.deselect(this.selected_entity);
        this.selected_entity = entity;
        entity.selectable.selected = true;
        return entity.emit('selectable/select', entity);
      }
    };

    Selectables.prototype.deselect = function(entity) {
      if (!entity) {
        return;
      }
      this.selected_entity = null;
      entity.selectable.selected = false;
      return entity.emit('selectable/deselect', entity);
    };

    Selectables.prototype.canSelect = function(entity) {
      console.log('currentteam', entity, this.onCurrentTeam(entity));
      return entity.getComponent('selectable') && this.onCurrentTeam(entity);
    };

    Selectables.prototype.onCurrentTeam = function(entity) {
      return Engine.active_team.id === entity.player.team_id;
    };

    return Selectables;

  })(System);

}).call(this);