PIXI = require 'pixi.js'

DEFAULTS =
  OUTLINE_COLOUR: '#ffff55'

module.exports = class EffectUtils

  @initEffects: (entity, component) =>
    if component.outline
      @createOutline(entity, component)
    return entity

  @createOutline: (entity, component) =>
      component.display_object = new PIXI.Graphics()
  #    component.display_object.beginFill(0xffffff)
      component.display_object.lineStyle(1, component.outline.colour or DEFAULTS.OUTLINE_COLOUR)
      component.display_object.drawCircle(0, 0, 35)
      component.display_object.endFill()
      component.display_object.position.x = 35
      component.display_object.position.y = 35

  @activate: (entity, component) =>
    if component.outline
      entity.view.display_object.addChild(component.display_object)
    else if component.texture
      component.previous_texture = entity.view.display_object.texture
      entity.view.display_object.setTexture(PIXI.Texture.fromImage(component.texture))

  @deactivate: (entity, component) =>
    if component.outline
      entity.view.display_object.removeChild(component.display_object)
    else if component.texture
      entity.view.display_object.setTexture(component.previous_texture)
