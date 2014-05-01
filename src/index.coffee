_ = require 'underscore'

module.exports =
  Engine: require './engine/engine'

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

  Command: require './commands/command'
  Component: require './components/component'
  InputContext: require './input/context'
  System: require './systems/system'
  HexUtils: require './lib/hex_utils'

_.extend module.exports, {
  configure: module.exports.Engine.configure
}
