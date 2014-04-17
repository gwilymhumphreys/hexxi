// Generated by CoffeeScript 1.7.1
(function() {
  var AllySelectedContext, Engine, MoveCommand, Select, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  Engine = require('../engine/engine');

  MoveCommand = require('../commands/move');

  Select = require('./select');

  module.exports = AllySelectedContext = (function(_super) {
    __extends(AllySelectedContext, _super);

    AllySelectedContext.prototype._name = 'selected';

    function AllySelectedContext() {
      this.onTileSelect = __bind(this.onTileSelect, this);
      this.onEnemySelect = __bind(this.onEnemySelect, this);
      this.onAllySelect = __bind(this.onAllySelect, this);
      this.deactivate = __bind(this.deactivate, this);
      this.activate = __bind(this.activate, this);
    }

    AllySelectedContext.prototype.activate = function(entity) {
      var tile, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4, _results;
      this.entity = entity;
      console.log('selectedcontext activated', arguments);
      this.ally_players = [];
      this.enemy_players = [];
      this.tiles = [];
      _ref = Engine.entitiesByComponent('selectable');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entity = _ref[_i];
        if (Engine.getSystem('teams').isAlly(entity)) {
          this.ally_players.push(entity);
        }
        if (Engine.getSystem('teams').isEnemy(entity)) {
          this.enemy_players.push(entity);
        }
      }
      _ref1 = Engine.entitiesByComponent('tile');
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        tile = _ref1[_j];
        this.tiles.push(tile);
      }
      _ref2 = this.ally_players;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        entity = _ref2[_k];
        entity.on('click', this.onAllySelect);
      }
      _ref3 = this.enemy_players;
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        entity = _ref3[_l];
        entity.on('click', this.onEnemySelect);
      }
      _ref4 = this.tiles;
      _results = [];
      for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
        entity = _ref4[_m];
        _results.push(entity.on('click', this.onTileSelect));
      }
      return _results;
    };

    AllySelectedContext.prototype.deactivate = function() {
      var entity, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
      console.log('selectedcontext deactivated');
      _ref = this.ally_players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entity = _ref[_i];
        entity.off('click', this.onAllySelect);
      }
      _ref1 = this.enemy_players;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        entity = _ref1[_j];
        entity.off('click', this.onEnemySelect);
      }
      _ref2 = this.tiles;
      _results = [];
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        entity = _ref2[_k];
        _results.push(entity.off('click', this.onTileSelect));
      }
      return _results;
    };

    AllySelectedContext.prototype.onAllySelect = function(e, entity) {
      console.log('ally select', entity);
      Engine.getSystem('selectables').select(entity);
      return Engine.getSystem('input').setContext('selected', entity);
    };

    AllySelectedContext.prototype.onEnemySelect = function(e, entity) {
      var command, path;
      console.log('enemy select', entity);
      path = Engine.getSystem('pathing').path;
      command = new MoveCommand({
        entity: this.entity,
        path: path
      });
      Engine.getSystem('command_queue').push(command);
      return Engine.getSystem('input').setContext('select');
    };

    AllySelectedContext.prototype.onTileSelect = function(e, entity) {
      var command, path;
      path = Engine.getSystem('pathing').path;
      command = new MoveCommand({
        entity: this.entity,
        path: path
      });
      Engine.getSystem('command_queue').push(command);
      return Engine.getSystem('input').setContext('select');
    };

    return AllySelectedContext;

  })(Select);

}).call(this);