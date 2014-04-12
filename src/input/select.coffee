_ = require 'underscore'
Engine = require '../engine/engine'
Context = require './context'

module.exports = class SelectContext extends Context
  _name: 'select'

  activate: =>
    @entities = Engine.entitiesByComponent('selectable')
    for entity in @entities
      entity.on 'click', @select

  deactivate: =>
    for entity in @entities
      entity.off 'click', @select

  select: (e, entity) =>
    console.log 'entityseleting'
    return unless Engine.getSystem('teams').isAlly(entity)
    Engine.getSystem('selectables').select(entity)
    Engine.getSystem('input').setContext('selected', entity)

