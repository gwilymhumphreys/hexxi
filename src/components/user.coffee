Component = require './component'

module.exports = class User extends Component
  _name: 'user'

  constructor: (@entity, options) ->
    super
    @teams or= []
    @is_local ?= true

  team: => @teams?[0]
