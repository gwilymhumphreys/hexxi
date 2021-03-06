// Generated by CoffeeScript 1.9.3
(function() {
  var Board, GridTile, HexGrid, HexUtils, Queue, System, _,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require('lodash');

  Queue = require('queue-async');

  System = require('./system');

  HexUtils = require('../lib/hex_utils');

  Board = require('../entities/board');

  GridTile = require('../entities/grid_tile');

  module.exports = HexGrid = (function(superClass) {
    extend(HexGrid, superClass);

    HexGrid.prototype._name = 'hex_grid';

    function HexGrid(options) {
      var key, ref, value;
      this.options = options != null ? options : {};
      this.getTile = bind(this.getTile, this);
      this.entitiesNotAtCoords = bind(this.entitiesNotAtCoords, this);
      this.entitiesAtCoords = bind(this.entitiesAtCoords, this);
      this.occupied = bind(this.occupied, this);
      this.coordsToPixelOffset = bind(this.coordsToPixelOffset, this);
      this.coordsToPixel = bind(this.coordsToPixel, this);
      this.pixelToCoords = bind(this.pixelToCoords, this);
      this.mouseEventCoords = bind(this.mouseEventCoords, this);
      this.setScreenCoords = bind(this.setScreenCoords, this);
      this.hexPathMove = bind(this.hexPathMove, this);
      this.linearMove = bind(this.linearMove, this);
      this.createTiles = bind(this.createTiles, this);
      this.createBoard = bind(this.createBoard, this);
      this.update = bind(this.update, this);
      this.onClick = bind(this.onClick, this);
      this.onMousemove = bind(this.onMousemove, this);
      this.onEntityCreated = bind(this.onEntityCreated, this);
      HexGrid.__super__.constructor.apply(this, arguments);
      _.defaults(this.options, {
        tile_entity: GridTile,
        symmetrical: true,
        tile_size: 36,
        rows: 8,
        columns: 8,
        z_index: -1000
      });
      ref = this.options;
      for (key in ref) {
        value = ref[key];
        this[key] = value;
      }
      if (this.tile_height == null) {
        this.tile_height = HexUtils.heightFromSize(this.tile_size);
      }
      if (this.tile_width == null) {
        this.tile_width = HexUtils.widthFromSize(this.tile_size);
      }
    }

    HexGrid.prototype.onEntityCreated = function(entity) {
      if (entity.hasComponent('hex_grid')) {
        return this.board = entity;
      } else if (entity.hasComponent('hex_position')) {
        return this.setScreenCoords(entity);
      }
    };

    HexGrid.prototype.onMousemove = function(event) {
      var coords, entity, i, j, len, len1, ref, ref1, results;
      coords = this.mouseEventCoords(event);
      ref = this.entitiesAtCoords(coords);
      for (i = 0, len = ref.length; i < len; i++) {
        entity = ref[i];
        if (!(!entity.hovering)) {
          continue;
        }
        entity.hovering = true;
        entity.emit('mouseover', entity, event);
      }
      ref1 = this.entitiesNotAtCoords(coords);
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        entity = ref1[j];
        if (!entity.hovering) {
          continue;
        }
        entity.hovering = false;
        results.push(entity.emit('mouseout', entity, event));
      }
      return results;
    };

    HexGrid.prototype.onClick = function(event) {
      var coords, entity, i, len, ref, results;
      coords = this.mouseEventCoords(event);
      ref = this.entitiesAtCoords(coords);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        entity = ref[i];
        results.push(entity.emit('click', entity, event));
      }
      return results;
    };

    HexGrid.prototype.update = function() {
      var entity, i, len, ref, results;
      ref = this.engine.entitiesByComponent('hex_position');
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        entity = ref[i];
        if (entity.hex_position.has_moved) {
          this.setScreenCoords(entity);
          results.push(entity.hex_position.has_moved = false);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    HexGrid.prototype.createBoard = function() {
      var i, len, ref, tile;
      if (!this.engine.isEntity(this.board)) {
        this.board = new Board(_.defaults(this.board || {}, {
          position: {
            x: 10,
            y: 10
          }
        }));
        this.board.position.x += Math.floor(this.rows / 2) * this.tile_width;
        this.board.position.y += 3 / 4 * Math.floor(this.columns / 2) * this.tile_height;
      }
      this.engine.addEntity(this.board);
      this.tiles = this.createTiles();
      ref = this.tiles;
      for (i = 0, len = ref.length; i < len; i++) {
        tile = ref[i];
        this.engine.addEntity(tile);
      }
      document.addEventListener('mousemove', this.onMousemove);
      this.engine.on('click', this.onClick);
      this.engine.emit('hex_grid/board_created', this.board);
      return this.board;
    };

    HexGrid.prototype.createTiles = function() {
      var from, i, j, layer, q, r, ref, ref1, ref2, ref3, tile, tiles, to;
      tiles = [];
      layer = this.z_index;
      for (r = i = ref = Math.floor(-this.columns / 2) + 1, ref1 = Math.floor(this.columns / 2); ref <= ref1 ? i <= ref1 : i >= ref1; r = ref <= ref1 ? ++i : --i) {
        from = Math.floor(-this.rows / 2) + 1 - Math.ceil(r / 2);
        to = Math.floor(this.rows / 2) - Math.ceil(r / 2);
        if (this.symmetrical && r % 2 !== 0) {
          from += 1;
        }
        for (q = j = ref2 = from, ref3 = to; ref2 <= ref3 ? j <= ref3 : j >= ref3; q = ref2 <= ref3 ? ++j : --j) {
          tile = new this.tile_entity({
            hex_position: {
              q: q,
              r: r,
              traversable: true
            },
            relations: {
              parent: this.board
            },
            view: {
              z_index: layer
            }
          });
          tiles.push(tile);
        }
        layer++;
      }
      return tiles;
    };

    HexGrid.prototype.linearMove = function(entity, to_position, callback) {
      return this.engine.getSystem('animations').animateLinear(entity, to_position, (function(_this) {
        return function(err) {
          return callback(err, entity.hex_position.setAndEmit(to_position));
        };
      })(this));
    };

    HexGrid.prototype.hexPathMove = function(entity, path, callback) {
      var fn, i, len, pos, queue, ref;
      if (!_.isArray(path)) {
        path = [path];
      }
      callback || (callback = function() {});
      queue = new Queue(1);
      ref = path.reverse();
      fn = (function(_this) {
        return function(pos) {
          return queue.defer(function(callback) {
            if (entity.hex_position.equals(pos)) {
              return callback();
            }
            return _this.linearMove(entity, pos, callback);
          });
        };
      })(this);
      for (i = 0, len = ref.length; i < len; i++) {
        pos = ref[i];
        fn(pos);
      }
      return queue.await(callback);
    };

    HexGrid.prototype.setScreenCoords = function(entity) {
      var screen_coords;
      screen_coords = this.coordsToPixel(entity.hex_position);
      return _.extend(entity.position, screen_coords);
    };

    HexGrid.prototype.mouseEventCoords = function(event) {
      return this.pixelToCoords(event.offsetX, event.offsetY);
    };

    HexGrid.prototype.pixelToCoords = function(x, y) {
      x = x - this.board.position.x - this.tile_width / 2;
      y = y - this.board.position.y - this.tile_height / 2;
      return HexUtils.pixelToCoords(x, y, this.tile_size);
    };

    HexGrid.prototype.coordsToPixel = function(q, r) {
      var ref;
      if (r == null) {
        ref = q, q = ref.q, r = ref.r;
      }
      return {
        x: this.tile_size * Math.sqrt(3) * (q + r / 2),
        y: this.tile_size * 3 / 2 * r
      };
    };

    HexGrid.prototype.coordsToPixelOffset = function(q, r) {
      var pos;
      pos = this.coordsToPixel(q, r);
      pos.x += this.board.position.x;
      pos.y += this.board.position.y;
      return pos;
    };

    HexGrid.prototype.occupied = function(q, r) {
      var e;
      return ((function() {
        var i, len, ref, results;
        ref = this.entitiesAtCoords(q, r);
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          e = ref[i];
          if (!e.hex_position.traversable) {
            results.push(e);
          }
        }
        return results;
      }).call(this)).length;
    };

    HexGrid.prototype.entitiesAtCoords = function(q, r) {
      var e, i, len, ref, ref1, results;
      if (r == null) {
        ref = q, q = ref.q, r = ref.r;
      }
      ref1 = this.engine.entitiesByComponent('hex_position');
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        e = ref1[i];
        if (e.hex_position.q === q && e.hex_position.r === r) {
          results.push(e);
        }
      }
      return results;
    };

    HexGrid.prototype.entitiesNotAtCoords = function(q, r) {
      var e, i, len, ref, ref1, results;
      if (r == null) {
        ref = q, q = ref.q, r = ref.r;
      }
      ref1 = this.engine.entitiesByComponent('hex_position');
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        e = ref1[i];
        if (e.hex_position.q !== q || e.hex_position.r !== r) {
          results.push(e);
        }
      }
      return results;
    };

    HexGrid.prototype.getTile = function(q, r) {
      var ref;
      if (r == null) {
        ref = q, q = ref.q, r = ref.r;
      }
      return _.find(this.engine.entitiesByComponent('tile'), function(test) {
        return test.hex_position.q === q && test.hex_position.r === r;
      });
    };

    return HexGrid;

  })(System);

}).call(this);
