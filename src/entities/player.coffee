Entity = require './entity'

module.exports = class Player extends Entity
  _name: 'Player'

  constructor: ->
    super
    @options.view or= {texture: 'assets/tiles/alienGreen.png'}
#    @selected_texture or= 'assets/tiles/alienGreen.png'
#    @hover_texture or= 'assets/tiles/alienBlue.png'
    @addComponent('hex_position')
    @addComponent('view', 'views/sprite')
    @addComponent('sub_view', 'views/text')
    @addComponent('position')
    @addComponent('relations')
    @addComponent('hover_effects', {outline: {colour: 0xdddd77}})
    @addComponent('selectable')
    @addComponent('pathable')
    @addComponent('player')

  toString: => @name
