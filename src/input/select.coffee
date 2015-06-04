_ = require 'underscore'
Context = require './context'

module.exports = class SelectContext extends Context
  _name: 'select'

  activate: =>
    @active = true
    @entities = @engine.entitiesByComponent('selectable')
    for entity in @entities
      entity.on 'click', @select

  onEntityCreated: (entity) =>
    return unless @active
    @entities.push(entity)
    entity.on 'click', @select

  deactivate: =>
    @active = false
    for entity in @entities
      entity.off 'click', @select

  select: (entity, event) =>
    return unless @engine.started
    return unless @engine.getSystem('teams').isAlly(entity)
    @engine.getSystem('selectables').select(entity)
    @engine.getSystem('input').setContext('selected', entity)

