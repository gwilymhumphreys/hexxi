_ = require 'lodash'
View = require './view'
PIXI = require 'pixi.js'

module.exports = class TextView extends View
  _name: 'text'

  constructor: (@entity, options) ->
    super
    @text_anchor or= {x: 0.5, y: 0}
    @text_position or= {x: 20, y: 50}
    @text_format or= {font: 'regular 8px Arial'}

  createDisplayObject: =>
    @display_object = new PIXI.Text(@entity.toString(), @text_format)
    @display_object.anchor.x = @text_anchor.x
    @display_object.anchor.y = @text_anchor.y
    @display_object.position.x = @text_position.x
    @display_object.position.y = @text_position.y
    @entity.emit('view/display_object_created')
    return @display_object

  update: => @display_object?.text = @entity.toString()
