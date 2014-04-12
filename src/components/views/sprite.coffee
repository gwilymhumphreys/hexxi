View = require './view'
PIXI = require 'pixi'

module.exports = class Sprite extends View
  _name: 'sprite'

  createDisplayObject: =>
    return new Error 'Sprite missing texture' unless @texture
    @pixi_texture = PIXI.Texture.fromImage(@texture)
    @display_object = new PIXI.Sprite(@pixi_texture)
#    @view.anchor.x = 0.5
#    @view.anchor.y = 0.5
    return @display_object
