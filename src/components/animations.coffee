Component = require './component'

module.exports = class Animations extends Component
  _name: 'animations'

  constructor: ->
    super
    @tweens or= {}
    @animations = []

  isAnimating: => @animations.length > 0

  add: (animation, callback) =>
    @animations.push(animation)
    if callback
      animation.once 'complete', => @onAnimationComplete(animation, callback)

  onAnimationComplete: (animation, callback) =>
    @remove(animation)
    callback()
    if @animations.length is 0
      @entity.emit 'animations_complete'

  remove: (animation) => @animations = _.without(@animations, animation)
