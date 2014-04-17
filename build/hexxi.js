(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register('src/index', function(exports, require, module) {
module.exports = require('./../engine/engine');

});
require.register('src/actions/action', function(exports, require, module) {
var Action, _;

_ = require('underscore');

module.exports = Action = (function() {
  function Action(options) {
    _.extend(this, options);
  }

  Action.prototype.update = function() {};

  return Action;

})();

});
require.register('src/actions/move', function(exports, require, module) {
var Action, Engine, HIT_THRESHOLD, Move, tweene, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('underscore');

Action = require('./action');

Engine = require('../engine/engine');

tweene = require('tween');

HIT_THRESHOLD = 0.01;

module.exports = Move = (function(_super) {
  __extends(Move, _super);

  function Move() {
    this._toTarget = __bind(this._toTarget, this);
    this._updatePosition = __bind(this._updatePosition, this);
    this._reachedTarget = __bind(this._reachedTarget, this);
    this._endOrNext = __bind(this._endOrNext, this);
    this.update = __bind(this.update, this);
    Move.__super__.constructor.apply(this, arguments);
    if (!this.entity) {
      throw new Error('Move action missing entity');
    }
    if (!this.path) {
      throw new Error('Move action missing path');
    }
  }

  Move.prototype.update = function() {
    this._endOrNext();
    if (this.complete) {
      return;
    }
    return this._updatePosition(this.entity, this.target);
  };

  Move.prototype._endOrNext = function() {
    var target;
    if (!this.complete && !this.target || this._reachedTarget()) {
      if (target = this.path.pop()) {
        console.log('newtarget', target);
        return this.target = this._toTarget(target);
      } else {
        console.log('notarget', target);
        return this.complete = true;
      }
    }
  };

  Move.prototype._reachedTarget = function() {
    return Math.abs(this.entity.position.x - this.target.position.x) < HIT_THRESHOLD && Math.abs(this.entity.position.y - this.target.position.y) < HIT_THRESHOLD;
  };

  Move.prototype._updatePosition = function(entity, target) {
    var dx, dy;
    dx = (target.position.x - entity.position.x) * 0.1;
    dy = (target.position.y - entity.position.y) * 0.1;
    entity.position.x += dx;
    return entity.position.y += dy;
  };

  Move.prototype._toTarget = function(hex_position) {
    var pixel_coords;
    if (hex_position.position) {
      return hex_position;
    }
    pixel_coords = Engine.getSystem('hex_grid').coordsToPixel(hex_position);
    return {
      position: pixel_coords,
      hex_position: hex_position
    };
  };

  return Move;

})(Action);

});
require.register('src/commands/command', function(exports, require, module) {
var Command, Engine, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('underscore');

Engine = require('../engine/engine');

module.exports = Command = (function() {
  function Command(data, options) {
    this.data = data;
    this.options = options != null ? options : {};
    this.toJSON = __bind(this.toJSON, this);
    this.set = __bind(this.set, this);
    this.set(this.data);
  }

  Command.prototype.set = function(data) {
    if (data.entity) {
      data.entity = Engine.ensureEntity(data.entity);
    }
    if (data.target) {
      data.target = Engine.ensureEntity(data.target);
    }
    console.log('after', data);
    return _.extend(this, data);
  };

  Command.prototype.toJSON = function() {
    return {
      command: this._name,
      data: this.data
    };
  };

  return Command;

})();

});
require.register('src/commands/move', function(exports, require, module) {
var Command, Engine, MoveAction, MoveCommand, _, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('underscore');

Command = require('./command');

Engine = require('../engine/engine');

MoveAction = require('../actions/move');

module.exports = MoveCommand = (function(_super) {
  __extends(MoveCommand, _super);

  function MoveCommand() {
    this.toJSON = __bind(this.toJSON, this);
    this.execute = __bind(this.execute, this);
    _ref = MoveCommand.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  MoveCommand.prototype._name = 'move';

  MoveCommand.prototype.execute = function() {
    this.move_action = new MoveAction({
      entity: this.entity,
      path: this.path
    });
    Engine.getSystem('action_queue').push(this.move_action);
    this.goal = this.path[this.path.length - 1];
    this.entity.hex_position.q = this.goal.q;
    this.entity.hex_position.r = this.goal.r;
    return console.log(this.entity);
  };

  MoveCommand.prototype.toJSON = function() {
    return {
      command: this._name,
      data: {
        entity: this.entity.id,
        path: this.path
      }
    };
  };

  return MoveCommand;

})(Command);

});
require.register('src/components/animations', function(exports, require, module) {
var Animations, Component,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

module.exports = Animations = (function(_super) {
  __extends(Animations, _super);

  Animations.prototype._name = 'animations';

  function Animations() {
    Animations.__super__.constructor.apply(this, arguments);
    this.tweens || (this.tweens = {});
  }

  return Animations;

})(Component);

});
require.register('src/components/clickable', function(exports, require, module) {
var Clickable, Component, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

module.exports = Clickable = (function(_super) {
  __extends(Clickable, _super);

  function Clickable() {
    this.onClick = __bind(this.onClick, this);
    this.init = __bind(this.init, this);
    _ref = Clickable.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Clickable.prototype._name = 'clickable';

  Clickable.prototype.init = function() {
    this.selected = false;
    this.entity.display_object.setInteractive(true);
    return this.entity.display_object.click = this.onClick;
  };

  Clickable.prototype.onClick = function(event) {
    return this.entity.emit('click', event);
  };

  return Clickable;

})(Component);

});
require.register('src/components/component', function(exports, require, module) {
var Component, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('underscore');

module.exports = Component = (function() {
  function Component(entity, options) {
    this.entity = entity;
    this.requires = __bind(this.requires, this);
    _.extend(this, options);
  }

  Component.prototype.requires = function(components) {
    var component, _i, _len, _results;
    if (!_.isArray(components)) {
      components = [components];
    }
    _results = [];
    for (_i = 0, _len = components.length; _i < _len; _i++) {
      component = components[_i];
      if (!this.entity.hasComponent(component)) {
        throw new Error("Missing component " + component + " from entity: " + this.entity._name);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  return Component;

})();

});
require.register('src/components/hex_grid', function(exports, require, module) {
var Component, HexGrid, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

module.exports = HexGrid = (function(_super) {
  __extends(HexGrid, _super);

  function HexGrid() {
    _ref = HexGrid.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HexGrid.prototype._name = 'hex_grid';

  return HexGrid;

})(Component);

});
require.register('src/components/hex_position', function(exports, require, module) {
var Component, HexPosition, HexUtils, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

HexUtils = require('../lib/hex_utils');

module.exports = HexPosition = (function(_super) {
  __extends(HexPosition, _super);

  function HexPosition() {
    this.toCubeCoords = __bind(this.toCubeCoords, this);
    this.setHexPosition = __bind(this.setHexPosition, this);
    _ref = HexPosition.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HexPosition.prototype._name = 'hex_position';

  HexPosition.prototype.setHexPosition = function(q, r) {
    this.q = q;
    return this.r = r;
  };

  HexPosition.prototype.toCubeCoords = function() {
    return HexUtils.axialToCoubeCoords(this.q, this.r);
  };

  return HexPosition;

})(Component);

});
require.register('src/components/highlight', function(exports, require, module) {
var Component, Highlight, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

module.exports = Highlight = (function(_super) {
  __extends(Highlight, _super);

  function Highlight() {
    _ref = Highlight.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Highlight.prototype._name = 'highlight';

  return Highlight;

})(Component);

});
require.register('src/components/hover_effects', function(exports, require, module) {
var Component, HoverEffects, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

module.exports = HoverEffects = (function(_super) {
  __extends(HoverEffects, _super);

  function HoverEffects() {
    _ref = HoverEffects.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HoverEffects.prototype._name = 'hover_effects';

  return HoverEffects;

})(Component);

});
require.register('src/components/pathable', function(exports, require, module) {
var Component, Pathable, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

module.exports = Pathable = (function(_super) {
  __extends(Pathable, _super);

  function Pathable() {
    _ref = Pathable.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Pathable.prototype._name = 'pathable';

  return Pathable;

})(Component);

});
require.register('src/components/player', function(exports, require, module) {
var Component, Player, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

module.exports = Player = (function(_super) {
  __extends(Player, _super);

  function Player() {
    _ref = Player.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Player.prototype._name = 'player';

  return Player;

})(Component);

});
require.register('src/components/position', function(exports, require, module) {
var Component, Position, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

module.exports = Position = (function(_super) {
  __extends(Position, _super);

  function Position() {
    _ref = Position.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Position.prototype._name = 'position';

  return Position;

})(Component);

});
require.register('src/components/relations', function(exports, require, module) {
var Component, Relations,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

module.exports = Relations = (function(_super) {
  __extends(Relations, _super);

  Relations.prototype._name = 'relations';

  function Relations() {
    this.addChild = __bind(this.addChild, this);
    Relations.__super__.constructor.apply(this, arguments);
    this.children = [];
  }

  Relations.prototype.setParent = function(entity) {
    this.parent = entity;
    this.emit('parent/changed', this.entity);
    return this.entity;
  };

  Relations.prototype.addChild = function(entity) {
    entity.relations.setParent(this);
    this.children.push(entity);
    this.emit('child/added', this.entity);
    return this.entity;
  };

  return Relations;

})(Component);

});
require.register('src/components/selectable', function(exports, require, module) {
var Component, Selectable, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

module.exports = Selectable = (function(_super) {
  __extends(Selectable, _super);

  function Selectable() {
    _ref = Selectable.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Selectable.prototype._name = 'selectable';

  return Selectable;

})(Component);

});
require.register('src/components/team', function(exports, require, module) {
var Component, Team,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

module.exports = Team = (function(_super) {
  __extends(Team, _super);

  Team.prototype._name = 'team';

  function Team(entity, options) {
    this.entity = entity;
    Team.__super__.constructor.apply(this, arguments);
    this.players || (this.players = []);
  }

  return Team;

})(Component);

});
require.register('src/components/tile', function(exports, require, module) {
var Component, Tile, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

module.exports = Tile = (function(_super) {
  __extends(Tile, _super);

  function Tile() {
    _ref = Tile.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Tile.prototype._name = 'tile';

  return Tile;

})(Component);

});
require.register('src/config/teams', function(exports, require, module) {
module.exports = [
  {
    name: 'team_one',
    id: 1,
    players: [
      {
        name: 'murg',
        view: {
          texture: 'assets/tiles/alienYellow.png'
        },
        hex_position: {
          q: -2,
          r: -2
        }
      }, {
        name: 'murlbulge',
        view: {
          texture: 'assets/tiles/alienYellow.png'
        },
        hex_position: {
          q: -0,
          r: -2
        }
      }
    ]
  }, {
    name: 'team_two',
    id: 2,
    players: [
      {
        name: 'blarg',
        view: {
          texture: 'assets/tiles/alienPink.png'
        },
        hex_position: {
          q: 2,
          r: 2
        }
      }, {
        name: 'barglebarg',
        view: {
          texture: 'assets/tiles/alienPink.png'
        },
        hex_position: {
          q: 0,
          r: 2
        }
      }
    ]
  }
];

});
require.register('src/engine/engine', function(exports, require, module) {
var BUILTIN_PATHS, Engine, Entity, EventEmitter, globals, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_ = require('underscore');

EventEmitter = require('../lib/event_emitter');

Entity = require('../entities/entity');

globals = window || global;

BUILTIN_PATHS = {
  commands: 'client/src/commands/',
  systems: 'client/src/systems/'
};

Engine = (function(_super) {
  __extends(Engine, _super);

  function Engine() {
    this.setActiveTeam = __bind(this.setActiveTeam, this);
    this.update = __bind(this.update, this);
    this.stop = __bind(this.stop, this);
    this.start = __bind(this.start, this);
    this.removeEntity = __bind(this.removeEntity, this);
    this.addEntity = __bind(this.addEntity, this);
    this.ensureEntity = __bind(this.ensureEntity, this);
    this.getCommand = __bind(this.getCommand, this);
    this.getSystem = __bind(this.getSystem, this);
    this.addSystem = __bind(this.addSystem, this);
    this.initSystem = __bind(this.initSystem, this);
    this.components = __bind(this.components, this);
    this.entitiesByComponent = __bind(this.entitiesByComponent, this);
    this.entityById = __bind(this.entityById, this);
    this.appendPaths = __bind(this.appendPaths, this);
    this.loadModules = __bind(this.loadModules, this);
    this.createSystems = __bind(this.createSystems, this);
    this.configure = __bind(this.configure, this);
    Engine.__super__.constructor.apply(this, arguments);
    this.paused = true;
    this.modules = [];
    this.entities = [];
    this.systems = [];
    this.commands_by_name = {};
    this.systems_by_name = {};
    this.appendPaths(BUILTIN_PATHS);
  }

  Engine.prototype.configure = function(options) {
    this.options = options != null ? options : {};
    console.trace('configure');
    if (this.options.paths) {
      this.appendPaths(this.options.paths);
    }
    this.loadModules();
    this.createSystems();
    return this.init();
  };

  Engine.prototype.init = function() {
    var system, _i, _len, _ref;
    _ref = this.systems;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      system = _ref[_i];
      system.init(this);
    }
    return this.update();
  };

  Engine.prototype.createSystems = function() {
    var Command, System, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = this.modules.systems;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      System = _ref[_i];
      this.addSystem(new System(this.options.systems[System._name]));
    }
    _ref1 = this.modules.commands;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      Command = _ref1[_j];
      _results.push(this.commands_by_name[Command.prototype._name] = Command);
    }
    return _results;
  };

  Engine.prototype.loadModules = function() {
    var base_path, key, modules, path, paths, registered_modules, _i, _j, _len, _len1, _ref, _results;
    registered_modules = globals.require.list();
    _ref = this.paths;
    _results = [];
    for (key in _ref) {
      paths = _ref[key];
      modules = this.modules[key] = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        base_path = paths[_i];
        for (_j = 0, _len1 = registered_modules.length; _j < _len1; _j++) {
          path = registered_modules[_j];
          if (path.match("^" + base_path)) {
            modules.push(require(path));
          }
        }
      }
      _results.push(console.log('loaded', paths, modules));
    }
    return _results;
  };

  Engine.prototype.appendPaths = function(path_obj) {
    var key, path, paths, _base, _i, _len;
    this.paths || (this.paths = []);
    for (key in path_obj) {
      paths = path_obj[key];
      if (!BUILTIN_PATHS[key]) {
        return console.error("Hexxi::configure - given key is not used by Hexxi, maybe a typo?: " + key);
      }
      if (!_.isArray(paths)) {
        paths = [paths];
      }
      (_base = this.paths)[key] || (_base[key] = []);
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        if (__indexOf.call(this.paths[key], path) < 0) {
          this.paths[key].push(path);
        }
      }
    }
  };

  Engine.prototype.entityById = function(id) {
    return _.find(this.entities, function(entity) {
      return entity.id === id;
    });
  };

  Engine.prototype.entitiesByComponent = function(component_name) {
    return _.filter(this.entities, function(entity) {
      return entity.hasComponent(component_name);
    });
  };

  Engine.prototype.components = function(component_name) {
    var entity, _i, _len, _ref, _results;
    _ref = this.entitiesByComponent(component_name);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entity = _ref[_i];
      _results.push(entity[component_name]);
    }
    return _results;
  };

  Engine.prototype.initSystem = function(system) {
    if (_.isString(system)) {
      system = this.getSystem(system);
    }
    return system.init(this);
  };

  Engine.prototype.addSystem = function(system) {
    this.systems.push(system);
    return this.systems_by_name[system._name] = system;
  };

  Engine.prototype.getSystem = function(system_name) {
    return this.systems_by_name[system_name];
  };

  Engine.prototype.getCommand = function(name) {
    return this.commands_by_name[name];
  };

  Engine.prototype.isEntity = function(entity) {
    return entity instanceof Entity;
  };

  Engine.prototype.ensureEntity = function(entity) {
    if (_.isNumber(entity)) {
      return this.entityById(entity);
    }
    return entity;
  };

  Engine.prototype.addEntity = function(entity) {
    this.entities.push(entity);
    return this.emit('entity/created', entity);
  };

  Engine.prototype.removeEntity = function(entity) {
    var e;
    this.emit('entity/destroyed', entity);
    return this.entities = (function() {
      var _i, _len, _ref, _results;
      _ref = this.entities;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (e !== entity) {
          _results.push(e);
        }
      }
      return _results;
    }).call(this);
  };

  Engine.prototype.start = function() {
    return this.paused = false;
  };

  Engine.prototype.stop = function() {
    return this.paused = true;
  };

  Engine.prototype.update = function() {
    var system, _i, _len, _ref, _results;
    window.requestAnimationFrame(this.update);
    if (this.paused) {
      return;
    }
    _ref = this.systems;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      system = _ref[_i];
      _results.push(system.update());
    }
    return _results;
  };

  Engine.prototype.setActiveTeam = function(team) {
    return this.active_team = team;
  };

  return Engine;

})(EventEmitter);

module.exports = new Engine();

});
require.register('src/entities/board', function(exports, require, module) {
var Board, Entity,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Entity = require('./entity');

module.exports = Board = (function(_super) {
  __extends(Board, _super);

  Board.prototype._name = 'Board';

  function Board() {
    this.init = __bind(this.init, this);
    Board.__super__.constructor.apply(this, arguments);
    this.addComponent('position');
    this.addComponent('hex_grid');
    this.addComponent('view', 'views/view');
    this.addComponent('relations');
    window.board = this;
  }

  Board.prototype.init = function() {
    return Board.__super__.init.apply(this, arguments);
  };

  Board.prototype.toString = function() {
    return ['Board: ', this.x, this.y];
  };

  return Board;

})(Entity);

});
require.register('src/entities/entity', function(exports, require, module) {
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

});
require.register('src/entities/grid_tile', function(exports, require, module) {
var Entity, GridTile,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Entity = require('./entity');

module.exports = GridTile = (function(_super) {
  __extends(GridTile, _super);

  GridTile.prototype._name = 'GridTile';

  function GridTile() {
    this.toString = __bind(this.toString, this);
    GridTile.__super__.constructor.apply(this, arguments);
    this.text_anchor = {
      x: 0,
      y: 0
    };
    this.text_position = {
      x: 0,
      y: 0
    };
    this.text_format = {
      font: 'regular 8px Arial',
      fill: '#ffffff'
    };
    this.selected_texture = 'assets/tiles/tileWater_full.png';
    this.hover_texture = 'assets/tiles/tileMagic_full.png';
    this.addComponent('hex_position');
    this.addComponent('view', 'views/sprite', {
      texture: 'assets/tiles/tileGrass_full.png'
    });
    this.addComponent('sub_view', 'views/text');
    this.addComponent('position');
    this.addComponent('relations');
    this.addComponent('hover_effects', {
      outline: {
        colour: 0xffffff
      }
    });
    this.addComponent('highlight');
    this.addComponent('tile');
  }

  GridTile.prototype.toString = function() {
    var s;
    s = "q: " + this.q;
    s += "\nr: " + this.r;
    return s;
  };

  return GridTile;

})(Entity);

});
require.register('src/entities/player', function(exports, require, module) {
var Entity, Player,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Entity = require('./entity');

module.exports = Player = (function(_super) {
  __extends(Player, _super);

  Player.prototype._name = 'Player';

  function Player() {
    this.toString = __bind(this.toString, this);
    var _base;
    Player.__super__.constructor.apply(this, arguments);
    (_base = this.options).view || (_base.view = {
      texture: 'assets/tiles/alienGreen.png'
    });
    this.addComponent('hex_position');
    this.addComponent('view', 'views/sprite');
    this.addComponent('sub_view', 'views/text');
    this.addComponent('position');
    this.addComponent('relations');
    this.addComponent('hover_effects', {
      outline: {
        colour: 0xdddd77
      }
    });
    this.addComponent('selectable');
    this.addComponent('pathable');
    this.addComponent('player');
  }

  Player.prototype.toString = function() {
    return this.name;
  };

  return Player;

})(Entity);

});
require.register('src/entities/team', function(exports, require, module) {
var Entity, Team,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Entity = require('./entity');

module.exports = Team = (function(_super) {
  __extends(Team, _super);

  function Team(attrs) {
    this.toString = __bind(this.toString, this);
    Team.__super__.constructor.apply(this, arguments);
    this.addComponent('team');
  }

  Team.prototype.toString = function() {
    var s;
    s = "q: " + this.q;
    s += "\nr: " + this.r;
    return s;
  };

  return Team;

})(Entity);

});
require.register('src/input/attack', function(exports, require, module) {
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

});
require.register('src/input/context', function(exports, require, module) {
var Context, Engine, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('underscore');

Engine = require('../engine/engine');

module.exports = Context = (function() {
  function Context(options) {
    this.onEntityClick = __bind(this.onEntityClick, this);
    this.bindEvents = __bind(this.bindEvents, this);
    this.addSubContext = __bind(this.addSubContext, this);
    this.onEntityDestroyed = __bind(this.onEntityDestroyed, this);
    this.onEntityCreated = __bind(this.onEntityCreated, this);
    _.extend(this, options);
    this.entities = [];
    this.sub_contexts = [];
    Engine.on('entity/created', this.onEntityCreated);
    Engine.on('entity/destroyed', this.onEntityDestroyed);
  }

  Context.prototype.onEntityCreated = function(entity) {};

  Context.prototype.onEntityDestroyed = function(entity) {};

  Context.prototype.addSubContext = function(context) {
    var Ctx;
    Ctx = require("./" + context);
    return this.sub_contexts.push(new Ctx);
  };

  Context.prototype.bindEvents = function() {
    var entity, _i, _len, _ref, _results;
    _ref = Engine.entities;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entity = _ref[_i];
      _results.push(entity.on('click', this.onEntityClick));
    }
    return _results;
  };

  Context.prototype.onEntityClick = function() {
    if (!this.active) {

    }
  };

  return Context;

})();

});
require.register('src/input/select', function(exports, require, module) {
var Context, Engine, SelectContext, _, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('underscore');

Engine = require('../engine/engine');

Context = require('./context');

module.exports = SelectContext = (function(_super) {
  __extends(SelectContext, _super);

  function SelectContext() {
    this.select = __bind(this.select, this);
    this.deactivate = __bind(this.deactivate, this);
    this.activate = __bind(this.activate, this);
    _ref = SelectContext.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SelectContext.prototype._name = 'select';

  SelectContext.prototype.activate = function() {
    var entity, _i, _len, _ref1, _results;
    this.entities = Engine.entitiesByComponent('selectable');
    _ref1 = this.entities;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      entity = _ref1[_i];
      _results.push(entity.on('click', this.select));
    }
    return _results;
  };

  SelectContext.prototype.deactivate = function() {
    var entity, _i, _len, _ref1, _results;
    _ref1 = this.entities;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      entity = _ref1[_i];
      _results.push(entity.off('click', this.select));
    }
    return _results;
  };

  SelectContext.prototype.select = function(e, entity) {
    console.log('entityseleting');
    if (!Engine.getSystem('teams').isAlly(entity)) {
      return;
    }
    Engine.getSystem('selectables').select(entity);
    return Engine.getSystem('input').setContext('selected', entity);
  };

  return SelectContext;

})(Context);

});
require.register('src/input/selected', function(exports, require, module) {
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

});
require.register('src/lib/event_emitter', function(exports, require, module) {
var EventEmitter,
  __slice = [].slice;

module.exports = EventEmitter = (function() {
  function EventEmitter() {
    this.events = {};
  }

  EventEmitter.prototype.emit = function() {
    var args, event, listener, _i, _len, _ref;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!this.events[event]) {
      return false;
    }
    _ref = this.events[event];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      listener = _ref[_i];
      listener.apply(null, args);
    }
    return true;
  };

  EventEmitter.prototype.addListener = function(event, listener) {
    var _base;
    if (!listener) {
      throw new Error("Undefined listener for " + event);
    }
    this.emit('newListener', event, listener);
    ((_base = this.events)[event] != null ? (_base = this.events)[event] : _base[event] = []).push(listener);
    return this;
  };

  EventEmitter.prototype.once = function(event, listener) {
    var fn,
      _this = this;
    fn = function() {
      _this.removeListener(event, fn);
      return listener.apply(null, arguments);
    };
    this.on(event, fn);
    return this;
  };

  EventEmitter.prototype.removeListener = function(event, listener) {
    var l;
    if (!this.events[event]) {
      return this;
    }
    this.events[event] = (function() {
      var _i, _len, _ref, _results;
      _ref = this.events[event];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        l = _ref[_i];
        if (l !== listener) {
          _results.push(l);
        }
      }
      return _results;
    }).call(this);
    return this;
  };

  EventEmitter.prototype.removeAllListeners = function(event) {
    delete this.events[event];
    return this;
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

  return EventEmitter;

})();

});
require.register('src/lib/hex_utils', function(exports, require, module) {
var HexUtils;

module.exports = HexUtils = (function() {
  function HexUtils() {}

  HexUtils.NEIGHBOURS = [[+1, 0], [+1, -1], [0, -1], [-1, 0], [-1, +1], [0, +1]];

  HexUtils.heightFromSize = function(size) {
    return size * 2;
  };

  HexUtils.widthFromSize = function(size) {
    return Math.sqrt(3) / 2 * HexUtils.heightFromSize(size);
  };

  HexUtils.neighbour = function(q, r, direction) {
    var d, _ref;
    if (arguments.length === 2) {
      direction = r;
      _ref = q, q = _ref.q, r = _ref.r;
    }
    d = HexUtils.NEIGHBOURS[direction];
    return {
      q: q + d[0],
      r: r + d[1]
    };
  };

  HexUtils.axialToCubeCoords = function(q, r) {
    return {
      x: q,
      z: r,
      y: -q - r
    };
  };

  HexUtils.cubeToAxialCoords = function(x, y, z) {
    return {
      q: x,
      r: z
    };
  };

  HexUtils.pixelToCoords = function(x, y, tile_size) {
    var q, r;
    q = (1 / 3 * Math.sqrt(3) * x - 1 / 3 * y) / tile_size;
    r = 2 / 3 * y / tile_size;
    return HexUtils.roundCoords(q, r);
  };

  HexUtils.roundCoords = function(q, r) {
    var x, y, z, _ref, _ref1;
    if (arguments.length === 1) {
      _ref = q, q = _ref.q, r = _ref.r;
    }
    _ref1 = HexUtils.roundCoordsCubic(HexUtils.axialToCubeCoords(q, r)), x = _ref1.x, y = _ref1.y, z = _ref1.z;
    return HexUtils.cubeToAxialCoords(x, y, z);
  };

  HexUtils.roundCoordsCubic = function(x, y, z) {
    var rx, ry, rz, x_diff, y_diff, z_diff, _ref;
    if (arguments.length === 1) {
      _ref = x, x = _ref.x, y = _ref.y, z = _ref.z;
    }
    rx = Math.round(x);
    ry = Math.round(y);
    rz = Math.round(z);
    x_diff = Math.abs(rx - x);
    y_diff = Math.abs(ry - y);
    z_diff = Math.abs(rz - z);
    if (x_diff > y_diff && x_diff > z_diff) {
      rx = -ry - rz;
    } else if (y_diff > z_diff) {
      ry = -rx - rz;
    } else {
      rz = -rx - ry;
    }
    return {
      x: rx,
      y: ry,
      z: rz
    };
  };

  HexUtils.distance = function(r1, q1, r2, q2) {
    var _ref, _ref1;
    if (arguments.length === 2) {
      _ref = [q1.q, q1.r], q2 = _ref[0], r2 = _ref[1];
      _ref1 = [r1.q, r1.r], q1 = _ref1[0], r1 = _ref1[1];
    }
    return HexUtils.distanceCubic(HexUtils.axialToCubeCoords(q1, r1), HexUtils.axialToCubeCoords(q2, r2));
  };

  HexUtils.distanceCubic = function(x1, y1, z1, x2, y2, z2) {
    var _ref, _ref1;
    if (arguments.length === 2) {
      _ref = [y1.x, y1.y, y1.z], x2 = _ref[0], y2 = _ref[1], z2 = _ref[2];
      _ref1 = [x1.x, x1.y, x1.z], x1 = _ref1[0], y1 = _ref1[1], z1 = _ref1[2];
    }
    return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2), Math.abs(z1 - z2));
  };

  HexUtils.line = function(r1, q1, r2, q2) {
    var da, db, i, n, points, _i, _ref, _ref1;
    if (arguments.length === 2) {
      _ref = [q1.q, q1.r], q2 = _ref[0], r2 = _ref[1];
      _ref1 = [r1.q, r1.r], q1 = _ref1[0], r1 = _ref1[1];
    }
    points = [];
    n = HexUtils.distance(r1, q1, r2, q2);
    for (i = _i = 0; 0 <= n ? _i <= n : _i >= n; i = 0 <= n ? ++_i : --_i) {
      db = i / n;
      da = 1 - db;
      points.push(HexUtils.roundCoords(q1 * da + q2 * db, r1 * da + r2 * db));
    }
    return points;
  };

  return HexUtils;

}).call(this);

});
require.register('src/lib/path', function(exports, require, module) {
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

}).call(this);

});
require.register('src/systems/action_queue', function(exports, require, module) {
var ActionQueue, System,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

System = require('./system');

module.exports = ActionQueue = (function(_super) {
  __extends(ActionQueue, _super);

  ActionQueue.prototype._name = 'action_queue';

  function ActionQueue() {
    this.update = __bind(this.update, this);
    ActionQueue.__super__.constructor.apply(this, arguments);
    this.actions = [];
  }

  ActionQueue.prototype.unshift = function(action) {
    return this.actions.unshift(action);
  };

  ActionQueue.prototype.push = function(action) {
    return this.actions.push(action);
  };

  ActionQueue.prototype.pop = function(action) {
    return this.actions.pop(action);
  };

  ActionQueue.prototype.pause = function(action) {
    return this.actions.pause(action);
  };

  ActionQueue.prototype.update = function() {
    var _ref;
    if ((_ref = this.current_action) != null ? _ref.complete : void 0) {
      this.current_action = null;
    }
    if (!(this.current_action || this.actions.length)) {
      return;
    }
    if (this.current_action || (this.current_action = this.pop())) {
      return this.current_action.update();
    }
  };

  return ActionQueue;

})(System);

});
require.register('src/systems/animations', function(exports, require, module) {
var AnimationSystem, Engine, System, tweene,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Engine = require('../engine/engine');

System = require('./system');

tweene = require('tween');

module.exports = AnimationSystem = (function(_super) {
  __extends(AnimationSystem, _super);

  AnimationSystem.prototype._name = 'animations';

  function AnimationSystem() {
    this.update = __bind(this.update, this);
    this.onTweenComplete = __bind(this.onTweenComplete, this);
    this.onCancel = __bind(this.onCancel, this);
    this.onPause = __bind(this.onPause, this);
    this.onStart = __bind(this.onStart, this);
    this.onEntityDestroyed = __bind(this.onEntityDestroyed, this);
    this.onEntityCreated = __bind(this.onEntityCreated, this);
  }

  AnimationSystem.prototype.onEntityCreated = function(entity) {
    if (!entity.hasComponent('animations')) {
      return;
    }
    AnimationSystem.__super__.onEntityCreated.apply(this, arguments);
    entity.on('animation/start', this.onStart);
    entity.on('animation/pause', this.onPause);
    return entity.on('animation/cancel', this.onCancel);
  };

  AnimationSystem.prototype.onEntityDestroyed = function(entity) {
    AnimationSystem.__super__.onEntityDestroyed.apply(this, arguments);
    entity.off('animation/start', this.onStart);
    entity.off('animation/pause', this.onPause);
    return entity.off('animation/cancel', this.onCancel);
  };

  AnimationSystem.prototype.onStart = function(entity, tween) {
    tween.onComplete(this.onTweenComplete);
    entity.animations.tweens.push(tween);
    return tween.start();
  };

  AnimationSystem.prototype.onPause = function(entity, tween) {
    var _i, _len, _ref, _results;
    if (tween) {
      return tween.stop();
    } else {
      _ref = entity.animations.tweens;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tween = _ref[_i];
        _results.push(tween.stop());
      }
      return _results;
    }
  };

  AnimationSystem.prototype.onCancel = function(entity, tween) {
    var _i, _len, _ref, _results;
    if (tween) {
      return tween.cancel();
    } else {
      _ref = entity.animations.tweens;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tween = _ref[_i];
        _results.push(tween.cancel());
      }
      return _results;
    }
  };

  AnimationSystem.prototype.onTweenComplete = function() {};

  AnimationSystem.prototype.update = function() {
    return tweene.update();
  };

  return AnimationSystem;

})(System);

});
require.register('src/systems/command_queue', function(exports, require, module) {
var CommandQueue, Engine, MultiplayerSystem, System,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Engine = require('../engine/engine');

System = require('./system');

MultiplayerSystem = null;

module.exports = CommandQueue = (function(_super) {
  __extends(CommandQueue, _super);

  CommandQueue.prototype._name = 'command_queue';

  function CommandQueue() {
    this.update = __bind(this.update, this);
    CommandQueue.__super__.constructor.apply(this, arguments);
    this.items = [];
  }

  CommandQueue.prototype.unshift = function(item) {
    return this.items.unshift(item);
  };

  CommandQueue.prototype.push = function(item) {
    return this.items.push(item);
  };

  CommandQueue.prototype.pop = function(item) {
    return this.items.pop(item);
  };

  CommandQueue.prototype.pause = function(item) {
    return this.items.pause(item);
  };

  CommandQueue.prototype.update = function() {
    MultiplayerSystem || (MultiplayerSystem = Engine.getSystem('multiplayer'));
    if (this.current_command = this.pop()) {
      if (!this.current_command.options.remote) {
        MultiplayerSystem.sendCommand(this.current_command);
      }
      return this.current_command.execute();
    }
  };

  return CommandQueue;

})(System);

});
require.register('src/systems/hex_grid', function(exports, require, module) {
var Board, Engine, GridTile, HexGrid, HexUtils, System, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('underscore');

Engine = require('../engine/engine');

System = require('./system');

HexUtils = require('../lib/hex_utils');

Board = require('../entities/board');

GridTile = require('../entities/grid_tile');

module.exports = HexGrid = (function(_super) {
  __extends(HexGrid, _super);

  HexGrid.prototype._name = 'hex_grid';

  function HexGrid(options) {
    var key, value, _ref;
    this.options = options != null ? options : {};
    this.getTile = __bind(this.getTile, this);
    this.entitiesNotAtCoords = __bind(this.entitiesNotAtCoords, this);
    this.entitiesAtCoords = __bind(this.entitiesAtCoords, this);
    this.coordsToPixelOffset = __bind(this.coordsToPixelOffset, this);
    this.coordsToPixel = __bind(this.coordsToPixel, this);
    this.pixelToCoords = __bind(this.pixelToCoords, this);
    this.mouseEventCoords = __bind(this.mouseEventCoords, this);
    this.setScreenCoords = __bind(this.setScreenCoords, this);
    this.update = __bind(this.update, this);
    this.onClick = __bind(this.onClick, this);
    this.onMousemove = __bind(this.onMousemove, this);
    this.onEntityCreated = __bind(this.onEntityCreated, this);
    this.init = __bind(this.init, this);
    this.createTiles = __bind(this.createTiles, this);
    this.createGrid = __bind(this.createGrid, this);
    _.defaults(this.options, {
      tile_entity: GridTile,
      symmetrical: true,
      tile_size: 36,
      rows: 8,
      columns: 8
    });
    _ref = this.options;
    for (key in _ref) {
      value = _ref[key];
      this[key] = value;
    }
    if (this.tile_height == null) {
      this.tile_height = HexUtils.heightFromSize(this.tile_size);
    }
    if (this.tile_width == null) {
      this.tile_width = HexUtils.widthFromSize(this.tile_size);
    }
    if (!Engine.isEntity(this.board)) {
      this.board = new Board(_.defaults(this.board || {}, {
        position: {
          x: 10,
          y: 10
        }
      }));
    }
    console.log(Math.floor(this.rows / 2) * this.tile_width, 3 / 4 * Math.floor(this.columns / 2) * this.tile_height);
    this.board.position.x += Math.floor(this.rows / 2) * this.tile_width;
    this.board.position.y += 3 / 4 * Math.floor(this.columns / 2) * this.tile_height;
    console.log(this.board);
  }

  HexGrid.prototype.createGrid = function() {
    var tile, _i, _len, _ref, _results;
    Engine.addEntity(this.board);
    this.tiles = this.createTiles();
    _ref = this.tiles;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tile = _ref[_i];
      _results.push(Engine.addEntity(tile));
    }
    return _results;
  };

  HexGrid.prototype.createTiles = function() {
    var from, q, r, tile, tiles, to, _i, _j, _ref, _ref1;
    tiles = [];
    for (r = _i = _ref = Math.floor(-this.columns / 2) + 1, _ref1 = Math.floor(this.columns / 2); _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; r = _ref <= _ref1 ? ++_i : --_i) {
      from = Math.floor(-this.rows / 2) + 1 - Math.ceil(r / 2);
      to = Math.floor(this.rows / 2) - Math.ceil(r / 2);
      if (this.symmetrical && r % 2 !== 0) {
        from += 1;
      }
      for (q = _j = from; from <= to ? _j <= to : _j >= to; q = from <= to ? ++_j : --_j) {
        tile = new this.tile_entity({
          hex_position: {
            q: q,
            r: r,
            traversable: true
          },
          relations: {
            parent: this.board
          }
        });
        tiles.push(tile);
      }
    }
    return tiles;
  };

  HexGrid.prototype.init = function() {
    HexGrid.__super__.init.apply(this, arguments);
    this.createGrid(this.options);
    document.addEventListener('mousemove', this.onMousemove);
    return document.addEventListener('click', this.onClick);
  };

  HexGrid.prototype.onEntityCreated = function(entity) {
    if (entity.hasComponent('hex_grid')) {
      return this.board = entity;
    } else if (entity.hasComponent('hex_position')) {
      return this.setScreenCoords(entity);
    }
  };

  HexGrid.prototype.onMousemove = function(event) {
    var coords, entity, _i, _j, _len, _len1, _ref, _ref1, _results;
    coords = this.mouseEventCoords(event);
    _ref = this.entitiesAtCoords(coords);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entity = _ref[_i];
      if (!(!entity.hovering)) {
        continue;
      }
      entity.hovering = true;
      entity.emit('mouseover', event, entity);
    }
    _ref1 = this.entitiesNotAtCoords(coords);
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      entity = _ref1[_j];
      if (!entity.hovering) {
        continue;
      }
      entity.hovering = false;
      _results.push(entity.emit('mouseout', event, entity));
    }
    return _results;
  };

  HexGrid.prototype.onClick = function(event) {
    var coords, entity, _i, _len, _ref, _results;
    coords = this.mouseEventCoords(event);
    console.log(this.entitiesAtCoords(coords));
    _ref = this.entitiesAtCoords(coords);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entity = _ref[_i];
      _results.push(entity.emit('click', event, entity));
    }
    return _results;
  };

  HexGrid.prototype.update = function() {
    var entity, _i, _len, _ref, _results;
    _ref = Engine.entitiesByComponent('hex_position');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entity = _ref[_i];
      if (entity.hex_position.has_moved) {
        this.setScreenCoords(entity);
        _results.push(entity.hex_position.has_moved = false);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
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
    var _ref;
    if (arguments.length === 1) {
      _ref = q, q = _ref.q, r = _ref.r;
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

  HexGrid.prototype.entitiesAtCoords = function(q, r) {
    var e, _i, _len, _ref, _ref1, _results;
    if (arguments.length === 1) {
      _ref = q, q = _ref.q, r = _ref.r;
    }
    _ref1 = Engine.entitiesByComponent('hex_position');
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      e = _ref1[_i];
      if (e.hex_position.q === q && e.hex_position.r === r) {
        _results.push(e);
      }
    }
    return _results;
  };

  HexGrid.prototype.entitiesNotAtCoords = function(q, r) {
    var e, _i, _len, _ref, _ref1, _results;
    if (arguments.length === 1) {
      _ref = q, q = _ref.q, r = _ref.r;
    }
    _ref1 = Engine.entitiesByComponent('hex_position');
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      e = _ref1[_i];
      if (e.hex_position.q !== q || e.hex_position.r !== r) {
        _results.push(e);
      }
    }
    return _results;
  };

  HexGrid.prototype.getTile = function(q, r) {
    var _ref;
    if (arguments.length === 1) {
      _ref = q, q = _ref.q, r = _ref.r;
    }
    return _.find(Engine.entitiesByComponent('tile'), function(test) {
      return test.hex_position.q === q && test.hex_position.r === r;
    });
  };

  return HexGrid;

})(System);

});
require.register('src/systems/highlights', function(exports, require, module) {
var DEFAULTS, Engine, Highlightable, System, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Engine = require('../engine/engine');

System = require('./system');

DEFAULTS = {
  COLOUR: '#ffff55'
};

module.exports = Highlightable = (function(_super) {
  __extends(Highlightable, _super);

  function Highlightable() {
    this.onEndHighlight = __bind(this.onEndHighlight, this);
    this.onHighlight = __bind(this.onHighlight, this);
    this.createDisplayObject = __bind(this.createDisplayObject, this);
    this.onEntityCreated = __bind(this.onEntityCreated, this);
    _ref = Highlightable.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Highlightable.prototype._name = 'highlights';

  Highlightable.prototype.onEntityCreated = function(entity) {
    if (!entity.hasComponent('highlight')) {
      return;
    }
    Highlightable.__super__.onEntityCreated.apply(this, arguments);
    this.createDisplayObject(entity);
    entity.on('highlight/on', this.onHighlight);
    return entity.on('highlight/off', this.onEndHighlight);
  };

  Highlightable.prototype.createDisplayObject = function(entity) {
    entity.highlight.display_object = new PIXI.Graphics();
    entity.highlight.display_object.lineStyle(1, DEFAULTS.COLOUR);
    entity.highlight.display_object.drawCircle(0, 0, 35);
    entity.highlight.display_object.endFill();
    entity.highlight.display_object.position.x = 35;
    entity.highlight.display_object.position.y = 35;
    return entity.highlight.display_object;
  };

  Highlightable.prototype.onHighlight = function(entity) {
    if (entity.highlight.highlighting) {
      return;
    }
    entity.highlight.highlighting = true;
    return entity.view.display_object.addChild(entity.highlight.display_object);
  };

  Highlightable.prototype.onEndHighlight = function(entity) {
    if (!entity.highlight.highlighting) {
      return;
    }
    entity.highlight.highlighting = false;
    return entity.view.display_object.removeChild(entity.highlight.display_object);
  };

  return Highlightable;

})(System);

});
require.register('src/systems/hover_effects', function(exports, require, module) {
var DEFAULTS, Engine, HoverEffects, PIXI, System, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PIXI = require('pixi');

Engine = require('../engine/engine');

System = require('./system');

DEFAULTS = {
  COLOUR: '#ffffff'
};

module.exports = HoverEffects = (function(_super) {
  __extends(HoverEffects, _super);

  function HoverEffects() {
    this.onMouseout = __bind(this.onMouseout, this);
    this.onMouseover = __bind(this.onMouseover, this);
    this.createDisplayObject = __bind(this.createDisplayObject, this);
    this.onEntityCreated = __bind(this.onEntityCreated, this);
    _ref = HoverEffects.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HoverEffects.prototype.onEntityCreated = function(entity) {
    if (!entity.hasComponent('hover_effects')) {
      return;
    }
    this.createDisplayObject(entity);
    entity.on('mouseover', this.onMouseover);
    return entity.on('mouseout', this.onMouseout);
  };

  HoverEffects.prototype.createDisplayObject = function(entity) {
    var outline;
    if (outline = entity.hover_effects.outline) {
      entity.hover_effects.display_object = new PIXI.Graphics();
      entity.hover_effects.display_object.lineStyle(1, outline.colour || DEFAULTS.COLOUR);
      entity.hover_effects.display_object.drawCircle(0, 0, 35);
      entity.hover_effects.display_object.endFill();
      entity.hover_effects.display_object.position.x = 35;
      entity.hover_effects.display_object.position.y = 35;
    }
    return entity.hover_effects.display_object;
  };

  HoverEffects.prototype.onMouseover = function(event, entity) {
    if (entity.hover_effects.hovering) {
      return;
    }
    entity.hover_effects.hovering = true;
    return entity.view.display_object.addChild(entity.hover_effects.display_object);
  };

  HoverEffects.prototype.onMouseout = function(event, entity) {
    if (!entity.hover_effects.hovering) {
      return;
    }
    entity.hover_effects.hovering = false;
    return entity.view.display_object.removeChild(entity.hover_effects.display_object);
  };

  return HoverEffects;

})(System);

});
require.register('src/systems/input', function(exports, require, module) {
var CONTEXTS, Engine, InputSystem, System,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

Engine = require('../engine/engine');

System = require('./system');

CONTEXTS = ['attack', 'select', 'selected'];

module.exports = InputSystem = (function(_super) {
  __extends(InputSystem, _super);

  InputSystem.prototype._name = 'input';

  function InputSystem(context_names) {
    this.context_names = context_names != null ? context_names : CONTEXTS;
    this.addContext = __bind(this.addContext, this);
    this.setContext = __bind(this.setContext, this);
    this.init = __bind(this.init, this);
  }

  InputSystem.prototype.init = function() {
    var context_name, _i, _len, _ref, _results;
    InputSystem.__super__.init.apply(this, arguments);
    this.contexts = [];
    _ref = this.context_names;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      context_name = _ref[_i];
      _results.push(this.addContext(context_name));
    }
    return _results;
  };

  InputSystem.prototype.setContext = function() {
    var args, context_name, _ref, _ref1;
    context_name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if ((_ref = this.current_context) != null) {
      _ref.deactivate();
    }
    this.current_context = this.contexts[context_name];
    return (_ref1 = this.current_context).activate.apply(_ref1, args);
  };

  InputSystem.prototype.addContext = function(name) {
    var Context;
    Context = require("../input/" + name);
    return this.contexts[name] = new Context();
  };

  return InputSystem;

})(System);

});
require.register('src/systems/multiplayer', function(exports, require, module) {
var Engine, MultiplayerSystem, System, cloak, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Engine = require('../engine/engine');

System = require('./system');

cloak = require('cloak');

module.exports = MultiplayerSystem = (function(_super) {
  __extends(MultiplayerSystem, _super);

  function MultiplayerSystem() {
    this.sendCommand = __bind(this.sendCommand, this);
    this.onCommand = __bind(this.onCommand, this);
    this.init = __bind(this.init, this);
    _ref = MultiplayerSystem.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  MultiplayerSystem.prototype._name = 'multiplayer';

  MultiplayerSystem.prototype.init = function() {
    MultiplayerSystem.__super__.init.apply(this, arguments);
    this.primus = new Primus(this.url);
    this.socket = this.primus.channel('clients');
    this.socket.on('command', this.onCommand);
    return this.id = this.socket.id;
  };

  MultiplayerSystem.prototype.onCommand = function(data) {
    var Command, command;
    console.log('id', this.socket.id);
    console.log('server said: ' + data);
    if (data.user_id === this.id) {
      return;
    }
    if (!(Command = Engine.getCommand(data.command))) {
      console.error('Command not found: ', data.command);
    }
    command = new Command(data.data, {
      remote: true
    });
    return Engine.getSystem('command_queue').push(command);
  };

  MultiplayerSystem.prototype.sendCommand = function(command) {
    return this.socket.send('command', command.toJSON());
  };

  return MultiplayerSystem;

})(System);

});
require.register('src/systems/pathing', function(exports, require, module) {
var Engine, Path, Pathing, System, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Engine = require('../engine/engine');

System = require('./system');

Path = require('../lib/path');

module.exports = Pathing = (function(_super) {
  __extends(Pathing, _super);

  function Pathing() {
    this.showPath = __bind(this.showPath, this);
    this.hidePath = __bind(this.hidePath, this);
    this.pathEnd = __bind(this.pathEnd, this);
    this.pathStart = __bind(this.pathStart, this);
    this.onTileHover = __bind(this.onTileHover, this);
    this.onTileClick = __bind(this.onTileClick, this);
    this.onEntityDeselected = __bind(this.onEntityDeselected, this);
    this.onEntitySelected = __bind(this.onEntitySelected, this);
    this.onEntityDestroyed = __bind(this.onEntityDestroyed, this);
    this.onEntityCreated = __bind(this.onEntityCreated, this);
    this.init = __bind(this.init, this);
    _ref = Pathing.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Pathing.prototype._name = 'pathing';

  Pathing.prototype.init = function() {
    Pathing.__super__.init.apply(this, arguments);
    return this.pathing = false;
  };

  Pathing.prototype.onEntityCreated = function(entity) {
    if (!entity.hasComponent('pathable')) {
      return;
    }
    Pathing.__super__.onEntityCreated.apply(this, arguments);
    entity.on('selectable/select', this.onEntitySelected);
    return entity.on('selectable/deselect', this.onEntityDeselected);
  };

  Pathing.prototype.onEntityDestroyed = function(entity) {
    Pathing.__super__.onEntityDestroyed.apply(this, arguments);
    return entity.off('selectable/select', this.onEntitySelected);
  };

  Pathing.prototype.onEntitySelected = function(entity) {
    console.log('es', this.pathing);
    if (this.pathing) {

    } else {
      return this.pathStart(entity);
    }
  };

  Pathing.prototype.onEntityDeselected = function(entity) {
    return this.pathEnd(entity);
  };

  Pathing.prototype.onTileClick = function(e, entity) {
    if (this.pathing) {
      return this.pathEnd(entity);
    }
  };

  Pathing.prototype.onTileHover = function(e, entity) {
    var path_finder;
    if (!this.pathing) {
      return;
    }
    this.hidePath();
    path_finder = new Path(this.map, {
      end_traversable: true
    });
    this.path = path_finder.findPath(this.current.hex_position, entity.hex_position);
    return this.showPath();
  };

  Pathing.prototype.pathStart = function(entity) {
    var e, positions, _i, _len, _ref1;
    this.map_entities = Engine.entitiesByComponent('hex_position');
    positions = [];
    _ref1 = this.map_entities;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      e = _ref1[_i];
      e.on('mouseover', this.onTileHover);
      e.on('click', this.onTileClick);
      positions.push(e.hex_position);
    }
    this.map = Path.createMap(positions);
    this.pathing = true;
    this.current = entity;
    return entity.emit('pathable/path_started', entity);
  };

  Pathing.prototype.pathEnd = function(entity) {
    var tile, _i, _len, _ref1;
    _ref1 = this.map_entities;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      tile = _ref1[_i];
      tile.off('mouseover', this.onTileHover);
      tile.off('click', this.onTileClick);
    }
    this.hidePath();
    this.pathing = false;
    this.current = null;
    console.log('pathend', this.path);
    return entity.emit('pathable/path_end', {
      path: this.path
    }, entity);
  };

  Pathing.prototype.hidePath = function() {
    var coords, tile, _i, _len, _ref1, _results;
    if (this.path) {
      _ref1 = this.path;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        coords = _ref1[_i];
        tile = Engine.getSystem('hex_grid').getTile(coords);
        _results.push(tile.emit('highlight/off', tile));
      }
      return _results;
    }
  };

  Pathing.prototype.showPath = function() {
    var coords, tile, _i, _len, _ref1, _results;
    if (this.path) {
      _ref1 = this.path;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        coords = _ref1[_i];
        tile = Engine.getSystem('hex_grid').getTile(coords);
        _results.push(tile.emit('highlight/on', tile));
      }
      return _results;
    }
  };

  return Pathing;

})(System);

});
require.register('src/systems/renderer', function(exports, require, module) {
var Engine, PIXI, Renderer, System,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PIXI = require('pixi');

Engine = require('../engine/engine');

System = require('./system');

module.exports = Renderer = (function(_super) {
  __extends(Renderer, _super);

  Renderer.prototype._name = 'renderer';

  function Renderer() {
    this.setTexture = __bind(this.setTexture, this);
    this.removeFromStage = __bind(this.removeFromStage, this);
    this.addToStage = __bind(this.addToStage, this);
    this.getStage = __bind(this.getStage, this);
    this.setStage = __bind(this.setStage, this);
    this.createDisplayObject = __bind(this.createDisplayObject, this);
    this.update = __bind(this.update, this);
    this.onParentChanged = __bind(this.onParentChanged, this);
    this.onEntityDestroyed = __bind(this.onEntityDestroyed, this);
    this.onEntityCreated = __bind(this.onEntityCreated, this);
    this.stage = new PIXI.Stage(0x66FF99);
    this.renderer = PIXI.autoDetectRenderer(800, 600);
    document.body.appendChild(this.renderer.view);
  }

  Renderer.prototype.onEntityCreated = function(entity) {
    if (!entity.hasComponent('view')) {
      return;
    }
    Renderer.__super__.onEntityCreated.apply(this, arguments);
    this.setStage(entity);
    this.createDisplayObject(entity);
    this.addToStage(entity);
    return entity.on('parent/changed', this.onParentChanged);
  };

  Renderer.prototype.onEntityDestroyed = function(entity) {
    Renderer.__super__.onEntityDestroyed.apply(this, arguments);
    return entity.off('parent/changed', this.onParentChanged);
  };

  Renderer.prototype.onParentChanged = function(entity) {
    return this.setStage(entity);
  };

  Renderer.prototype.update = function() {
    var entity, _i, _len, _ref;
    _ref = Engine.entitiesByComponent('view');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entity = _ref[_i];
      entity.view.display_object.position.x = entity.position.x;
      entity.view.display_object.position.y = entity.position.y;
    }
    return this.renderer.render(this.stage);
  };

  Renderer.prototype.createDisplayObject = function(entity) {
    return entity.view.createDisplayObject();
  };

  Renderer.prototype.setStage = function(entity) {
    var removed;
    removed = this.removeFromStage(entity);
    entity.view.stage = this.getStage(entity);
    if (removed) {
      return this.addToStage(entity);
    }
  };

  Renderer.prototype.getStage = function(entity) {
    var _ref, _ref1, _ref2;
    return ((_ref = entity.relations) != null ? (_ref1 = _ref.parent) != null ? (_ref2 = _ref1.view) != null ? _ref2.display_object : void 0 : void 0 : void 0) || this.stage;
  };

  Renderer.prototype.addToStage = function(entity) {
    var stage;
    if (!(stage = entity.view.stage)) {
      return;
    }
    if (stage.children.indexOf(entity.view.display_object) >= 0) {
      return;
    }
    stage.addChild(entity.view.display_object);
    return entity.emit('show', entity.view.display_object);
  };

  Renderer.prototype.removeFromStage = function(entity) {
    var stage;
    if (!((stage = entity.view.stage) && stage.children.indexOf(entity.view.display_object) >= 0)) {
      return false;
    }
    stage.removeChild(entity.view.display_object);
    entity.emit('hide', entity.view.display_object);
    return true;
  };

  Renderer.prototype.setTexture = function(entity, texture) {
    entity.view.texture = texture;
    entity.view.pixi_texture = PIXI.Texture.fromImage(texture);
    return entity.view.display_object.setTexture(entity.view.pixi_texture);
  };

  return Renderer;

})(System);

});
require.register('src/systems/selectables', function(exports, require, module) {
var Engine, Selectables, System, _ref,
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
    _ref = Selectables.__super__.constructor.apply(this, arguments);
    return _ref;
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
    var _ref1;
    if (!((_ref1 = this.selected_entity) != null ? _ref1.equals(entity) : void 0)) {
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

});
require.register('src/systems/system', function(exports, require, module) {
var Engine, System,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Engine = require('../engine/engine');

module.exports = System = (function() {
  function System(options) {
    var key, value, _ref;
    this.options = options != null ? options : {};
    this.onEntityDestroyed = __bind(this.onEntityDestroyed, this);
    this.onEntityCreated = __bind(this.onEntityCreated, this);
    this.init = __bind(this.init, this);
    _ref = this.options;
    for (key in _ref) {
      value = _ref[key];
      this[key] = value;
    }
  }

  System.prototype.init = function() {
    var entity, _i, _len, _ref;
    this.entities = [];
    _ref = Engine.entities;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entity = _ref[_i];
      this.onEntityCreated(entity);
    }
    Engine.on('entity/created', this.onEntityCreated);
    return Engine.on('entity/destroyed', this.onEntityDestroyed);
  };

  System.prototype.update = function() {};

  System.prototype.onEntityCreated = function(entity) {};

  System.prototype.onEntityDestroyed = function(entity) {};

  return System;

})();

});
require.register('src/systems/teams', function(exports, require, module) {
var Engine, System, Teams, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Engine = require('../engine/engine');

System = require('./system');

module.exports = Teams = (function(_super) {
  __extends(Teams, _super);

  function Teams() {
    this.isEnemy = __bind(this.isEnemy, this);
    this.isAlly = __bind(this.isAlly, this);
    this.onEntityCreated = __bind(this.onEntityCreated, this);
    _ref = Teams.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Teams.prototype._name = 'teams';

  Teams.prototype.onEntityCreated = function(entity) {
    if (!entity.hasComponent('team')) {
      return;
    }
    return Teams.__super__.onEntityCreated.apply(this, arguments);
  };

  Teams.prototype.isAlly = function(entity) {
    var _ref1;
    return (((_ref1 = entity.player) != null ? _ref1.team_id : void 0) != null) && Engine.active_team.id === entity.player.team_id;
  };

  Teams.prototype.isEnemy = function(entity) {
    var _ref1;
    return (((_ref1 = entity.player) != null ? _ref1.team_id : void 0) != null) && Engine.active_team.id !== entity.player.team_id;
  };

  return Teams;

})(System);

});
require.register('src/components/views/circle', function(exports, require, module) {
var Circle, Component, PIXI, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./../component');

PIXI = require('pixi');

module.exports = Circle = (function(_super) {
  __extends(Circle, _super);

  function Circle() {
    this.createDisplayObject = __bind(this.createDisplayObject, this);
    _ref = Circle.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Circle.prototype._name = 'circle';

  Circle.prototype.createDisplayObject = function() {
    this.display_object = new PIXI.Graphics();
    this.display_object.beginFill(0xFFFF00);
    this.display_object.lineStyle(5, 0xFF0000);
    this.display_object.drawCircle(100, 100, 5);
    return this.display_object;
  };

  return Circle;

})(Component);

});
require.register('src/components/views/sprite', function(exports, require, module) {
var PIXI, Sprite, View, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('./view');

PIXI = require('pixi');

module.exports = Sprite = (function(_super) {
  __extends(Sprite, _super);

  function Sprite() {
    this.createDisplayObject = __bind(this.createDisplayObject, this);
    _ref = Sprite.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Sprite.prototype._name = 'sprite';

  Sprite.prototype.createDisplayObject = function() {
    if (!this.texture) {
      return new Error('Sprite missing texture');
    }
    this.pixi_texture = PIXI.Texture.fromImage(this.texture);
    this.display_object = new PIXI.Sprite(this.pixi_texture);
    return this.display_object;
  };

  return Sprite;

})(View);

});
require.register('src/components/views/text', function(exports, require, module) {
var PIXI, TextView, View, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('underscore');

View = require('./view');

PIXI = require('pixi');

module.exports = TextView = (function(_super) {
  __extends(TextView, _super);

  TextView.prototype._name = 'text';

  function TextView(entity, options) {
    this.entity = entity;
    this.createDisplayObject = __bind(this.createDisplayObject, this);
    TextView.__super__.constructor.apply(this, arguments);
    this.text_anchor || (this.text_anchor = {
      x: 0.5,
      y: 0
    });
    this.text_position || (this.text_position = {
      x: 20,
      y: 50
    });
    this.text_format || (this.text_format = {
      font: 'regular 8px Arial'
    });
  }

  TextView.prototype.createDisplayObject = function() {
    this.display_object = new PIXI.Text(this.entity.toString(), this.text_format);
    this.display_object.anchor.x = this.text_anchor.x;
    this.display_object.anchor.y = this.text_anchor.y;
    this.display_object.position.x = this.text_position.x;
    this.display_object.position.y = this.text_position.y;
    return this.display_object;
  };

  return TextView;

})(View);

});
require.register('src/components/views/view', function(exports, require, module) {
var Component, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('../component');

module.exports = View = (function(_super) {
  __extends(View, _super);

  function View() {
    _ref = View.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  View.prototype._name = 'view';

  View.prototype.createDisplayObject = function() {
    this.display_object = new PIXI.DisplayObjectContainer();
    return this.display_object;
  };

  return View;

})(Component);

});
require.register('src/input/mixins/select_ally', function(exports, require, module) {
var Engine, SelectAllyMixin, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('underscore');

Engine = require('../../engine/engine');

module.exports = SelectAllyMixin = (function() {
  function SelectAllyMixin() {
    this.select = __bind(this.select, this);
  }

  SelectAllyMixin.prototype.activate = function() {
    var entity, _i, _len, _ref, _results;
    this.targets = Engine.entitiesByComponent('selectable');
    _ref = this.targets;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entity = _ref[_i];
      _results.push(entity.on('click', this.select));
    }
    return _results;
  };

  SelectAllyMixin.prototype.deactivate = function() {
    var entity, _i, _len, _ref, _results;
    _ref = this.targets;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entity = _ref[_i];
      _results.push(entity.off('click', this.select));
    }
    return _results;
  };

  SelectAllyMixin.prototype.select = function(e, entity) {
    return Engine.getSystem('selectables').select(entity);
  };

  return SelectAllyMixin;

})();

});;