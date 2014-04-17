_ = require 'underscore'
Engine = require '../engine/engine'
Context = require './context'

module.exports = class AttackContext extends Context

  constructor: (options) ->
    _.extend(@, options)
    @targets = Engine.entitiesByComponent('selectable')
    for entity in @targets
      entity.on 'click', @toggleSelect
#    return _.filter(units, (p) -> p.team.id is @team)

  toggleSelect: (entity, event) =>
    if @selected_entity
      @onDeselect(entity)
    else
      @onSelect(entity)

  onSelect: (entity) =>
    @selected_entity = entity
    entity.selectable.selected = true
    entity.emit('selectable/select', entity)
#    entity.setTexture(@entity.selected_texture)

  onDeselect: (entity) =>
    entity.selectable.selected = false
    entity.emit('selectable/deselect', entity)
#    entity.setTexture(@entity.texture)


# TODO: enforce once thing being selected at a time
