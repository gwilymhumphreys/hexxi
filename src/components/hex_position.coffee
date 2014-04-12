Component = require './component'
HexUtils = require '../lib/hex_utils'

module.exports = class HexPosition extends Component
  _name: 'hex_position'

  setHexPosition: (q, r) =>
    @q = q
    @r = r

  toCubeCoords: => HexUtils.axialToCoubeCoords(@q, @r)
