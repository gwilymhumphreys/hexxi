System = require './system'
HexPathAnimation = require '../animations/hex_path'
tweene = require 'tween'

module.exports = class AnimationSystem extends System
  _name: 'animations'

  constructor: ->
    super
    @animations = []
    @pending_animations = []

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

  preUpdate: =>
    @animations = @pending_animations
    @pending_animations = []

  update: =>
    tweene.update()
    if @animations.length
#      running_animations = []
      for animation in @animations
        animation.update()
#        running_animations.push(animation) unless animation.complete
        @pending_animations.push(animation) unless animation.complete

  animateHexPath: (entity, path, callback) =>
    @addAnimation(new HexPathAnimation({entity, path}))
    console.log 'added', path
    console.log 'animations', @animations

  addAnimation: (animation) => @pending_animations.push(animation)
