_ = require 'underscore'
Engine = require '../engine/engine'
Move = require './move'
tweene = require 'tween'

module.exports = class DirectMove extends Move

  init: ->
    throw new Error 'DirectMove action missing entity' unless @entity
    throw new Error 'DirectMove action missing target' unless @target
    @target = @_toTarget(@target)
    @speed = 0.01

  update: =>
    if @complete = @_reachedTarget()
      Engine.emit('enter_tile', @entity, @target.hex_position, {from: @entity.hex_position})
      return
    @_updatePosition(@entity, @target)
