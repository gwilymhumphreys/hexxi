Entity = require './entity'

module.exports = class Team extends Entity
  _name: 'team'

  constructor: ->
    super
    @addComponent('team')
