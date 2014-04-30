_ = require 'underscore'
Engine = require '../engine/engine'
Context = require './context'

module.exports = class SelectContext extends Context
  _name: 'select'

  activate: =>
    @active = true
    @entities = Engine.entitiesByComponent('selectable')
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
    return unless Engine.started
    return unless Engine.getSystem('teams').isAlly(entity)
    Engine.getSystem('selectables').select(entity)
    Engine.getSystem('input').setContext('selected', entity)

