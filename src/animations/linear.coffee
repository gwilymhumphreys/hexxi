_ = require 'lodash'
tweene = require 'tween.js'
Animation = require './animation'
AnimationUtils = require '../lib/animation_utils'

module.exports = class LinearAnimation extends Animation

  constructor: ->
    super
    throw new Error 'LinearAnimation missing entity' unless @entity
    throw new Error 'LinearAnimation missing target' unless @target
    @target = AnimationUtils.toTarget(@engine, @target)
    @speed = 0.2

  update: =>
    if @complete = AnimationUtils.reachedTarget(@entity, @target)
      @emit('complete', @)
      return
    AnimationUtils.updatePosition(@entity, @target, @speed)
