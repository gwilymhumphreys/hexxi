Entity = require './entity'

module.exports = class GridTile extends Entity
  _name: 'grid_tile'

  constructor: ->
    super
    @text_anchor = {x: 0, y: 0}
    @text_position = {x: 0, y: 0}
    @text_format = {font: 'regular 8px Arial', fill: '#ffffff'}
    @selected_texture = 'assets/tiles/tileWater_full.png'
    @hover_texture = 'assets/tiles/tileMagic_full.png'
    @addComponent('hex_position')
    @addComponent('view', 'sprite', {z_index: -100, texture: 'assets/tiles/tileGrass.png'})
#    @addComponent('sub_view', 'text')
    @addComponent('position')
    @addComponent('relations')
#    @addComponent('hover_effects', {outline: {colour: 0xffffff}})
    @addComponent('hover_effects')
    @addComponent('highlight', {texture: @hover_texture})
    @addComponent('tile')
#    @addComponent('clickable')
#    @addComponent('selectable')
