_ = require 'lodash'
View = require './view'
PIXI = require 'pixi.js'

module.exports = class Sprite extends View
  _name: 'sprite'

  createDisplayObject: =>
    return new Error 'Sprite missing texture' unless @texture
    @pixi_texture = PIXI.Texture.fromImage(@texture)
    @display_object = new PIXI.Sprite(@pixi_texture)
    if @anchor
      _.extend(@display_object.anchor, @anchor)
    if @scale
      @scale = {x: @scale, y: @scale} if _.isNumber(@scale)
      _.extend(@display_object.scale, @scale)
    @display_object.z_index = @z_index if @z_index
    @entity.emit('view/display_object_created')
    return @display_object
