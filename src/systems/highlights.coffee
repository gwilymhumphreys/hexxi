System = require './system'
EffectUtils = require '../lib/effect_utils'

module.exports = class Highlightable extends System
  _name: 'highlights'

  onEntityCreated: (entity) =>
    return unless entity.hasComponent('highlight')
    super
    EffectUtils.initEffects(entity, entity.highlight)
    entity.on 'highlight/on', @onHighlight
    entity.on 'highlight/off', @onEndHighlight

  onHighlight: (entity) =>
    return if entity.highlight.highlighting
    entity.highlight.highlighting = true
    EffectUtils.activate(entity, entity.highlight)

  onEndHighlight: (entity) =>
    return unless entity.highlight.highlighting
    entity.highlight.highlighting = false
    EffectUtils.deactivate(entity, entity.highlight)
