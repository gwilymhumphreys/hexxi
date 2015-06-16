Component = require './../component'
PIXI = require 'pixi.js'

module.exports = class Circle extends Component
  _name: 'circle'

  createDisplayObject: =>
    @display_object = new PIXI.Graphics()
    @display_object.beginFill(0xFFFF00)
    @display_object.lineStyle(5, 0xFF0000)
    @display_object.drawCircle(100, 100, 5)
    @entity.emit('view/display_object_created')
    return @display_object
