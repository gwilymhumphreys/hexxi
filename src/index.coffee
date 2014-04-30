_ = require 'underscore'

module.exports =
  Engine: require './engine/engine'

  Action: require './actions/action'
  actions:
    Move: require './actions/move'

  Command: require './commands/command'
  Component: require './components/component'
  Entity: require './entities/entity'
  InputContext: require './input/context'
  System: require './systems/system'
  HexUtils: require './lib/hex_utils'

  entities:
    Entity: require './entities/entity'
    Board: require './entities/board'
    GridTile: require './entities/grid_tile'
    Team: require './entities/team'
    Unit: require './entities/unit'
    User: require './entities/user'

_.extend module.exports, {
  configure: module.exports.Engine.configure
}
