_ = require 'underscore'
Engine = require '../../engine/engine'

module.exports = class SelectAllyMixin

  activate: ->
    @targets = Engine.entitiesByComponent('selectable')
    for entity in @targets
      entity.on 'click', @select

  deactivate: ->
    for entity in @targets
      entity.off 'click', @select

  select: (entity, event) =>
    Engine.getSystem('selectables').select(entity)
