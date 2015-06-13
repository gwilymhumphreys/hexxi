Component = require './component'

module.exports = class Animations extends Component
  _name: 'animations'

  constructor: ->
    super
    @tweens or= {}
    @animations = []

  isAnimating: => @animations.length > 0

  add: (animation) => @animations.push(animation)

  remove: (animation) => @animations = _.without(@animations, animation)
