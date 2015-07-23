PIXI = require 'pixi.js'
Component = require '../component'

module.exports = class View extends Component
  _name: 'view'
  _view: true

  createDisplayObject: ->
    @display_object = new PIXI.Container()
    @display_object.z_index = @z_index or 0
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
