// Generated by CoffeeScript 1.9.3
(function() {
  var AnimationSystem, HexPathAnimation, LinearAnimation, System, _, tweene,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require('lodash');

  tweene = require('tween.js');

  System = require('./system');

  HexPathAnimation = require('../animations/hex_path');

  LinearAnimation = require('../animations/linear');

  module.exports = AnimationSystem = (function(superClass) {
    extend(AnimationSystem, superClass);

    AnimationSystem.prototype._name = 'animations';

    function AnimationSystem() {
      this.addAnimation = bind(this.addAnimation, this);
      this.animateHexPath = bind(this.animateHexPath, this);
      this.animateLinear = bind(this.animateLinear, this);
      this.update = bind(this.update, this);
      this.preUpdate = bind(this.preUpdate, this);
      this.onTweenComplete = bind(this.onTweenComplete, this);
      this.onCancel = bind(this.onCancel, this);
      this.onPause = bind(this.onPause, this);
      this.onStart = bind(this.onStart, this);
      this.onEntityDestroyed = bind(this.onEntityDestroyed, this);
      this.onEntityCreated = bind(this.onEntityCreated, this);
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
      var i, len, ref, results;
      if (tween) {
        return tween.stop();
      } else {
        ref = entity.animations.tweens;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          tween = ref[i];
          results.push(tween.stop());
        }
        return results;
      }
    };

    AnimationSystem.prototype.onCancel = function(entity, tween) {
      var i, len, ref, results;
      if (tween) {
        return tween.cancel();
      } else {
        ref = entity.animations.tweens;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          tween = ref[i];
          results.push(tween.cancel());
        }
        return results;
      }
    };

    AnimationSystem.prototype.onTweenComplete = function() {};

    AnimationSystem.prototype.preUpdate = function() {
      this.animations = this.pending_animations;
      return this.pending_animations = [];
    };

    AnimationSystem.prototype.update = function() {
      var animation, i, len, ref, results;
      tweene.update();
      if (this.animations.length) {
        ref = this.animations;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          animation = ref[i];
          animation.update();
          if (!animation.complete) {
            results.push(this.pending_animations.push(animation));
          } else {
            results.push(void 0);
          }
        }
        return results;
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

}).call(this);
