Entity = require './entity'

module.exports = class Board extends Entity
  _name: 'board'

  constructor: ->
    super
    @addComponent('position')
    @addComponent('hex_grid')
    @addComponent('view', 'views/view')
    @addComponent('relations')
    window.board = @

  toString: -> ['Board: ', @x, @y]
