Entity = require './entity'

module.exports = class Unit extends Entity
  _name: 'unit'

  constructor: ->
    super
    @options.view or= {texture: 'assets/tiles/alienGreen.png'}
#    @selected_texture or= 'assets/tiles/alienGreen.png'
#    @hover_texture or= 'assets/tiles/alienBlue.png'
    @addComponent('hex_position')
    @addComponent('view', 'sprite')
    @addComponent('sub_view', 'text')
    @addComponent('position')
    @addComponent('relations')
    @addComponent('hover_effects', {outline: {colour: 0xdddd77}})
    @addComponent('selectable')
    @addComponent('pathable')
    @addComponent('team_membership')
    @addComponent('animations')

  toString: => @name
