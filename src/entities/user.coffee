Entity = require './entity'

module.exports = class User extends Entity
  _name: 'user'

  constructor: ->
    super
    @addComponent('user')
