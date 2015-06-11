_ = require 'lodash'
Animation = require './animation'
tweene = require 'tween'

module.exports = class DirectAnimation extends Animation

  init: ->
    throw new Error 'DirectMove animation missing entity' unless @entity
    throw new Error 'DirectMove animation missing target' unless @target
#    @target = @_toTarget(@target)
#    @speed = 0.01
#
#  update: =>
#    if @complete = @_reachedTarget()
#      @engine.emit('enter_tile', @entity, @target.hex_position, {from: @entity.hex_position})
#      return
#    @_updatePosition(@entity, @target)
