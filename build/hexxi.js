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
require.register('src/engine', function(exports, require, module) {
var BUILTIN_PATHS, DEFAULT_OPTIONS, Engine, Entity, EventEmitter, MODULE_CATEGORIES, StateManager, globals, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

EventEmitter = require('./lib/event_emitter');

StateManager = require('./states/state_manager');

Entity = require('./entities/entity');

globals = window || global;

BUILTIN_PATHS = {
  animations: {
    animation: require('./animations/animation'),
    hex_path: require('./animations/hex_path'),
    linear: require('./animations/linear')
  },
  entities: {
    board: require('./entities/board'),
    entity: require('./entities/entity'),
    grid_tile: require('./entities/grid_tile'),
    team: require('./entities/team'),
    unit: require('./entities/unit'),
    user: require('./entities/user')
  },
  input: {
    context: require('./input/context'),
    select: require('./input/select'),
    selected: require('./input/selected')
  },
  commands: {
    move: require('./commands/move')
  },
  components: {
    animations: require('./components/animations'),
    clickable: require('./components/clickable'),
    component: require('./components/component'),
    hex_grid: require('./components/hex_grid'),
    hex_position: require('./components/hex_position'),
    highlight: require('./components/highlight'),
    hover_effects: require('./components/hover_effects'),
    pathable: require('./components/pathable'),
    position: require('./components/position'),
    relations: require('./components/relations'),
    selectable: require('./components/selectable'),
    team: require('./components/team'),
    team_membership: require('./components/team_membership'),
    tile: require('./components/tile'),
    user: require('./components/user'),
    circle: require('./components/views/circle'),
    sprite: require('./components/views/sprite'),
    text: require('./components/views/text'),
    view: require('./components/views/view')
  },
  systems: {
    animations: require('./systems/animations'),
    command_queue: require('./systems/command_queue'),
    hex_grid: require('./systems/hex_grid'),
    highlights: require('./systems/highlights'),
    hover_effects: require('./systems/hover_effects'),
    input: require('./systems/input'),
    multiplayer: require('./systems/multiplayer'),
    pathing: require('./systems/pathing'),
    relations: require('./systems/relations'),
    renderer: require('./systems/renderer'),
    selectables: require('./systems/selectables'),
    system: require('./systems/system'),
    teams: require('./systems/teams'),
    users: require('./systems/users')
  }
};

MODULE_CATEGORIES = _.keys(BUILTIN_PATHS);

DEFAULT_OPTIONS = {
  states: {}
};

Engine = (function(_super) {
  __extends(Engine, _super);

  function Engine() {
    this.reset = __bind(this.reset, this);
    this.update = __bind(this.update, this);
    this.stop = __bind(this.stop, this);
    this.start = __bind(this.start, this);
    this.removeEntity = __bind(this.removeEntity, this);
    this.addEntity = __bind(this.addEntity, this);
    this.ensureEntity = __bind(this.ensureEntity, this);
    this.getInputContext = __bind(this.getInputContext, this);
    this.getComponent = __bind(this.getComponent, this);
    this.getCommand = __bind(this.getCommand, this);
    this.getSystem = __bind(this.getSystem, this);
    this.addSystem = __bind(this.addSystem, this);
    this.initSystem = __bind(this.initSystem, this);
    this.activeComponents = __bind(this.activeComponents, this);
    this.entitiesByComponent = __bind(this.entitiesByComponent, this);
    this.entityById = __bind(this.entityById, this);
    this.appendPaths = __bind(this.appendPaths, this);
    this.loadModules = __bind(this.loadModules, this);
    this.createSystems = __bind(this.createSystems, this);
    this.onClick = __bind(this.onClick, this);
    this.onRightClick = __bind(this.onRightClick, this);
    this.bindEvents = __bind(this.bindEvents, this);
    this.init = __bind(this.init, this);
    this.configure = __bind(this.configure, this);
    Engine.__super__.constructor.apply(this, arguments);
    window.Engine = this;
    this.started = true;
    this.paused = true;
    this.modules = {};
    this.entities = [];
    this.systems = [];
    this.commands_by_name = {};
    this.components_by_name = {};
    this.systems_by_name = {};
    this.appendPaths(BUILTIN_PATHS);
    this.state = new StateManager();
  }

  Engine.prototype.configure = function(options) {
    if (options == null) {
      options = {};
    }
    this.options = _.defaults(options, DEFAULT_OPTIONS);
    if (this.options.states) {
      this.state.configure(this.options.states);
    }
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
    this.update();
    return this.bindEvents();
  };

  Engine.prototype.bindEvents = function() {
    this.element = this.getSystem('renderer').view;
    this.element.addEventListener('click', this.onClick, false);
    return this.element.addEventListener('contextmenu', this.onRightClick, false);
  };

  Engine.prototype.onRightClick = function(event) {
    event.preventDefault();
    return this.emit('rightclick', event);
  };

  Engine.prototype.onClick = function(event) {
    if (event.which !== 1) {
      return;
    }
    event.preventDefault();
    return this.emit('click', event);
  };

  Engine.prototype.createSystems = function() {
    var System, _i, _len, _ref, _results;
    _ref = this.modules.systems;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      System = _ref[_i];
      _results.push(this.addSystem(new System(this.options.systems[System._name])));
    }
    return _results;
  };

  Engine.prototype.loadModules = function() {
    var Command, Component, category, duplicate, module, name, path, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
    for (_i = 0, _len = MODULE_CATEGORIES.length; _i < _len; _i++) {
      category = MODULE_CATEGORIES[_i];
      this.modules[category] = [];
      _ref = this.paths[category];
      for (name in _ref) {
        path = _ref[name];
        if (_.isString(path)) {
          module = require(path);
        } else {
          module = path;
        }
        if (module.prototype._name && (duplicate = _.find(this.modules[category], function(m) {
          return m.prototype._name === module.prototype._name;
        }))) {
          console.log("Hexxi.Engine warning: A " + category + " module with the name " + module.prototype._name + " already exists:", module, duplicate);
        }
        this.modules[category].push(module);
      }
    }
    _ref1 = this.modules.commands;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      Command = _ref1[_j];
      this.commands_by_name[Command.prototype._name] = Command;
    }
    _ref2 = this.modules.components;
    _results = [];
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      Component = _ref2[_k];
      if (Component.prototype._name) {
        _results.push(this.components_by_name[Component.prototype._name] = Component);
      }
    }
    return _results;
  };

  Engine.prototype.appendPaths = function(path_obj) {
    var key, paths, _base;
    this.paths || (this.paths = []);
    for (key in path_obj) {
      paths = path_obj[key];
      if (!BUILTIN_PATHS[key]) {
        return console.error("Hexxi::configure - given key is not used by Hexxi, maybe a typo?: " + key);
      }
      (_base = this.paths)[key] || (_base[key] = {});
      _.extend(this.paths[key], paths);
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

  Engine.prototype.activeComponents = function(component_name) {
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

  Engine.prototype.getComponent = function(name) {
    return this.components_by_name[name];
  };

  Engine.prototype.getInputContext = function(name) {
    return _.find(this.modules.input, function(c) {
      return c.prototype._name === name;
    });
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
    var system, _i, _j, _len, _len1, _ref, _ref1, _results;
    window.requestAnimationFrame(this.update);
    if (this.paused) {
      return;
    }
    this.state.preUpdate();
    _ref = this.systems;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      system = _ref[_i];
      if (system.preUpdate) {
        system.preUpdate();
      }
    }
    _ref1 = this.systems;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      system = _ref1[_j];
      _results.push(system.update());
    }
    return _results;
  };

  Engine.prototype.reset = function() {
    var entity, _i, _len, _ref, _results;
    _ref = this.entities;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entity = _ref[_i];
      _results.push(entity.destroy());
    }
    return _results;
  };

  return Engine;

})(EventEmitter);

