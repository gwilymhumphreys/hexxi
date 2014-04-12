Entity = require './entity'

module.exports = class GridTile extends Entity
  _name: 'GridTile'

  constructor: ->
    super
    @text_anchor = {x: 0, y: 0}
    @text_position = {x: 0, y: 0}
    @text_format = {font: 'regular 8px Arial', fill: '#ffffff'}
    @selected_texture = 'assets/tiles/tileWater_full.png'
    @hover_texture = 'assets/tiles/tileMagic_full.png'
    @addComponent('hex_position')
    @addComponent('view', 'views/sprite', {texture: 'assets/tiles/tileGrass_full.png'})
    @addComponent('sub_view', 'views/text')
    @addComponent('position')
    @addComponent('relations')
    @addComponent('hover_effects', {outline: {colour: 0xffffff}})
    @addComponent('highlight')
    @addComponent('tile')
#    @addComponent('clickable')
#    @addComponent('selectable')

  toString: =>
    s = "q: #{@q}"
#    s += ", x: #{@x.toFixed(2)}"
    s += "\nr: #{@r}"
#    s += ", y: #{@y.toFixed(2)}"
    return s
