// Generated by CoffeeScript 1.9.3
(function() {
  var CommandQueue, MultiplayerSystem, System,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  System = require('./system');

  MultiplayerSystem = null;

  module.exports = CommandQueue = (function(superClass) {
    extend(CommandQueue, superClass);

    CommandQueue.prototype._name = 'command_queue';

    function CommandQueue() {
      this.update = bind(this.update, this);
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

}).call(this);
