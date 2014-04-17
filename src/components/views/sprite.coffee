_ = require 'underscore'
View = require './view'
PIXI = require 'pixi'

module.exports = class Sprite extends View
  _name: 'sprite'

  createDisplayObject: =>
    return new Error 'Sprite missing texture' unless @texture
    @pixi_texture = PIXI.Texture.fromImage(@texture)
    @display_object = new PIXI.Sprite(@pixi_texture)
    if @anchor
      @display_object.anchor.x = @anchor.x
      @display_object.anchor.y = @anchor.y
    if @scale
      @scale = {x: @scale, y: @scale} if _.isNumber(@scale)
      console.log 'scaling', @scale
      @display_object.scale = @scale
    @display_object.z_index = @z_index if @z_index
    return @display_object
