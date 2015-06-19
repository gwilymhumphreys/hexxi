_ = require 'lodash'
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
  setAndEmit: (position, from_position) =>
    from_position or= @toJSON()
    @set(position)
    @engine.emit('enter_tile', {@entity, position, from_position})
#
#  linearMove: (to_position, callback) =>
#    @engine.getSystem('animations').animateLinear @entity, to_position, (err) => callback(err, @setAndEmit(to_position))
#
#  hexPathMove: (path, callback) =>
#    path = [path] unless _.isArray(path)
#    callback or= ->
#    queue = new Queue(1)
#    for pos in path.reverse()
#      do (pos) => queue.defer (callback) =>
#        return callback() if @equals(pos)
#        @linearMove pos, callback
#    queue.await callback

#    @engine.getSystem('animations').animateHexPath @entity, path
#    path = [path] unless _.isArray(path)
#    end_position = path[0]
#    from_position = path[1]
#    @setAndEmit(end_position, from_position)
#    console.log 'hexPathMove', path, end_position

  toCubeCoords: => HexUtils.axialToCoubeCoords(@q, @r)
  toJSON: => _.pick(@, 'q', 'r')
  equals: (pos) => @q is pos.q and @r is pos.r
