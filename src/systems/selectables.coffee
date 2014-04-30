Engine = require '../engine/engine'
System = require './system'

module.exports = class Selectables extends System
  _name: 'selectables'

  onEntityCreated: (entity) =>
    return unless entity.hasComponent('selectable')
    entity.selectable.selected = false

  toggle: (entity) =>
    if @selected_entity
      new_target = !@selected_entity.equals(entity)
      @deselect(@selected_entity)
    else
      new_target = true
    @select(entity) if new_target

  select: (entity) =>
    unless @selected_entity?.equals(entity)
      @deselect(@selected_entity)
      @selected_entity = entity
      entity.selectable.selected = true
      entity.emit('selectable/select', entity)

  deselect: (entity) =>
    return unless entity
    @selected_entity = null
    entity.selectable.selected = false
    entity.emit('selectable/deselect', entity)

  canSelect: (entity) =>
    return entity.getComponent('selectable') and Engine.getSystem('teams').isAlly(entity)
