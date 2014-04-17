_ = require 'underscore'

module.exports =
  Engine: require './engine/engine'

  Action: require './actions/action'
  Command: require './commands/command'
  Component: require './components/component'
  Entity: require './entities/entity'
  InputContext: require './input/context'
  System: require './systems/system'

  entities:
    Entity: require './entities/entity'
    Board: require './entities/board'
    GridTile: require './entities/grid_tile'
    Team: require './entities/team'
    Unit: require './entities/unit'

_.extend module.exports, {
  configure: module.exports.Engine.configure
}