module.exports = new Engine();

});
require.register('src/index', function(exports, require, module) {
var _;

_ = require('lodash');

module.exports = {
  Engine: require('./engine'),
  Animation: require('./animations/animation'),
  animations: {
    HexPath: require('./animations/hex_path'),
    Linear: require('./animations/linear')
  },
  Entity: require('./entities/entity'),
  entities: {
    Entity: require('./entities/entity'),
    Board: require('./entities/board'),
    GridTile: require('./entities/grid_tile'),
    Team: require('./entities/team'),
    Unit: require('./entities/unit'),
    User: require('./entities/user')
  },
  InputContext: require('./input/context'),
  input: {
    Select: require('./input/select'),
    Selected: require('./input/selected')
  },
  Command: require('./commands/command'),
  commands: {
    Move: require('./commands/move')
  },
  Component: require('./components/component'),
  System: require('./systems/system'),
  HexUtils: require('./lib/hex_utils')
};

_.extend(module.exports, {
  configure: module.exports.Engine.configure
});

});
require.register('src/animations/animation', function(exports, require, module) {
var Animation, EventEmitter, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

EventEmitter = require('../lib/event_emitter');

module.exports = Animation = (function(_super) {
  __extends(Animation, _super);

  function Animation(options) {
    Animation.__super__.constructor.apply(this, arguments);
    _.extend(this, options);
    this.engine || (this.engine = require('../engine'));
  }

  Animation.prototype.update = function() {};

  return Animation;

})(EventEmitter);

});
require.register('src/animations/hex_path', function(exports, require, module) {
var Animation, AnimationUtils, HexPathAnimation, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

Animation = require('./animation');

AnimationUtils = require('../lib/animation_utils');

module.exports = HexPathAnimation = (function(_super) {
  __extends(HexPathAnimation, _super);

  function HexPathAnimation() {
    this._endOrNext = __bind(this._endOrNext, this);
    this.update = __bind(this.update, this);
    HexPathAnimation.__super__.constructor.apply(this, arguments);
    if (!this.entity) {
      throw new Error('HexPathAnimation missing entity');
    }
    if (!this.path) {
      throw new Error('HexPathAnimation missing path');
    }
    if (!_.isArray(this.path)) {
      this.path = [this.path];
    }
    this.speed = 0.2;
  }

  HexPathAnimation.prototype.update = function() {
    this._endOrNext();
    if (this.complete) {
      return;
    }
    return AnimationUtils.updatePosition(this.entity, this.target, this.speed);
  };

  HexPathAnimation.prototype._endOrNext = function() {
    var from, target;
    if (!this.complete && !this.target || AnimationUtils.reachedTarget(this.entity, this.target)) {
      if (target = this.path.pop()) {
        from = this.target;
        this.target = AnimationUtils.toTarget(this.engine, target);
        return this.emit('complete', this);
      } else {
        return this.complete = true;
      }
    }
  };

  return HexPathAnimation;

})(Animation);

});
require.register('src/animations/linear', function(exports, require, module) {
var Animation, AnimationUtils, LinearAnimation, tweene, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

tweene = require('tween.js');

Animation = require('./animation');

AnimationUtils = require('../lib/animation_utils');

module.exports = LinearAnimation = (function(_super) {
  __extends(LinearAnimation, _super);

  function LinearAnimation() {
    this.update = __bind(this.update, this);
    LinearAnimation.__super__.constructor.apply(this, arguments);
    if (!this.entity) {
      throw new Error('LinearAnimation missing entity');
    }
    if (!this.target) {
      throw new Error('LinearAnimation missing target');
    }
    this.target = AnimationUtils.toTarget(this.engine, this.target);
    this.speed = 0.2;
  }

  LinearAnimation.prototype.update = function() {
    if (this.complete = AnimationUtils.reachedTarget(this.entity, this.target)) {
      this.emit('complete', this);
      return;
    }
    return AnimationUtils.updatePosition(this.entity, this.target, this.speed);
  };

  return LinearAnimation;

})(Animation);

});
require.register('src/commands/command', function(exports, require, module) {
var Command, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

module.exports = Command = (function() {
  function Command(data, options) {
    this.data = data;
    this.options = options != null ? options : {};
    this.toJSON = __bind(this.toJSON, this);
    this.set = __bind(this.set, this);
    this.engine = this.options.engine || require('../engine');
    this.set(this.data);
  }

  Command.prototype.set = function(data) {
    if (data.entity) {
      data.entity = this.engine.ensureEntity(data.entity);
    }
    if (data.target) {
      data.target = this.engine.ensureEntity(data.target);
    }
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
var Command, MoveCommand, _, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

Command = require('./command');

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
    this.engine.getSystem('hex_grid').hexPathMove(this.entity, this.path);
    return this.engine.emit('command', this);
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
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

module.exports = Animations = (function(_super) {
  __extends(Animations, _super);

  Animations.prototype._name = 'animations';

  function Animations() {
    this.remove = __bind(this.remove, this);
    this.onAnimationComplete = __bind(this.onAnimationComplete, this);
    this.add = __bind(this.add, this);
    this.isAnimating = __bind(this.isAnimating, this);
    Animations.__super__.constructor.apply(this, arguments);
    this.tweens || (this.tweens = {});
    this.animations = [];
  }

  Animations.prototype.isAnimating = function() {
    return this.animations.length > 0;
  };

  Animations.prototype.add = function(animation, callback) {
    var _this = this;
    this.animations.push(animation);
    if (callback) {
      return animation.once('complete', function() {
        return _this.onAnimationComplete(animation, callback);
      });
    }
  };

  Animations.prototype.onAnimationComplete = function(animation, callback) {
    this.remove(animation);
    callback();
    if (this.animations.length === 0) {
      return this.entity.emit('animations_complete');
    }
  };

  Animations.prototype.remove = function(animation) {
    return this.animations = _.without(this.animations, animation);
  };

  return Animations;

})(Component);

});
require.register('src/components/clickable', function(exports, require, module) {
var Clickable, Component,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

module.exports = Clickable = (function(_super) {
  __extends(Clickable, _super);

  Clickable.prototype._name = 'clickable';

  function Clickable() {
    this.onClick = __bind(this.onClick, this);
    this.onDisplayObjectCreated = __bind(this.onDisplayObjectCreated, this);
    Clickable.__super__.constructor.apply(this, arguments);
    this.requires('view');
    if (this.entity.view.display_object) {
      this.onDisplayObjectCreated();
    } else {
      this.entity.once('view/display_object_created', this.onDisplayObjectCreated);
    }
  }

  Clickable.prototype.onDisplayObjectCreated = function() {
    this.selected = false;
    this.entity.view.display_object.interactive = true;
    return this.entity.view.display_object.click = this.onClick;
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

_ = require('lodash');

module.exports = Component = (function() {
  function Component(entity, options) {
    this.entity = entity;
    this.destroy = __bind(this.destroy, this);
    this.requires = __bind(this.requires, this);
    _.extend(this, options);
    this.engine || (this.engine = require('../engine'));
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

  Component.prototype.destroy = function() {};

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
var Component, HexPosition, HexUtils, _, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

Component = require('./component');

HexUtils = require('../lib/hex_utils');

module.exports = HexPosition = (function(_super) {
  __extends(HexPosition, _super);

  function HexPosition() {
    this.equals = __bind(this.equals, this);
    this.toJSON = __bind(this.toJSON, this);
    this.toCubeCoords = __bind(this.toCubeCoords, this);
    this.setAndEmit = __bind(this.setAndEmit, this);
    this.setHexPosition = __bind(this.setHexPosition, this);
    _ref = HexPosition.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HexPosition.prototype._name = 'hex_position';

  HexPosition.prototype.setHexPosition = function(q, r) {
    var _ref1;
    if (arguments.length === 1) {
      _ref1 = q, q = _ref1.q, r = _ref1.r;
    }
    this.q = q;
    return this.r = r;
  };

  HexPosition.prototype.set = HexPosition.prototype.setHexPosition;

  HexPosition.prototype.setAndEmit = function(position, from_position) {
    from_position || (from_position = this.toJSON());
    this.set(position);
    return this.engine.emit('enter_tile', {
      entity: this.entity,
      position: position,
      from_position: from_position
    });
  };

  HexPosition.prototype.toCubeCoords = function() {
    return HexUtils.axialToCoubeCoords(this.q, this.r);
  };

  HexPosition.prototype.toJSON = function() {
    return _.pick(this, 'q', 'r');
  };

  HexPosition.prototype.equals = function(pos) {
    return this.q === pos.q && this.r === pos.r;
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
require.register('src/components/position', function(exports, require, module) {
var Component, Position, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

module.exports = Position = (function(_super) {
  __extends(Position, _super);

  function Position() {
    this.set = __bind(this.set, this);
    _ref = Position.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Position.prototype._name = 'position';

  Position.prototype.set = function(x, y) {
    var _ref1;
    if (arguments.length === 1) {
      _ref1 = x, x = _ref1.x, y = _ref1.y;
    }
    this.x = x;
    return this.y = y;
  };

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
    this.toJSON = __bind(this.toJSON, this);
    this.removeChild = __bind(this.removeChild, this);
    this.addChild = __bind(this.addChild, this);
    this.revertParent = __bind(this.revertParent, this);
    this.setParent = __bind(this.setParent, this);
    Relations.__super__.constructor.apply(this, arguments);
    this.children = [];
    if (this.parent) {
      this.setParent(this.parent);
    } else {
      this.parent = null;
    }
  }

  Relations.prototype.setParent = function(parent) {
    if (this.entity.equals(parent)) {
      return console.trace("RelationsComponent: Attempting to set an entity's parent to itself", this.entity);
    }
    if (this.previous_parent = this.parent) {
      this.previous_parent.relations.children = _.without(this.previous_parent.relations.children, this.entity);
    }
    if (parent) {
      this.parent = parent;
      parent.relations.children.push(this.entity);
    } else {
      this.parent = null;
    }
    return this.entity.emit('parent/changed', this.entity);
  };

  Relations.prototype.revertParent = function() {
    return this.setParent(this.previous_parent);
  };

  Relations.prototype.addChild = function(child) {
    return child.setParent(this.entity);
  };

  Relations.prototype.removeChild = function(child) {
    return child.setParent(null);
  };

  Relations.prototype.toJSON = function() {
    var e;
    return {
      parent: this.parent,
      previous_parent: this.previous_parent,
      children: (function() {
        var _i, _len, _ref, _results;
        _ref = this.children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          e = _ref[_i];
          _results.push(e.id);
        }
        return _results;
      }).call(this)
    };
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
    this.units || (this.units = []);
  }

  return Team;

})(Component);

});
require.register('src/components/team_membership', function(exports, require, module) {
var Component, TeamMembership, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

module.exports = TeamMembership = (function(_super) {
  __extends(TeamMembership, _super);

  function TeamMembership() {
    _ref = TeamMembership.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  TeamMembership.prototype._name = 'team_membership';

  return TeamMembership;

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
require.register('src/components/user', function(exports, require, module) {
var Component, User,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

module.exports = User = (function(_super) {
  __extends(User, _super);

  User.prototype._name = 'user';

  function User(entity, options) {
    this.entity = entity;
    this.team = __bind(this.team, this);
    User.__super__.constructor.apply(this, arguments);
    this.teams || (this.teams = []);
    if (this.is_local == null) {
      this.is_local = true;
    }
  }

  User.prototype.team = function() {
    var _ref;
    return (_ref = this.teams) != null ? _ref[0] : void 0;
  };

  return User;

})(Component);

});
require.register('src/entities/board', function(exports, require, module) {
var Board, Entity,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Entity = require('./entity');

module.exports = Board = (function(_super) {
  __extends(Board, _super);

  Board.prototype._name = 'board';

  function Board() {
    Board.__super__.constructor.apply(this, arguments);
    this.addComponent('position');
    this.addComponent('hex_grid');
    this.addComponent('view');
    this.addComponent('relations');
    window.board = this;
  }

  return Board;

})(Entity);

});
require.register('src/entities/entity', function(exports, require, module) {
var Entity, EventEmitter, entity_count, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

EventEmitter = require('../lib/event_emitter');

entity_count = 0;

module.exports = Entity = (function(_super) {
  __extends(Entity, _super);

  function Entity(options) {
    if (options == null) {
      options = {};
    }
    this.hasComponent = __bind(this.hasComponent, this);
    this.getComponent = __bind(this.getComponent, this);
    this.addCreatedComponent = __bind(this.addCreatedComponent, this);
    this.addComponent = __bind(this.addComponent, this);
    this.equals = __bind(this.equals, this);
    this.destroy = __bind(this.destroy, this);
    this.toString = __bind(this.toString, this);
    this.options = options;
    Entity.__super__.constructor.apply(this, arguments);
    this.id = options.id || ++entity_count;
    this.components = {};
    this.children = [];
    this.engine || (this.engine = require('../engine'));
  }

  Entity.prototype.toString = function() {
    var s, _ref, _ref1, _ref2, _ref3;
    s = "" + this._name + " (" + this.id + ")\n";
    if (this.position) {
      s += " [x: " + ((_ref = this.position) != null ? _ref.x : void 0) + ", y: " + ((_ref1 = this.position) != null ? _ref1.y : void 0) + "]\n";
    }
    if (this.hex_position) {
      s += " [q: " + ((_ref2 = this.hex_position) != null ? _ref2.q : void 0) + ", r: " + ((_ref3 = this.hex_position) != null ? _ref3.r : void 0) + "]\n";
    }
    return s;
  };

  Entity.prototype.destroy = function() {
    var component, name, _ref, _results;
    this.removeAllListeners();
    _ref = this.components;
    _results = [];
    for (name in _ref) {
      component = _ref[name];
      _results.push(component.destroy());
    }
    return _results;
  };

  Entity.prototype.equals = function(entity) {
    return this.id === (entity != null ? entity.id : void 0);
  };

  Entity.prototype.addComponent = function(component_name, component_path, options) {
    var Component, component, _base;
    if (arguments.length === 1) {
      Component = this._loadComponent(component_name);
    } else if (_.isObject(component_path)) {
      options = component_path;
      Component = this._loadComponent(component_name);
    } else {
      Component = this._loadComponent(component_path);
    }
    options = _.defaults(options || {}, (_base = this.options)[component_name] || (_base[component_name] = {}));
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
    return this.engine.getComponent(component_name);
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

  GridTile.prototype._name = 'grid_tile';

  function GridTile() {
    this.toString = __bind(this.toString, this);
    GridTile.__super__.constructor.apply(this, arguments);
    this.selected_texture = 'assets/tiles/tileWater_full.png';
    this.hover_texture = 'assets/tiles/tileMagic_full.png';
    this.addComponent('hex_position');
    this.addComponent('view', 'sprite', {
      texture: 'assets/tiles/tileGrass.png'
    });
    this.addComponent('sub_view', 'text', {
      text_position: {
        x: 40,
        y: 20
      }
    });
    this.addComponent('position');
    this.addComponent('relations');
    this.addComponent('hover_effects');
    this.addComponent('highlight', {
      texture: this.hover_texture
    });
    this.addComponent('tile');
  }

  GridTile.prototype.toString = function() {
    return "" + this.hex_position.q + " " + this.hex_position.r;
  };

  return GridTile;

})(Entity);

});
require.register('src/entities/team', function(exports, require, module) {
var Entity, Team,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Entity = require('./entity');

module.exports = Team = (function(_super) {
  __extends(Team, _super);

  Team.prototype._name = 'team';

  function Team() {
    Team.__super__.constructor.apply(this, arguments);
    this.addComponent('team');
  }

  return Team;

})(Entity);

});
require.register('src/entities/unit', function(exports, require, module) {
var Entity, Unit,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Entity = require('./entity');

module.exports = Unit = (function(_super) {
  __extends(Unit, _super);

  Unit.prototype._name = 'unit';

  function Unit() {
    var _base;
    Unit.__super__.constructor.apply(this, arguments);
    (_base = this.options).view || (_base.view = {
      texture: 'assets/tiles/alienGreen.png'
    });
    this.addComponent('hex_position');
    this.addComponent('view', 'sprite');
    this.addComponent('sub_view', 'text');
    this.addComponent('position');
    this.addComponent('relations');
    this.addComponent('hover_effects', {
      outline: {
        colour: 0xdddd77
      }
    });
    this.addComponent('selectable');
    this.addComponent('pathable');
    this.addComponent('team_membership');
    this.addComponent('animations');
  }

  return Unit;

})(Entity);

});
require.register('src/entities/user', function(exports, require, module) {
var Entity, User,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Entity = require('./entity');

module.exports = User = (function(_super) {
  __extends(User, _super);

  User.prototype._name = 'user';

  function User() {
    User.__super__.constructor.apply(this, arguments);
    this.addComponent('user');
  }

  return User;

})(Entity);

});
require.register('src/input/context', function(exports, require, module) {
var Context, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

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
    var entity, _i, _len, _ref, _results;
    _ref = this.engine.entities;
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
var Context, SelectContext, _, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

Context = require('./context');

module.exports = SelectContext = (function(_super) {
  __extends(SelectContext, _super);

  function SelectContext() {
    this.select = __bind(this.select, this);
    this.deactivate = __bind(this.deactivate, this);
    this.onEntityCreated = __bind(this.onEntityCreated, this);
    this.activate = __bind(this.activate, this);
    _ref = SelectContext.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SelectContext.prototype._name = 'select';

  SelectContext.prototype.activate = function() {
    var entity, _i, _len, _ref1, _results;
    this.active = true;
    this.entities = this.engine.entitiesByComponent('selectable');
    _ref1 = this.entities;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      entity = _ref1[_i];
      _results.push(entity.on('click', this.select));
    }
    return _results;
  };

  SelectContext.prototype.onEntityCreated = function(entity) {
    if (!this.active) {
      return;
    }
    this.entities.push(entity);
    return entity.on('click', this.select);
  };

  SelectContext.prototype.deactivate = function() {
    var entity, _i, _len, _ref1, _results;
    this.active = false;
    _ref1 = this.entities;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      entity = _ref1[_i];
      _results.push(entity.off('click', this.select));
    }
    return _results;
  };

  SelectContext.prototype.select = function(entity, event) {
    if (!this.engine.started) {
      return;
    }
    if (!this.engine.getSystem('teams').isAlly(entity)) {
      return;
    }
    this.engine.getSystem('selectables').select(entity);
    return this.engine.getSystem('input').setContext('selected', entity);
  };

  return SelectContext;

})(Context);

});
require.register('src/input/selected', function(exports, require, module) {
var AllySelectedContext, MoveCommand, Select, _, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

MoveCommand = require('../commands/move');

Select = require('./select');

module.exports = AllySelectedContext = (function(_super) {
  __extends(AllySelectedContext, _super);

  function AllySelectedContext() {
    this.onTileSelect = __bind(this.onTileSelect, this);
    this.onEnemySelect = __bind(this.onEnemySelect, this);
    this.onAllySelect = __bind(this.onAllySelect, this);
    this.onRightClick = __bind(this.onRightClick, this);
    this.deactivate = __bind(this.deactivate, this);
    this.activate = __bind(this.activate, this);
    _ref = AllySelectedContext.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  AllySelectedContext.prototype._name = 'selected';

  AllySelectedContext.prototype.activate = function(entity) {
    var tile, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref1, _ref2, _ref3, _ref4, _ref5;
    this.entity = entity;
    this.ally_units = [];
    this.enemy_units = [];
    this.tiles = [];
    _ref1 = this.engine.entitiesByComponent('selectable');
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      entity = _ref1[_i];
      if (this.engine.getSystem('teams').isAlly(entity)) {
        this.ally_units.push(entity);
      }
      if (this.engine.getSystem('teams').isEnemy(entity)) {
        this.enemy_units.push(entity);
      }
    }
    _ref2 = this.engine.entitiesByComponent('tile');
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      tile = _ref2[_j];
      if (!this.engine.getSystem('hex_grid').occupied(tile.hex_position)) {
        this.tiles.push(tile);
      }
    }
    _ref3 = this.ally_units;
    for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
      entity = _ref3[_k];
      entity.on('click', this.onAllySelect);
    }
    _ref4 = this.enemy_units;
    for (_l = 0, _len3 = _ref4.length; _l < _len3; _l++) {
      entity = _ref4[_l];
      entity.on('click', this.onEnemySelect);
    }
    _ref5 = this.tiles;
    for (_m = 0, _len4 = _ref5.length; _m < _len4; _m++) {
      entity = _ref5[_m];
      entity.on('click', this.onTileSelect);
    }
    return this.engine.on('rightclick', this.onRightClick);
  };

  AllySelectedContext.prototype.deactivate = function() {
    var entity, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3, _results;
    _ref1 = this.ally_units;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      entity = _ref1[_i];
      entity.off('click', this.onAllySelect);
    }
    _ref2 = this.enemy_units;
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      entity = _ref2[_j];
      entity.off('click', this.onEnemySelect);
    }
    _ref3 = this.tiles;
    _results = [];
    for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
      entity = _ref3[_k];
      _results.push(entity.off('click', this.onTileSelect));
    }
    return _results;
  };

  AllySelectedContext.prototype.onRightClick = function() {
    this.engine.getSystem('selectables').deselect(this.entity);
    return this.engine.getSystem('input').setContext('select');
  };

  AllySelectedContext.prototype.onAllySelect = function(entity, event) {
    var selected;
    if (selected = this.engine.getSystem('selectables').toggle(entity)) {
      return this.engine.getSystem('input').setContext('selected', entity);
    } else {
      return this.engine.getSystem('input').setContext('select');
    }
  };

  AllySelectedContext.prototype.onEnemySelect = function(entity, event) {
    var command, path;
    if (!(path = this.engine.getSystem('pathing').path)) {
      return;
    }
    command = new MoveCommand({
      entity: this.entity,
      path: path
    });
    this.engine.getSystem('selectables').deselect(this.entity);
    this.engine.getSystem('command_queue').push(command);
    return this.engine.getSystem('input').setContext('select');
  };

  AllySelectedContext.prototype.onTileSelect = function(entity, event) {
    var command, path;
    if (!(path = this.engine.getSystem('pathing').path)) {
      return;
    }
    command = new MoveCommand({
      entity: this.entity,
      path: path
    });
    this.engine.getSystem('selectables').deselect(this.entity);
    this.engine.getSystem('command_queue').push(command);
    return this.engine.getSystem('input').setContext('select');
  };

  return AllySelectedContext;

})(Select);

});
require.register('src/lib/animation_utils', function(exports, require, module) {
var AnimationUtils, HIT_THRESHOLD, MIN_SPEED, tweene, _;

_ = require('lodash');

tweene = require('tween.js');

MIN_SPEED = 0.5;

HIT_THRESHOLD = 1;

module.exports = AnimationUtils = (function() {
  function AnimationUtils() {}

  AnimationUtils.reachedTarget = function(entity, target) {
    return Math.abs(entity.position.x - target.position.x) < HIT_THRESHOLD && Math.abs(entity.position.y - target.position.y) < HIT_THRESHOLD;
  };

  AnimationUtils.updatePosition = function(entity, target, speed) {
    var dx, dy;
    dx = (target.position.x - entity.position.x) * speed;
    dy = (target.position.y - entity.position.y) * speed;
    if (dx > 0 && dx < MIN_SPEED) {
      dx = MIN_SPEED;
    }
    if (dx < 0 && dx > -MIN_SPEED) {
      dx = -MIN_SPEED;
    }
    if (dy > 0 && dy < MIN_SPEED) {
      dy = MIN_SPEED;
    }
    if (dy < 0 && dy > -MIN_SPEED) {
      dy = -MIN_SPEED;
    }
    entity.position.x += dx;
    return entity.position.y += dy;
  };

  AnimationUtils.toTarget = function(engine, hex_position) {
    var pixel_coords;
    if (hex_position.position) {
      return hex_position;
    }
    pixel_coords = engine.getSystem('hex_grid').coordsToPixel(hex_position);
    return {
      position: pixel_coords,
      hex_position: hex_position
    };
  };

  return AnimationUtils;

}).call(this);

});
require.register('src/lib/effect_utils', function(exports, require, module) {
var DEFAULTS, EffectUtils, PIXI;

PIXI = require('pixi.js');

DEFAULTS = {
  OUTLINE_COLOUR: '#ffff55'
};

module.exports = EffectUtils = (function() {
  function EffectUtils() {}

  EffectUtils.initEffects = function(entity, component) {
    if (component.outline) {
      EffectUtils.createOutline(entity, component);
    }
    return entity;
  };

  EffectUtils.createOutline = function(entity, component) {
    component.display_object = new PIXI.Graphics();
    component.display_object.lineStyle(1, component.outline.colour || DEFAULTS.OUTLINE_COLOUR);
    component.display_object.drawCircle(0, 0, 35);
    component.display_object.endFill();
    component.display_object.position.x = 35;
    return component.display_object.position.y = 35;
  };

  EffectUtils.activate = function(entity, component) {
    if (component.outline) {
      return entity.view.display_object.addChild(component.display_object);
    } else if (component.texture) {
      component.previous_texture = entity.view.display_object.texture;
      return entity.view.display_object.texture = PIXI.Texture.fromImage(component.texture);
    }
  };

  EffectUtils.deactivate = function(entity, component) {
    if (component.outline) {
      return entity.view.display_object.removeChild(component.display_object);
    } else if (component.texture) {
      return entity.view.display_object.texture = component.previous_texture;
    }
  };

  return EffectUtils;

}).call(this);

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

  HexUtils.equal = function(p1, p2) {
    return (p1 != null ? p1.q : void 0) === (p2 != null ? p2.q : void 0) && (p1 != null ? p1.r : void 0) === (p2 != null ? p2.r : void 0);
  };

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
var HexUtils, MOVE_COST, Path, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

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
      if (HexUtils.equal(closing, this.goal)) {
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
        if (n.traversable || (this.end_traversable && HexUtils.equal(n, this.goal))) {
          adjacent.push(this._toNode(n));
        }
      }
    }
    return adjacent;
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
require.register('src/states/state', function(exports, require, module) {
var State;

module.exports = State = (function() {
  function State() {}

  State.prototype.init = function() {};

  State.prototype.preload = function() {};

  State.prototype.create = function() {};

  State.prototype.update = function() {};

  State.prototype.paused = function() {};

  State.prototype.shutdown = function() {};

  return State;

})();

});
require.register('src/states/state_manager', function(exports, require, module) {
var StateManager, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

module.exports = StateManager = (function() {
  function StateManager(options) {
    this._setCurrentState = __bind(this._setCurrentState, this);
    this.preUpdate = __bind(this.preUpdate, this);
    this.start = __bind(this.start, this);
    this.add = __bind(this.add, this);
    this.configure = __bind(this.configure, this);
    this.states = {};
    if (options) {
      this.configure(options);
    }
  }

  StateManager.prototype.configure = function(options) {
    var state, state_name, _ref, _results;
    if (options != null ? options.states : void 0) {
      _ref = options.states;
      _results = [];
      for (state_name in _ref) {
        state = _ref[state_name];
        _results.push(this.add(state_name, state));
      }
      return _results;
    }
  };

  StateManager.prototype.add = function(state_name, state) {
    return this.states[state_name] = state;
  };

  StateManager.prototype.start = function(state_name) {
    if (this.current_state_name === state_name) {
      return console.log("Hexxi.StateManager.Start: " + state_name + " is the currrent state");
    }
    if (this._pending_state_name === state_name) {
      return console.log("Hexxi.StateManager.Start: " + state_name + " is already pending");
    }
    if (!this.states[state_name]) {
      return console.error("Hexxi.StateManager.Start: " + state_name + " state does not exist (configure with options.states)");
    }
    return this._pending_state_name = state_name;
  };

  StateManager.prototype.preUpdate = function() {
    var _ref;
    if (!this._pending_state_name) {
      return;
    }
    if ((_ref = this.current_state) != null) {
      _ref.shutdown();
    }
    return this._setCurrentState(this._pending_state_name);
  };

  StateManager.prototype._setCurrentState = function(state_name) {
    this.current_state_name = state_name;
    this._pending_state_name = null;
    this.current_state = new this.states[state_name]();
    this.current_state.init();
    this.current_state.preload();
    return this.current_state.create();
  };

  return StateManager;

})();

});
require.register('src/systems/animations', function(exports, require, module) {
var AnimationSystem, HexPathAnimation, LinearAnimation, System, tweene, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

tweene = require('tween.js');

System = require('./system');

HexPathAnimation = require('../animations/hex_path');

LinearAnimation = require('../animations/linear');

module.exports = AnimationSystem = (function(_super) {
  __extends(AnimationSystem, _super);

  AnimationSystem.prototype._name = 'animations';

  function AnimationSystem() {
    this.addAnimation = __bind(this.addAnimation, this);
    this.animateHexPath = __bind(this.animateHexPath, this);
    this.animateLinear = __bind(this.animateLinear, this);
    this.update = __bind(this.update, this);
    this.preUpdate = __bind(this.preUpdate, this);
    this.onTweenComplete = __bind(this.onTweenComplete, this);
    this.onCancel = __bind(this.onCancel, this);
    this.onPause = __bind(this.onPause, this);
    this.onStart = __bind(this.onStart, this);
    this.onEntityDestroyed = __bind(this.onEntityDestroyed, this);
    this.onEntityCreated = __bind(this.onEntityCreated, this);
    AnimationSystem.__super__.constructor.apply(this, arguments);
    this.animations = [];
    this.pending_animations = [];
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

  AnimationSystem.prototype.preUpdate = function() {
    this.animations = this.pending_animations;
    return this.pending_animations = [];
  };

  AnimationSystem.prototype.update = function() {
    var animation, _i, _len, _ref, _results;
    tweene.update();
    if (this.animations.length) {
      _ref = this.animations;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        animation = _ref[_i];
        animation.update();
        if (!animation.complete) {
          _results.push(this.pending_animations.push(animation));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  };

  AnimationSystem.prototype.animateLinear = function(entity, target, callback) {
    return this.addAnimation(new LinearAnimation({
      entity: entity,
      target: target
    }), callback);
  };

  AnimationSystem.prototype.animateHexPath = function(entity, path, callback) {
    return this.addAnimation(new HexPathAnimation({
      entity: entity,
      path: path,
      callback: callback
    }));
  };

  AnimationSystem.prototype.addAnimation = function(animation, callback) {
    this.pending_animations.push(animation);
    return animation.entity.animations.add(animation, callback);
  };

  return AnimationSystem;

})(System);

});
require.register('src/systems/command_queue', function(exports, require, module) {
var CommandQueue, MultiplayerSystem, System,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
    MultiplayerSystem || (MultiplayerSystem = this.engine.getSystem('multiplayer'));
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
var Board, GridTile, HexGrid, HexUtils, Queue, System, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

Queue = require('queue-async');

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
    this.occupied = __bind(this.occupied, this);
    this.coordsToPixelOffset = __bind(this.coordsToPixelOffset, this);
    this.coordsToPixel = __bind(this.coordsToPixel, this);
    this.pixelToCoords = __bind(this.pixelToCoords, this);
    this.mouseEventCoords = __bind(this.mouseEventCoords, this);
    this.setScreenCoords = __bind(this.setScreenCoords, this);
    this.hexPathMove = __bind(this.hexPathMove, this);
    this.linearMove = __bind(this.linearMove, this);
    this.createTiles = __bind(this.createTiles, this);
    this.createBoard = __bind(this.createBoard, this);
    this.update = __bind(this.update, this);
    this.onClick = __bind(this.onClick, this);
    this.onMousemove = __bind(this.onMousemove, this);
    this.onEntityCreated = __bind(this.onEntityCreated, this);
    HexGrid.__super__.constructor.apply(this, arguments);
    _.defaults(this.options, {
      tile_entity: GridTile,
      symmetrical: true,
      tile_size: 36,
      rows: 8,
      columns: 8,
      z_index: -1000
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
  }

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
      entity.emit('mouseover', entity, event);
    }
    _ref1 = this.entitiesNotAtCoords(coords);
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      entity = _ref1[_j];
      if (!entity.hovering) {
        continue;
      }
      entity.hovering = false;
      _results.push(entity.emit('mouseout', entity, event));
    }
    return _results;
  };

  HexGrid.prototype.onClick = function(event) {
    var coords, entity, _i, _len, _ref, _results;
    coords = this.mouseEventCoords(event);
    _ref = this.entitiesAtCoords(coords);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entity = _ref[_i];
      _results.push(entity.emit('click', entity, event));
    }
    return _results;
  };

  HexGrid.prototype.update = function() {
    var entity, _i, _len, _ref, _results;
    _ref = this.engine.entitiesByComponent('hex_position');
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

  HexGrid.prototype.createBoard = function() {
    var tile, _i, _len, _ref;
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
    _ref = this.tiles;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tile = _ref[_i];
      this.engine.addEntity(tile);
    }
    document.addEventListener('mousemove', this.onMousemove);
    this.engine.on('click', this.onClick);
    this.engine.emit('hex_grid/board_created', this.board);
    return this.board;
  };

  HexGrid.prototype.createTiles = function() {
    var from, layer, q, r, tile, tiles, to, _i, _j, _ref, _ref1;
    tiles = [];
    layer = this.z_index;
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
    var _this = this;
    return this.engine.getSystem('animations').animateLinear(entity, to_position, function(err) {
      return callback(err, entity.hex_position.setAndEmit(to_position));
    });
  };

  HexGrid.prototype.hexPathMove = function(entity, path, callback) {
    var pos, queue, _fn, _i, _len, _ref,
      _this = this;
    if (!_.isArray(path)) {
      path = [path];
    }
    callback || (callback = function() {});
    queue = new Queue(1);
    _ref = path.reverse();
    _fn = function(pos) {
      return queue.defer(function(callback) {
        if (entity.hex_position.equals(pos)) {
          return callback();
        }
        return _this.linearMove(entity, pos, callback);
      });
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      pos = _ref[_i];
      _fn(pos);
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
    var _ref;
    if (r == null) {
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

  HexGrid.prototype.occupied = function(q, r) {
    var e;
    return ((function() {
      var _i, _len, _ref, _results;
      _ref = this.entitiesAtCoords(q, r);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (!e.hex_position.traversable) {
          _results.push(e);
        }
      }
      return _results;
    }).call(this)).length;
  };

  HexGrid.prototype.entitiesAtCoords = function(q, r) {
    var e, _i, _len, _ref, _ref1, _results;
    if (r == null) {
      _ref = q, q = _ref.q, r = _ref.r;
    }
    _ref1 = this.engine.entitiesByComponent('hex_position');
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
    if (r == null) {
      _ref = q, q = _ref.q, r = _ref.r;
    }
    _ref1 = this.engine.entitiesByComponent('hex_position');
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
    if (r == null) {
      _ref = q, q = _ref.q, r = _ref.r;
    }
    return _.find(this.engine.entitiesByComponent('tile'), function(test) {
      return test.hex_position.q === q && test.hex_position.r === r;
    });
  };

  return HexGrid;

})(System);

});
require.register('src/systems/highlights', function(exports, require, module) {
var EffectUtils, Highlightable, System, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

System = require('./system');

EffectUtils = require('../lib/effect_utils');

module.exports = Highlightable = (function(_super) {
  __extends(Highlightable, _super);

  function Highlightable() {
    this.onEndHighlight = __bind(this.onEndHighlight, this);
    this.onHighlight = __bind(this.onHighlight, this);
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
    EffectUtils.initEffects(entity, entity.highlight);
    entity.on('highlight/on', this.onHighlight);
    return entity.on('highlight/off', this.onEndHighlight);
  };

  Highlightable.prototype.onHighlight = function(entity) {
    if (entity.highlight.highlighting) {
      return;
    }
    entity.highlight.highlighting = true;
    return EffectUtils.activate(entity, entity.highlight);
  };

  Highlightable.prototype.onEndHighlight = function(entity) {
    if (!entity.highlight.highlighting) {
      return;
    }
    entity.highlight.highlighting = false;
    return EffectUtils.deactivate(entity, entity.highlight);
  };

  return Highlightable;

})(System);

});
require.register('src/systems/hover_effects', function(exports, require, module) {
var DEFAULTS, EffectUtils, HoverEffects, PIXI, System, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PIXI = require('pixi.js');

System = require('./system');

EffectUtils = require('../lib/effect_utils');

DEFAULTS = {
  COLOUR: '#ffffff'
};

module.exports = HoverEffects = (function(_super) {
  __extends(HoverEffects, _super);

  function HoverEffects() {
    this.onMouseout = __bind(this.onMouseout, this);
    this.onMouseover = __bind(this.onMouseover, this);
    this.onEntityCreated = __bind(this.onEntityCreated, this);
    _ref = HoverEffects.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HoverEffects.prototype.onEntityCreated = function(entity) {
    if (!entity.hasComponent('hover_effects')) {
      return;
    }
    EffectUtils.initEffects(entity, entity.hover_effects);
    entity.on('mouseover', this.onMouseover);
    return entity.on('mouseout', this.onMouseout);
  };

  HoverEffects.prototype.onMouseover = function(entity, event) {
    if (entity.hover_effects.hovering || this.engine.getSystem('teams').isEnemy(entity)) {
      return;
    }
    entity.hover_effects.hovering = true;
    return EffectUtils.activate(entity, entity.hover_effects);
  };

  HoverEffects.prototype.onMouseout = function(entity, event) {
    if (!entity.hover_effects.hovering) {
      return;
    }
    entity.hover_effects.hovering = false;
    return EffectUtils.deactivate(entity, entity.hover_effects);
  };

  return HoverEffects;

})(System);

});
require.register('src/systems/input', function(exports, require, module) {
var CONTEXTS, InputSystem, System,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

System = require('./system');

CONTEXTS = ['attack', 'select', 'selected'];

module.exports = InputSystem = (function(_super) {
  __extends(InputSystem, _super);

  InputSystem.prototype._name = 'input';

  function InputSystem(options, context_names) {
    this.context_names = context_names != null ? context_names : CONTEXTS;
    this.addContext = __bind(this.addContext, this);
    this.setContext = __bind(this.setContext, this);
    this.init = __bind(this.init, this);
    InputSystem.__super__.constructor.call(this, options);
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
    Context = this.engine.getInputContext(name);
    return this.contexts[name] = new Context();
  };

  return InputSystem;

})(System);

});
require.register('src/systems/multiplayer', function(exports, require, module) {
var MultiplayerSystem, System, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

System = require('./system');

module.exports = MultiplayerSystem = (function(_super) {
  __extends(MultiplayerSystem, _super);

  function MultiplayerSystem() {
    this.sendCommand = __bind(this.sendCommand, this);
    this.onCommand = __bind(this.onCommand, this);
    this.onAssignTeam = __bind(this.onAssignTeam, this);
    this.onGameStart = __bind(this.onGameStart, this);
    this.init = __bind(this.init, this);
    _ref = MultiplayerSystem.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  MultiplayerSystem.prototype._name = 'multiplayer';

  MultiplayerSystem.prototype.init = function() {
    this.enabled = false;
    return;
    MultiplayerSystem.__super__.init.apply(this, arguments);
    this.primus = new Primus(this.url);
    this.socket = this.primus.channel('clients');
    console.log(this.socket.id);
    this.engine.getSystem('users').setLocalUserId(this.socket.id);
    this.socket.on('command', this.onCommand);
    this.socket.on('team', this.onAssignTeam);
    this.socket.on('game_start', this.onGameStart);
    return this.id = this.socket.id;
  };

  MultiplayerSystem.prototype.onGameStart = function(data) {
    console.log('GAME STARTING!');
    this.engine.started = true;
    return this.engine.getSystem('teams').activate(data.team_id);
  };

  MultiplayerSystem.prototype.onAssignTeam = function(data) {
    console.log('got team', data);
    return this.engine.getSystem('teams').setLocalTeam(data.team_id);
  };

  MultiplayerSystem.prototype.onCommand = function(data) {
    var Command, command;
    console.log('server said: ', data);
    if (data.user_id === this.id) {
      return;
    }
    if (!(Command = this.engine.getCommand(data.command))) {
      console.error('Command not found: ', data.command);
    }
    command = new Command(data.data, {
      remote: true
    });
    return this.engine.getSystem('command_queue').push(command);
  };

  MultiplayerSystem.prototype.sendCommand = function(command) {
    if (!this.enabled) {
      return;
    }
    return this.socket.send('command', command.toJSON());
  };

  return MultiplayerSystem;

})(System);

});
require.register('src/systems/pathing', function(exports, require, module) {
var Path, Pathing, System, _, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

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
    if (this.pathing) {
      this.pathEnd(entity);
    }
    return this.pathStart(entity);
  };

  Pathing.prototype.onEntityDeselected = function(entity) {
    return this.pathEnd(entity);
  };

  Pathing.prototype.onTileClick = function(entity, event) {
    if (this.pathing) {
      return this.pathEnd(entity);
    }
  };

  Pathing.prototype.onTileHover = function(entity, event) {
    var path_finder;
    if (!this.pathing) {
      return;
    }
    this.hidePath();
    path_finder = new Path(this.map);
    this.path = path_finder.findPath(this.current.hex_position, entity.hex_position);
    return this.showPath();
  };

  Pathing.prototype.pathStart = function(entity) {
    var e, pos, positions, _i, _len, _ref1;
    this.map_entities = this.engine.entitiesByComponent('hex_position');
    positions = [];
    _ref1 = this.map_entities;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      e = _ref1[_i];
      e.on('mouseover', this.onTileHover);
      e.on('click', this.onTileClick);
      pos = _.pick(e.hex_position, 'q', 'r', 'traversable');
      if (this.engine.getSystem('teams').isEnemy(e)) {
        pos.traversable = true;
      }
      positions.push(pos);
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
        tile = this.engine.getSystem('hex_grid').getTile(coords);
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
        tile = this.engine.getSystem('hex_grid').getTile(coords);
        _results.push(tile.emit('highlight/on', tile));
      }
      return _results;
    }
  };

  return Pathing;

})(System);

});
require.register('src/systems/relations', function(exports, require, module) {
var Relations, System, _, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

System = require('./system');

module.exports = Relations = (function(_super) {
  __extends(Relations, _super);

  function Relations() {
    this.onEnterTile = __bind(this.onEnterTile, this);
    this.init = __bind(this.init, this);
    _ref = Relations.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Relations.prototype._name = 'relations';

  Relations.prototype.init = function() {
    Relations.__super__.init.apply(this, arguments);
    this.balls = [];
    return this.engine.on('enter_tile', this.onEnterTile);
  };

  Relations.prototype.onEnterTile = function(info) {
    var child, entity, position, _i, _len, _ref1, _ref2, _ref3, _results;
    entity = info.entity, position = info.position;
    if ((_ref1 = entity.relations) != null ? (_ref2 = _ref1.children) != null ? _ref2.length : void 0 : void 0) {
      _ref3 = entity.relations.children;
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        child = _ref3[_i];
        _results.push(child.hex_position.set(entity.hex_position));
      }
      return _results;
    }
  };

  return Relations;

})(System);

});
require.register('src/systems/renderer', function(exports, require, module) {
var PIXI, Renderer, System, View, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

PIXI = require('pixi.js');

System = require('./system');

View = require('../components/views/view');

module.exports = Renderer = (function(_super) {
  __extends(Renderer, _super);

  Renderer.prototype._name = 'renderer';

  function Renderer() {
    this.isView = __bind(this.isView, this);
    this.entityViews = __bind(this.entityViews, this);
    this.setTexture = __bind(this.setTexture, this);
    this.removeFromStage = __bind(this.removeFromStage, this);
    this.addToStage = __bind(this.addToStage, this);
    this.getStage = __bind(this.getStage, this);
    this.setStage = __bind(this.setStage, this);
    this.createDisplayObjects = __bind(this.createDisplayObjects, this);
    this.update = __bind(this.update, this);
    this.onParentChanged = __bind(this.onParentChanged, this);
    this.onEntityDestroyed = __bind(this.onEntityDestroyed, this);
    this.onEntityCreated = __bind(this.onEntityCreated, this);
    Renderer.__super__.constructor.apply(this, arguments);
    this.stage = new PIXI.Container();
    window.stage = this.stage;
    this.renderer = PIXI.autoDetectRenderer(800, 600);
    this.renderer.backgroundColor = 0xFFFFFF;
    this.view = this.renderer.view;
    document.body.appendChild(this.view);
  }

  Renderer.prototype.onEntityCreated = function(entity) {
    if (!this.entityViews(entity).length) {
      return;
    }
    Renderer.__super__.onEntityCreated.apply(this, arguments);
    this.createDisplayObjects(entity);
    this.setStage(entity);
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
    var entity, view, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3;
    _ref = this.engine.entitiesByComponent('view');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entity = _ref[_i];
      _ref1 = this.entityViews(entity);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        view = _ref1[_j];
        if (typeof view.update === "function") {
          view.update();
        }
        view.display_object.position.x = entity.position.x + (((_ref2 = view.offset) != null ? _ref2.x : void 0) || 0);
        view.display_object.position.y = entity.position.y + (((_ref3 = view.offset) != null ? _ref3.y : void 0) || 0);
      }
    }
    return this.renderer.render(this.stage);
  };

  Renderer.prototype.createDisplayObjects = function(entity) {
    var view, _i, _len, _ref, _results;
    _ref = this.entityViews(entity);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view = _ref[_i];
      _results.push(view.createDisplayObject());
    }
    return _results;
  };

  Renderer.prototype.setStage = function(entity) {
    var view, _i, _len, _ref, _results;
    _ref = this.entityViews(entity);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view = _ref[_i];
      this.removeFromStage(view);
      view.stage = this.getStage(entity, view);
      _results.push(this.addToStage(view));
    }
    return _results;
  };

  Renderer.prototype.getStage = function(entity, view) {
    var stage, stage_view, _ref, _ref1, _ref2;
    if (view != null ? view.parent : void 0) {
      if (_.isString(view.parent)) {
        stage_view = entity.getComponent(view.parent);
      } else {
        stage_view = view.parent;
      }
      if (!this.isView(stage_view)) {
        console.log('Hexxi.Renderer: Invalid parent view for', view);
      }
      if (!(stage = stage_view.display_object)) {
        console.log('Hexxi.Renderer: display_object missing from parent view for', view, 'parent', stage_view);
      }
    } else {
      stage = ((_ref = entity.relations) != null ? (_ref1 = _ref.parent) != null ? (_ref2 = _ref1.view) != null ? _ref2.display_object : void 0 : void 0 : void 0) || this.stage;
    }
    return stage;
  };

  Renderer.prototype.addToStage = function(view) {
    var stage;
    if (!(stage = view.stage)) {
      return;
    }
    if (stage.children.indexOf(view.display_object) >= 0) {
      return;
    }
    stage.addChild(view.display_object);
    return stage.children.sort(function(a, b) {
      return (a.z_index || 0) - (b.z_index || 0);
    });
  };

  Renderer.prototype.removeFromStage = function(view) {
    var stage;
    if (!((stage = view.stage) && stage.children.indexOf(view.display_object) >= 0)) {
      return false;
    }
    stage.removeChild(view.display_object);
    return true;
  };

  Renderer.prototype.setTexture = function(entity, texture) {
    entity.view.texture = texture;
    entity.view.pixi_texture = PIXI.Texture.fromImage(texture);
    return entity.view.display_object.texture = entity.view.pixi_texture;
  };

  Renderer.prototype.entityViews = function(entity) {
    var component, name, _ref, _results;
    _ref = entity.components;
    _results = [];
    for (name in _ref) {
      component = _ref[name];
      if (this.isView(component)) {
        _results.push(component);
      }
    }
    return _results;
  };

  Renderer.prototype.isView = function(component) {
    return component._view || component instanceof View;
  };

  return Renderer;

})(System);

});
require.register('src/systems/selectables', function(exports, require, module) {
var Selectables, System, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

System = require('./system');

module.exports = Selectables = (function(_super) {
  __extends(Selectables, _super);

  function Selectables() {
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
    return entity.getComponent('selectable') && this.engine.getSystem('teams').isAlly(entity);
  };

  return Selectables;

})(System);

});
require.register('src/systems/system', function(exports, require, module) {
var System, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

module.exports = System = (function() {
  function System(options) {
    var key, value, _ref;
    this.options = options != null ? options : {};
    this.entityById = __bind(this.entityById, this);
    this.onEntityDestroyed = __bind(this.onEntityDestroyed, this);
    this.onEntityCreated = __bind(this.onEntityCreated, this);
    this.init = __bind(this.init, this);
    _ref = this.options;
    for (key in _ref) {
      value = _ref[key];
      this[key] = value;
    }
    this.engine || (this.engine = require('../engine'));
  }

  System.prototype.init = function() {
    var entity, _i, _len, _ref;
    this.entities = [];
    _ref = this.engine.entities;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entity = _ref[_i];
      this.onEntityCreated(entity);
    }
    this.engine.on('entity/created', this.onEntityCreated);
    return this.engine.on('entity/destroyed', this.onEntityDestroyed);
  };

  System.prototype.update = function() {};

  System.prototype.onEntityCreated = function(entity) {};

  System.prototype.onEntityDestroyed = function(entity) {};

  System.prototype.entityById = function(id) {
    return _.find(this.entities, function(e) {
      return e.id === id;
    });
  };

  return System;

})();

});
require.register('src/systems/teams', function(exports, require, module) {
var System, TeamsSystem, _, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

System = require('./system');

module.exports = TeamsSystem = (function(_super) {
  __extends(TeamsSystem, _super);

  function TeamsSystem() {
    this.isEnemy = __bind(this.isEnemy, this);
    this.isAlly = __bind(this.isAlly, this);
    this.localTeam = __bind(this.localTeam, this);
    this.localIsActive = __bind(this.localIsActive, this);
    this.activeUserId = __bind(this.activeUserId, this);
    this.activeTeam = __bind(this.activeTeam, this);
    this.createTurnOrder = __bind(this.createTurnOrder, this);
    this.activate = __bind(this.activate, this);
    this.nextTeam = __bind(this.nextTeam, this);
    this.setLocalTeam = __bind(this.setLocalTeam, this);
    this.startingTeam = __bind(this.startingTeam, this);
    this.next = __bind(this.next, this);
    this.onEntityCreated = __bind(this.onEntityCreated, this);
    this.init = __bind(this.init, this);
    _ref = TeamsSystem.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  TeamsSystem.prototype._name = 'teams';

  TeamsSystem.prototype.init = function() {
    TeamsSystem.__super__.init.apply(this, arguments);
    return window.teams = this;
  };

  TeamsSystem.prototype.onEntityCreated = function(entity) {
    if (!entity.hasComponent('team')) {
      return;
    }
    this.entities.push(entity);
    return this.createTurnOrder();
  };

  TeamsSystem.prototype.next = function() {
    return this.activate(this.nextTeam());
  };

  TeamsSystem.prototype.startingTeam = function() {
    return this.ordered_teams[0];
  };

  TeamsSystem.prototype.setLocalTeam = function(team_id) {
    var team, user_id, _ref1;
    user_id = (_ref1 = this.engine.getSystem('users').localUser()) != null ? _ref1.id : void 0;
    console.log('You are player', team_id);
    team = this.entities[--team_id];
    return team.user_id = user_id;
  };

  TeamsSystem.prototype.nextTeam = function() {
    var next_index, _ref1;
    if (!this.ordered_teams) {
      return;
    }
    next_index = this.activeTeam() ? ((_ref1 = this.activeTeam()) != null ? _ref1.team.turn_index : void 0) + 1 : 0;
    if (!next_index || next_index >= this.ordered_teams.length) {
      next_index = 0;
    }
    return this.ordered_teams[next_index];
  };

  TeamsSystem.prototype.activate = function(team) {
    var _ref1;
    console.log('activating team', team);
    if (!team.id) {
      team = this.entityById(team);
    }
    if (!team.hasComponent('team')) {
      console.error('TeamsSystem: Attempting to activate an entity without a team component', entity);
    }
    if ((_ref1 = this.activeTeam()) != null) {
      _ref1.team.active = false;
    }
    this.active_team = team;
    return console.log('Activated team', team.id);
  };

  TeamsSystem.prototype.createTurnOrder = function() {
    var i, t, _i, _len, _ref1, _results;
    this.ordered_teams = this.entities;
    i = 0;
    _ref1 = this.ordered_teams;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      t = _ref1[_i];
      _results.push(t.team.turn_index = i++);
    }
    return _results;
  };

  TeamsSystem.prototype.activeTeam = function() {
    return this.active_team;
  };

  TeamsSystem.prototype.activeUserId = function() {
    var _ref1;
    return (_ref1 = this.active_team) != null ? _ref1.user_id : void 0;
  };

  TeamsSystem.prototype.localIsActive = function() {
    var _ref1, _ref2;
    return ((_ref1 = this.localTeam()) != null ? _ref1.id : void 0) === ((_ref2 = this.activeTeam()) != null ? _ref2.id : void 0);
  };

  TeamsSystem.prototype.localTeam = function() {
    var _this = this;
    return _.find(this.entities, function(t) {
      var _ref1;
      return t.user_id === ((_ref1 = _this.engine.getSystem('users').localUser()) != null ? _ref1.id : void 0);
    });
  };

  TeamsSystem.prototype.isAlly = function(entity) {
    var _ref1, _ref2;
    return ((_ref1 = this.localTeam()) != null ? _ref1.id : void 0) === ((_ref2 = entity.team_membership) != null ? _ref2.team_id : void 0);
  };

  TeamsSystem.prototype.isEnemy = function(entity) {
    var _ref1, _ref2;
    return ((_ref1 = this.localTeam()) != null ? _ref1.id : void 0) !== ((_ref2 = entity.team_membership) != null ? _ref2.team_id : void 0);
  };

  return TeamsSystem;

})(System);

});
require.register('src/systems/users', function(exports, require, module) {
var System, User, Users, _, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

System = require('./system');

User = require('../entities/user');

module.exports = Users = (function(_super) {
  __extends(Users, _super);

  function Users() {
    this.setLocalUserId = __bind(this.setLocalUserId, this);
    this.localUser = __bind(this.localUser, this);
    this.onEntityCreated = __bind(this.onEntityCreated, this);
    this.init = __bind(this.init, this);
    _ref = Users.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Users.prototype._name = 'users';

  Users.prototype.init = function() {
    return this.default_user || (this.default_user = new User({
      id: 1,
      is_local: true
    }));
  };

  Users.prototype.onEntityCreated = function(entity) {
    if (!entity.hasComponent('user')) {
      return;
    }
    return Users.__super__.onEntityCreated.apply(this, arguments);
  };

  Users.prototype.localUser = function() {
    var _this = this;
    return _.find(this.entities, function(u) {
      return u.user.is_local;
    });
  };

  Users.prototype.setLocalUserId = function(id) {
    return this.localUser.id = id;
  };

  return Users;

})(System);

});
require.register('src/components/views/circle', function(exports, require, module) {
var Circle, Component, PIXI, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./../component');

PIXI = require('pixi.js');

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
    this.entity.emit('view/display_object_created');
    return this.display_object;
  };

  return Circle;

})(Component);

});
require.register('src/components/views/sprite', function(exports, require, module) {
var PIXI, Sprite, View, _, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

View = require('./view');

PIXI = require('pixi.js');

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
    if (this.anchor) {
      _.extend(this.display_object.anchor, this.anchor);
    }
    if (this.scale) {
      if (_.isNumber(this.scale)) {
        this.scale = {
          x: this.scale,
          y: this.scale
        };
      }
      _.extend(this.display_object.scale, this.scale);
    }
    if (this.z_index) {
      this.display_object.z_index = this.z_index;
    }
    this.entity.emit('view/display_object_created');
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

_ = require('lodash');

View = require('./view');

PIXI = require('pixi.js');

module.exports = TextView = (function(_super) {
  __extends(TextView, _super);

  TextView.prototype._name = 'text';

  function TextView(entity, options) {
    this.entity = entity;
    this.update = __bind(this.update, this);
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
    this.entity.emit('view/display_object_created');
    return this.display_object;
  };

  TextView.prototype.update = function() {
    var _ref;
    return (_ref = this.display_object) != null ? _ref.text = this.entity.toString() : void 0;
  };

  return TextView;

})(View);

});
require.register('src/components/views/view', function(exports, require, module) {
var Component, PIXI, View, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PIXI = require('pixi.js');

Component = require('../component');

module.exports = View = (function(_super) {
  __extends(View, _super);

  function View() {
    this.destroy = __bind(this.destroy, this);
    this.hide = __bind(this.hide, this);
    this.show = __bind(this.show, this);
    _ref = View.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  View.prototype._name = 'view';

  View.prototype._view = true;

  View.prototype.createDisplayObject = function() {
    this.display_object = new PIXI.Container();
    this.display_object.z_index = this.z_index || 0;
    this.entity.emit('view/display_object_created');
    return this.display_object;
  };

  View.prototype.show = function() {
    var _ref1;
    this.visible = true;
    return (_ref1 = this.display_object) != null ? _ref1.visible = true : void 0;
  };

  View.prototype.hide = function() {
    var _ref1;
    this.visible = false;
    return (_ref1 = this.display_object) != null ? _ref1.visible = false : void 0;
  };

  View.prototype.destroy = function() {
    return this.engine.getSystem('renderer').removeFromStage(this.entity);
  };

  return View;

})(Component);

});;