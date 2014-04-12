Component = require './component'

module.exports = class Animations extends Component
  _name: 'animations'

  constructor: ->
    super
    @tweens or= {}
