Engine = require '../engine/engine'
System = require './system'

DEFAULTS =
  COLOUR: '#ffff55'

module.exports = class Highlightable extends System
  _name: 'highlights'

  onEntityCreated: (entity) =>
    return unless entity.hasComponent('highlight')
    super
    @createDisplayObject(entity)
    entity.on 'highlight/on', @onHighlight
    entity.on 'highlight/off', @onEndHighlight

  createDisplayObject: (entity) =>
    entity.highlight.display_object = new PIXI.Graphics()
#    entity.highlight.display_object.beginFill(0xffffff)
    entity.highlight.display_object.lineStyle(1, DEFAULTS.COLOUR)
    entity.highlight.display_object.drawCircle(0, 0, 35)
    entity.highlight.display_object.endFill()
    entity.highlight.display_object.position.x = 35
    entity.highlight.display_object.position.y = 35

    return entity.highlight.display_object

  onHighlight: (entity) =>
    return if entity.highlight.highlighting
    entity.highlight.highlighting = true
    entity.view.display_object.addChild(entity.highlight.display_object)

  onEndHighlight: (entity) =>
    return unless entity.highlight.highlighting
    entity.highlight.highlighting = false
    entity.view.display_object.removeChild(entity.highlight.display_object)
