PIXI = require 'pixi'
System = require './system'
EffectUtils = require '../lib/effect_utils'

DEFAULTS =
  COLOUR: '#ffffff'

module.exports = class HoverEffects extends System

  onEntityCreated: (entity) =>
    return unless entity.hasComponent('hover_effects')
    EffectUtils.initEffects(entity, entity.hover_effects)
    entity.on 'mouseover', @onMouseover
    entity.on 'mouseout', @onMouseout

  onMouseover: (entity, event) =>
    return if entity.hover_effects.hovering or @engine.getSystem('teams').isEnemy(entity)
    entity.hover_effects.hovering = true
    EffectUtils.activate(entity, entity.hover_effects)

  onMouseout: (entity, event) =>
    return unless entity.hover_effects.hovering
    entity.hover_effects.hovering = false
    EffectUtils.deactivate(entity, entity.hover_effects)
