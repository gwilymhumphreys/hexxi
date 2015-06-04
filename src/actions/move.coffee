_ = require 'underscore'
Action = require './action'
Engine = require '../lib/engine'
tweene = require 'tween'

HIT_THRESHOLD = 0.01

module.exports = class Move extends Action

  constructor: ->
    super
    @init()

  init: =>
    throw new Error 'Move action missing entity' unless @entity
    throw new Error 'Move action missing path' unless @path
    @speed = 0.2

  update: =>
    @_endOrNext()
    return if @complete
    @_updatePosition(@entity, @target)

  _endOrNext: =>
    if not @complete and not @target or @_reachedTarget()
      if target = @path.pop()
        from = @target
        @target = @_toTarget(target)
        Engine.emit('enter_tile', @entity, @target.hex_position, {from: from?.hex_position})
      else
        @complete = true

  _reachedTarget: =>
    Math.abs(@entity.position.x - @target.position.x) < HIT_THRESHOLD and Math.abs(@entity.position.y - @target.position.y) < HIT_THRESHOLD

  _updatePosition: (entity, target) =>
    dx = (target.position.x - entity.position.x) * @speed
    dy = (target.position.y - entity.position.y) * @speed
    entity.position.x += dx
    entity.position.y += dy

  _toTarget: (hex_position) =>
    # TODO: see if more robustness needed
    return hex_position if hex_position.position
    pixel_coords = Engine.getSystem('hex_grid').coordsToPixel(hex_position)
    return {
      position: pixel_coords
      hex_position: hex_position
    }
