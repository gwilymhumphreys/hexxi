Entity = require './entity'

module.exports = class Board extends Entity
  _name: 'Board'

  constructor: ->
    super
    @addComponent('position')
    @addComponent('hex_grid')
    @addComponent('view', 'views/view')
    @addComponent('relations')
#    @addComponent('hoverable')
#    @addComponent('clickable')
#    @addComponent('pathable')
#    @addComponent('text')
    window.board = @

  init: =>
    super

  toString: -> ['Board: ', @x, @y]
