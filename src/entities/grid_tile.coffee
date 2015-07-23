Entity = require './entity'

module.exports = class GridTile extends Entity
  _name: 'grid_tile'

  constructor: ->
    super
    @selected_texture = 'assets/tiles/tileWater_full.png'
    @hover_texture = 'assets/tiles/tileMagic_full.png'
    @addComponent('hex_position')
    @addComponent('view', 'sprite', {texture: 'assets/tiles/tileGrass.png'})
    @addComponent('sub_view', 'text', {text_position: {x: 40, y: 20}})
    @addComponent('position')
    @addComponent('relations')
#    @addComponent('hover_effects', {outline: {colour: 0xffffff}})
    @addComponent('hover_effects')
    @addComponent('highlight', {texture: @hover_texture})
    @addComponent('tile')
#    @addComponent('clickable')
#    @addComponent('selectable')

  toString: => "#{@hex_position.q} #{@hex_position.r}"
