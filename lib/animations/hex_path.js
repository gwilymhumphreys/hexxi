// Generated by CoffeeScript 1.9.3
(function() {
  var Animation, AnimationUtils, HexPathAnimation, _,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require('lodash');

  Animation = require('./animation');

  AnimationUtils = require('../lib/animation_utils');

  module.exports = HexPathAnimation = (function(superClass) {
    extend(HexPathAnimation, superClass);

    function HexPathAnimation() {
      this._endOrNext = bind(this._endOrNext, this);
      this.update = bind(this.update, this);
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

}).call(this);
