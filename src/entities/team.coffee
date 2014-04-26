Entity = require './entity'

module.exports = class Team extends Entity
  _name: 'team'

  constructor: (attrs) ->
    super
    @addComponent('team')

  toString: =>
    s = "q: #{@q}"
#    s += ", x: #{@x.toFixed(2)}"
    s += "\nr: #{@r}"
#    s += ", y: #{@y}"
    return s
