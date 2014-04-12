PIXI = require 'pixi'
Engine = require '../engine/engine'
System = require './system'

DEFAULTS =
  COLOUR: '#ffffff'

module.exports = class HoverEffects extends System

  onEntityCreated: (entity) =>
    return unless entity.hasComponent('hover_effects')
    @createDisplayObject(entity)
    entity.on 'mouseover', @onMouseover
    entity.on 'mouseout', @onMouseout

  createDisplayObject: (entity) =>
    if outline = entity.hover_effects.outline
      entity.hover_effects.display_object = new PIXI.Graphics()
  #    entity.hover_effects.display_object.beginFill(0xffffff)
      entity.hover_effects.display_object.lineStyle(1, outline.colour or DEFAULTS.COLOUR)
      entity.hover_effects.display_object.drawCircle(0, 0, 35)
      entity.hover_effects.display_object.endFill()
      entity.hover_effects.display_object.position.x = 35
      entity.hover_effects.display_object.position.y = 35

    return entity.hover_effects.display_object

  onMouseover: (event, entity) =>
    return if entity.hover_effects.hovering
    entity.hover_effects.hovering = true
    entity.view.display_object.addChild(entity.hover_effects.display_object)

  onMouseout: (event, entity) =>
    return unless entity.hover_effects.hovering
    entity.hover_effects.hovering = false
    entity.view.display_object.removeChild(entity.hover_effects.display_object)
