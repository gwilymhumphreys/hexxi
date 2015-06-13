_ = require 'lodash'
Animation = require './animation'
AnimationUtils = require '../lib/animation_utils'

module.exports = class HexPathAnimation extends Animation

  constructor: ->
    super
    throw new Error 'HexPathAnimation missing entity' unless @entity
    throw new Error 'HexPathAnimation missing path' unless @path
    @path = [@path] unless _.isArray(@path)
    @speed = 0.2

  update: =>
    @_endOrNext()
    return if @complete
    AnimationUtils.updatePosition(@entity, @target, @speed)

  _endOrNext: =>
    if not @complete and not @target or AnimationUtils.reachedTarget(@entity, @target)
      if target = @path.pop()
        from = @target
        @target = AnimationUtils.toTarget(@engine, target)
        @emit('complete', @)# @entity, @target.hex_position, {from: @entity.hex_position})
      else
        @complete = true
