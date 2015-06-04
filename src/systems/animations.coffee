Engine = require '../lib/engine'
System = require './system'
tweene = require 'tween'

module.exports = class AnimationSystem extends System
  _name: 'animations'

  constructor: ->

  onEntityCreated: (entity) =>
    return unless entity.hasComponent('animations')
    super
    entity.on 'animation/start', @onStart
    entity.on 'animation/pause', @onPause
    entity.on 'animation/cancel', @onCancel

  onEntityDestroyed: (entity) =>
    super
    entity.off 'animation/start', @onStart
    entity.off 'animation/pause', @onPause
    entity.off 'animation/cancel', @onCancel

  onStart: (entity, tween) =>
    tween.onComplete @onTweenComplete
    entity.animations.tweens.push(tween)
    tween.start()

  onPause: (entity, tween) =>
    if tween
      tween.stop()
    else
      tween.stop() for tween in entity.animations.tweens

  onCancel: (entity, tween) =>
    if tween
      tween.cancel()
    else
      tween.cancel() for tween in entity.animations.tweens

  onTweenComplete: =>

  update: =>
    tweene.update()
