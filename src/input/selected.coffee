_ = require 'underscore'
Engine = require '../engine/engine'
MoveCommand = require '../commands/move'
Select = require './select'

module.exports = class AllySelectedContext extends Select
  _name: 'selected'

  constructor: ->

  activate: (@entity) =>
    console.log 'selectedcontext activated', arguments
    @ally_units = []
    @enemy_units = []
    @tiles = []

    for entity in Engine.entitiesByComponent('selectable')
      @ally_units.push(entity) if Engine.getSystem('teams').isAlly(entity)
      @enemy_units.push(entity) if Engine.getSystem('teams').isEnemy(entity)
    for tile in Engine.entitiesByComponent('tile')
      @tiles.push(tile)

    for entity in @ally_units
      entity.on 'click', @onAllySelect
    for entity in @enemy_units
      entity.on 'click', @onEnemySelect
    for entity in @tiles
      entity.on 'click', @onTileSelect

  deactivate: =>
    console.log 'selectedcontext deactivated'
    for entity in @ally_units
      entity.off 'click', @onAllySelect
    for entity in @enemy_units
      entity.off 'click', @onEnemySelect
    for entity in @tiles
      entity.off 'click', @onTileSelect

  onAllySelect: (entity, event) =>
    console.log 'ally select', entity
    Engine.getSystem('selectables').select(entity)
    Engine.getSystem('input').setContext('selected', entity)

  onEnemySelect: (entity, event) =>
    console.log 'enemy select', entity
    path = Engine.getSystem('pathing').path
    command = new MoveCommand({entity: @entity, path: path})
    Engine.getSystem('command_queue').push(command)
    Engine.getSystem('input').setContext('select')

  onTileSelect: (entity, event) =>
    path = Engine.getSystem('pathing').path
    command = new MoveCommand({entity: @entity, path: path})
    Engine.getSystem('command_queue').push(command)
    Engine.getSystem('input').setContext('select')

