Component = require '../component'

module.exports = class View extends Component
  _name: 'view'

  createDisplayObject: ->
    @display_object = new PIXI.DisplayObjectContainer()
    return @display_object
