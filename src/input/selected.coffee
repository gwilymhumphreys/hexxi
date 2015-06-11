_ = require 'lodash'
MoveCommand = require '../commands/move'
Select = require './select'

module.exports = class AllySelectedContext extends Select
  _name: 'selected'

  activate: (@entity) =>
    @ally_units = []
    @enemy_units = []
    @tiles = []

    for entity in @engine.entitiesByComponent('selectable')
      @ally_units.push(entity) if @engine.getSystem('teams').isAlly(entity)
      @enemy_units.push(entity) if @engine.getSystem('teams').isEnemy(entity)
    for tile in @engine.entitiesByComponent('tile') when not @engine.getSystem('hex_grid').occupied(tile.hex_position)
      @tiles.push(tile)

    for entity in @ally_units
      entity.on 'click', @onAllySelect
    for entity in @enemy_units
      entity.on 'click', @onEnemySelect
    for entity in @tiles
      entity.on 'click', @onTileSelect
    @engine.on 'rightclick', @onRightClick

  deactivate: =>
    for entity in @ally_units
      entity.off 'click', @onAllySelect
    for entity in @enemy_units
      entity.off 'click', @onEnemySelect
    for entity in @tiles
      entity.off 'click', @onTileSelect

  onRightClick: =>
    @engine.getSystem('selectables').deselect(@entity)
    @engine.getSystem('input').setContext('select')

  onAllySelect: (entity, event) =>
    if selected = @engine.getSystem('selectables').toggle(entity)
      # Select another entity
      @engine.getSystem('input').setContext('selected', entity)
    else
      # Deselect this entity
      @engine.getSystem('input').setContext('select')

  onEnemySelect: (entity, event) =>
    return unless path = @engine.getSystem('pathing').path
    command = new MoveCommand({entity: @entity, path: path})
    @engine.getSystem('selectables').deselect(@entity)
    @engine.getSystem('command_queue').push(command)
    @engine.getSystem('input').setContext('select')

  onTileSelect: (entity, event) =>
    return unless path = @engine.getSystem('pathing').path
    command = new MoveCommand({entity: @entity, path: path})
    @engine.getSystem('selectables').deselect(@entity)
    @engine.getSystem('command_queue').push(command)
    @engine.getSystem('input').setContext('select')

