Component = require '../component'

module.exports = class View extends Component
  _name: 'view'

  createDisplayObject: ->
    @display_object = new PIXI.DisplayObjectContainer()
    return @display_object

#  set: (key, value) ->
#    @[key] = value
#    return unless @display_object
#    @display_object[key] = value
#    console.log key, value, @
