HexUtils  = require './hex_utils'

MOVE_COST = 1

module.exports = class Path
  @MOVE_COST: MOVE_COST

  # Map is a 2d matrix of nodes with q, r, and traversable properties
  constructor: (@map, options) ->
    _.extend(@, options)
    @reset()

  # Assemble a matrix of nodes from a list of entities with q, r, and traversable properties
  @createMap: (entities) =>
    map = []
    for entity in entities
        {q, r} = entity
        node = Path::_toNode(entity)
        map[q] or= []
        if current = map[q][r]
          node.traversable = current.traversable and entity.traversable
        map[q][r] = node
    return map

  reset: =>
    @open = []
    @closed = {}
    @path = []
    # Current position in our path list
    @iter = 0

  next: =>
    ++@iter
    @iter = @path.length if @iter > @path.length

  prev: =>
    --@iter
    @iter = 0 if @iter < 0

  node: => @path[@iter]

  hash: (node) -> "#{node.q}, #{node.r}"

  # clears this path and sets up starting a goal nodes for the next
  findPath: (start, goal) =>
    throw new Error 'Path::findPath requires a map to be supplied first' unless @map

    start = @_toNode(start)
    @goal = @_toNode(goal)
    @_setValues(start, null, goal)
    @reset()
    @open.push(start)

    while @open.length > 0
      # get next closest node
      closing = @open.shift()

      # if we're at the end find and return the path
      if @_equal(closing, @goal)
        @closed[@hash(closing)] = closing
        path = @_tracePathToStart(closing)
        return path

      # closing node is not in closed list already
      unless @closed[@hash(closing)]
        @closed[@hash(closing)] = closing

        # check neighbours not in closed already
        for neighbour in @_neighbours(closing)

          neighbour = @_setValues(neighbour, closing, @goal)

          if closed_node = @closed[@hash(neighbour)]
            # Visited by a longer path, replace with this shorter one
            if (closing.g + neighbour.cost) < closed_node.g
              @closed[@hash(neighbour)] = neighbour

          else
            # add to open list
            @_insertSorted(neighbour, @open)

  _neighbours: (node) =>
    adjacent = []
    for dir in [0..5]
      coord = HexUtils.neighbour(node, dir)
      if n = @map[coord.q]?[coord.r]
        adjacent.push(@_toNode(n)) if n.traversable or (@end_traversable and @_equal(n, @goal))
    return adjacent

  _equal: (a, b) -> a.q is b.q and a.r is b.r

  _tracePathToStart: (node) =>
    path = []
    max = 10
    c = 0
    while node
      return path if ++c > max
      path.push(node)
      node = node.parent
    return path

  _setValues: (node, parent, goal) =>
    node.parent = parent
    node.cost or= MOVE_COST
    node.g = (parent?.g or 0) + node.cost
    node.h = HexUtils.distance(node, goal)
    node.f = node.g + node.h
    return node

  _insertSorted: (node, list) ->
    unless list.length
      list.push(node)
      return list
    for i in [0..list.length-1]
      if node.f < list[i].f
        list.splice(i, 0, node)
        return list

  _toNode: (obj) ->
    node = _.pick(obj, 'q', 'r', 'traversable')
    node.traversable ?= true
    return node

  _inspect: (node) -> "#{node.q}, #{node.r}"




