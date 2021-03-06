// Generated by CoffeeScript 1.9.3
(function() {
  var Animations, Component,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Component = require('./component');

  module.exports = Animations = (function(superClass) {
    extend(Animations, superClass);

    Animations.prototype._name = 'animations';

    function Animations() {
      this.remove = bind(this.remove, this);
      this.onAnimationComplete = bind(this.onAnimationComplete, this);
      this.add = bind(this.add, this);
      this.isAnimating = bind(this.isAnimating, this);
      Animations.__super__.constructor.apply(this, arguments);
      this.tweens || (this.tweens = {});
      this.animations = [];
    }

    Animations.prototype.isAnimating = function() {
      return this.animations.length > 0;
    };

    Animations.prototype.add = function(animation, callback) {
      this.animations.push(animation);
      if (callback) {
        return animation.once('complete', (function(_this) {
          return function() {
            return _this.onAnimationComplete(animation, callback);
          };
        })(this));
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

}).call(this);
