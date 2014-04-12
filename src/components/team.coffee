Component = require './component'

module.exports = class Team extends Component
  _name: 'team'

  constructor: (@entity, options) ->
    super
    @players or= []
