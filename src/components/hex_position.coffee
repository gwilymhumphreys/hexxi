Component = require './component'
HexUtils = require '../lib/hex_utils'

module.exports = class HexPosition extends Component
  _name: 'hex_position'

  setHexPosition: (q, r) =>
    if arguments.length is 1
      {q, r} = q
    @q = q
    @r = r
  set: @::setHexPosition

  hexPathMove: (path) =>
    path = [path] unless _.isArray(path)
    goal = path[0]
    @set(goal)
    console.log 'hexPathMove', path, goal
    @engine.getSystem('animations').animateHexPath @entity, path

  toCubeCoords: => HexUtils.axialToCoubeCoords(@q, @r)
