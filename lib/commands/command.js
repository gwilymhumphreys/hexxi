// Generated by CoffeeScript 1.9.3
(function() {
  var Command, _,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('lodash');

  module.exports = Command = (function() {
    function Command(data1, options) {
      this.data = data1;
      this.options = options != null ? options : {};
      this.toJSON = bind(this.toJSON, this);
      this.set = bind(this.set, this);
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

}).call(this);
