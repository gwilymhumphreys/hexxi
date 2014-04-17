Engine = require '../engine/engine'
System = require './system'
Path = require '../lib/path'

module.exports = class Pathing extends System
  _name: 'pathing'

  init: =>
    super
    @pathing = false

  onEntityCreated: (entity) =>
    return unless entity.hasComponent('pathable')
    super
    entity.on 'selectable/select', @onEntitySelected
    entity.on 'selectable/deselect', @onEntityDeselected

  onEntityDestroyed: (entity) =>
    super
    entity.off 'selectable/select', @onEntitySelected

  onEntitySelected: (entity) =>
    if @pathing
      #TODO: if a friendly, select it / if an enemy, take default action
#      @pathEnd(entity)
    else
      @pathStart(entity)

  onEntityDeselected: (entity) =>
    @pathEnd(entity)

  onTileClick: (entity, event) => @pathEnd(entity) if @pathing

  onTileHover: (entity, event) =>
    return unless @pathing
    @hidePath()
    path_finder = new Path(@map, {end_traversable: true})
    @path = path_finder.findPath(@current.hex_position, entity.hex_position)
    @showPath()

  pathStart: (entity) =>
    @map_entities = Engine.entitiesByComponent('hex_position')
    positions = []
    for e in @map_entities
      e.on 'mouseover', @onTileHover
      e.on 'click', @onTileClick
      positions.push(e.hex_position)
    @map = Path.createMap(positions)
    @pathing = true
    @current = entity
    entity.emit 'pathable/path_started', entity

  pathEnd: (entity) =>
    for tile in @map_entities
      tile.off 'mouseover', @onTileHover
      tile.off 'click', @onTileClick
    @hidePath()
    @pathing = false
    @current = null
    entity.emit 'pathable/path_end', {path: @path}, entity

  hidePath: =>
    if @path
      for coords in @path
        tile = Engine.getSystem('hex_grid').getTile(coords)
        tile.emit 'highlight/off', tile

  showPath: =>
    if @path
      for coords in @path
        tile = Engine.getSystem('hex_grid').getTile(coords)
        tile.emit 'highlight/on', tile

#  _testPath: =>
#    @pathStart(@entity.getComponent('hex_grid').getTile(1, 3))
#    @setGoal(@entity.getComponent('hex_grid').getTile(-3, 3))
