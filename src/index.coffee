_ = require 'underscore'

module.exports =
  Engine: require './lib/engine'

  Action: require './actions/action'
  actions:
    Move: require './actions/move'
    DirectMove: require './actions/direct_move'

  Entity: require './entities/entity'
  entities:
    Entity: require './entities/entity'
    Board: require './entities/board'
    GridTile: require './entities/grid_tile'
    Team: require './entities/team'
    Unit: require './entities/unit'
    User: require './entities/user'

  InputContext: require './input/context'
  input:
    Select: require './input/select'
    Selected: require './input/selected'

  Command: require './commands/command'
  commands:
    Move: require './commands/move'

  Component: require './components/component'
  System: require './systems/system'
  HexUtils: require './lib/hex_utils'

_.extend module.exports, {
  configure: module.exports.Engine.configure
}
