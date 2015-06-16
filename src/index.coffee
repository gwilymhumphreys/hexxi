_ = require 'lodash'

module.exports =
  Engine: require './lib/engine'

  Animation: require './animations/animation'
  animations:
    HexPath: require './animations/hex_path'
    Linear: require './animations/linear'

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
