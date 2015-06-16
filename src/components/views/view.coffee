PIXI = require 'pixi.js'
Component = require '../component'

module.exports = class View extends Component
  _name: 'view'

  createDisplayObject: ->
    @display_object = new PIXI.DisplayObjectContainer()
    @entity.emit('view/display_object_created')
    return @display_object

  show: =>
    @visible = true
    @display_object?.visible = true

  hide: =>
    @visible = false
    @display_object?.visible = false

  destroy: =>
    @engine.getSystem('renderer').removeFromStage(@entity)

#  set: (key, value) ->
#    @[key] = value
#    return unless @display_object
#    @display_object[key] = value
#    console.log key, value, @
