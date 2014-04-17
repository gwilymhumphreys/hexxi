// Generated by CoffeeScript 1.7.1
(function() {
  var HexUtils, MOVE_COST, Path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  HexUtils = require('./hex_utils');

  MOVE_COST = 1;

  module.exports = Path = (function() {
    Path.MOVE_COST = MOVE_COST;

    function Path(map, options) {
      this.map = map;
      this._setValues = __bind(this._setValues, this);
      this._tracePathToStart = __bind(this._tracePathToStart, this);
      this._neighbours = __bind(this._neighbours, this);
      this.findPath = __bind(this.findPath, this);
      this.node = __bind(this.node, this);
      this.prev = __bind(this.prev, this);
      this.next = __bind(this.next, this);
      this.reset = __bind(this.reset, this);
      _.extend(this, options);
      this.reset();
    }

    Path.createMap = function(entities) {
      var current, entity, map, node, q, r, _i, _len;
      map = [];
      for (_i = 0, _len = entities.length; _i < _len; _i++) {
        entity = entities[_i];
        q = entity.q, r = entity.r;
        node = Path.prototype._toNode(entity);
        map[q] || (map[q] = []);
        if (current = map[q][r]) {
          node.traversable = current.traversable && entity.traversable;
        }
        map[q][r] = node;
      }
      return map;
    };

    Path.prototype.reset = function() {
      this.open = [];
      this.closed = {};
      this.path = [];
      return this.iter = 0;
    };

    Path.prototype.next = function() {
      ++this.iter;
      if (this.iter > this.path.length) {
        return this.iter = this.path.length;
      }
    };

    Path.prototype.prev = function() {
      --this.iter;
      if (this.iter < 0) {
        return this.iter = 0;
      }
    };

    Path.prototype.node = function() {
      return this.path[this.iter];
    };

    Path.prototype.hash = function(node) {
      return "" + node.q + ", " + node.r;
    };

    Path.prototype.findPath = function(start, goal) {
      var closed_node, closing, neighbour, path, _i, _len, _ref;
      if (!this.map) {
        throw new Error('Path::findPath requires a map to be supplied first');
      }
      start = this._toNode(start);
      this.goal = this._toNode(goal);
      this._setValues(start, null, goal);
      this.reset();
      this.open.push(start);
      while (this.open.length > 0) {
        closing = this.open.shift();
        if (this._equal(closing, this.goal)) {
          this.closed[this.hash(closing)] = closing;
          path = this._tracePathToStart(closing);
          return path;
        }
        if (!this.closed[this.hash(closing)]) {
          this.closed[this.hash(closing)] = closing;
          _ref = this._neighbours(closing);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            neighbour = _ref[_i];
            neighbour = this._setValues(neighbour, closing, this.goal);
            if (closed_node = this.closed[this.hash(neighbour)]) {
              if ((closing.g + neighbour.cost) < closed_node.g) {
                this.closed[this.hash(neighbour)] = neighbour;
              }
            } else {
              this._insertSorted(neighbour, this.open);
            }
          }
        }
      }
    };

    Path.prototype._neighbours = function(node) {
      var adjacent, coord, dir, n, _i, _ref;
      adjacent = [];
      for (dir = _i = 0; _i <= 5; dir = ++_i) {
        coord = HexUtils.neighbour(node, dir);
        if (n = (_ref = this.map[coord.q]) != null ? _ref[coord.r] : void 0) {
          if (n.traversable || (this.end_traversable && this._equal(n, this.goal))) {
            adjacent.push(this._toNode(n));
          }
        }
      }
      return adjacent;
    };

    Path.prototype._equal = function(a, b) {
      return a.q === b.q && a.r === b.r;
    };

    Path.prototype._tracePathToStart = function(node) {
      var c, max, path;
      path = [];
      max = 10;
      c = 0;
      while (node) {
        if (++c > max) {
          return path;
        }
        path.push(node);
        node = node.parent;
      }
      return path;
    };

    Path.prototype._setValues = function(node, parent, goal) {
      node.parent = parent;
      node.cost || (node.cost = MOVE_COST);
      node.g = ((parent != null ? parent.g : void 0) || 0) + node.cost;
      node.h = HexUtils.distance(node, goal);
      node.f = node.g + node.h;
      return node;
    };

    Path.prototype._insertSorted = function(node, list) {
      var i, _i, _ref;
      if (!list.length) {
        list.push(node);
        return list;
      }
      for (i = _i = 0, _ref = list.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (node.f < list[i].f) {
          list.splice(i, 0, node);
          return list;
        }
      }
    };

    Path.prototype._toNode = function(obj) {
      var node;
      node = _.pick(obj, 'q', 'r', 'traversable');
      if (node.traversable == null) {
        node.traversable = true;
      }
      return node;
    };

    Path.prototype._inspect = function(node) {
      return "" + node.q + ", " + node.r;
    };

    return Path;

  })();

}).call(this);