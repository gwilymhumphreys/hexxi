_ = require 'underscore'
Engine = require '../engine/engine'
System = require './system'
HexUtils = require '../lib/hex_utils'
Board = require '../entities/board'
GridTile = require '../entities/grid_tile'

module.exports = class HexGrid extends System
  _name: 'hex_grid'

  constructor: (@options={}) ->
    _.defaults(@options, {
      tile_entity: GridTile
      symmetrical: true
      tile_size: 36
      rows: 8
      columns: 8
    })
    (@[key] = value) for key, value of @options
    @tile_height ?= HexUtils.heightFromSize(@tile_size)
    @tile_width ?= HexUtils.widthFromSize(@tile_size)

    unless Engine.isEntity(@board)
      @board = new Board(_.defaults(@board or {}, {position: {x: 10, y: 10}}))
    @board.position.x += Math.floor(@rows/2) * @tile_width
    @board.position.y += 3/4 * Math.floor(@columns/2) * @tile_height

  createGrid: =>
    Engine.addEntity(@board)
    @tiles = @createTiles()
    Engine.addEntity(tile) for tile in @tiles

  createTiles:  =>
    tiles = []
    for r in [Math.floor(-@columns/2)+1..Math.floor(@columns/2)]
      from = Math.floor(-@rows/2) + 1 - Math.ceil(r/2)
      to = Math.floor(@rows/2) - Math.ceil(r/2)
      from +=1 if @symmetrical and r % 2 isnt 0
      for q in [from..to]
        tile = new @tile_entity({hex_position: {q: q, r: r, traversable: true}, relations: {parent: @board}})
        tiles.push(tile)
    return tiles

  init: =>
    super
    @createGrid(@options)
    document.addEventListener 'mousemove', @onMousemove
    document.addEventListener 'click', @onClick

  onEntityCreated: (entity) =>
    if entity.hasComponent('hex_grid')
      @board = entity
    else if entity.hasComponent('hex_position')
      @setScreenCoords(entity)

  onMousemove: (event) =>
    coords = @mouseEventCoords(event)
    for entity in @entitiesAtCoords(coords) when not entity.hovering
      entity.hovering = true
      entity.emit 'mouseover', entity, event
    for entity in @entitiesNotAtCoords(coords) when entity.hovering
      entity.hovering = false
      entity.emit 'mouseout', entity, event

  onClick: (event) =>
    coords = @mouseEventCoords(event)
    for entity in @entitiesAtCoords(coords)
      entity.emit 'click', entity, event

  update: =>
    for entity in Engine.entitiesByComponent('hex_position')
      if entity.hex_position.has_moved
        @setScreenCoords(entity)
        entity.hex_position.has_moved = false

  setScreenCoords: (entity) =>
    screen_coords = @coordsToPixel(entity.hex_position)
    _.extend(entity.position, screen_coords)

  mouseEventCoords: (event) => @pixelToCoords(event.offsetX, event.offsetY)

  pixelToCoords: (x, y) =>
    x = x - @board.position.x - @tile_width / 2
    y = y - @board.position.y - @tile_height / 2
    return HexUtils.pixelToCoords(x, y, @tile_size)

  # Entities should have their parent as the game board or another entity on the board
  # So no need to offset by the boards coords by default
  coordsToPixel: (q, r) =>
    {q, r} = q if arguments.length is 1
    return {
      x: @tile_size * Math.sqrt(3) * (q + r/2)
      y: @tile_size * 3/2 * r
    }

  # Coords for a position offset by the boards position
  coordsToPixelOffset: (q, r) =>
    pos = @coordsToPixel(q, r)
    pos.x += @board.position.x
    pos.y += @board.position.y
    return pos

  entitiesAtCoords: (q, r) =>
    {q, r} = q if arguments.length is 1
    (e for e in Engine.entitiesByComponent('hex_position') when e.hex_position.q is q and e.hex_position.r is r)

  entitiesNotAtCoords: (q, r) =>
    {q, r} = q if arguments.length is 1
    (e for e in Engine.entitiesByComponent('hex_position') when e.hex_position.q isnt q or e.hex_position.r isnt r)

  getTile: (q, r) =>
    {q, r} = q if arguments.length is 1
    return _.find(Engine.entitiesByComponent('tile'), (test) -> test.hex_position.q is q and test.hex_position.r is r)
