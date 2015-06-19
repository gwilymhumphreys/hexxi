_ = require 'lodash'
Command = require './command'

module.exports = class MoveCommand extends Command
  _name: 'move'

  execute: =>
    @engine.getSystem('hex_grid').hexPathMove @entity, @path
#    @entity.getComponent('hex_position').hexPathMove(@path)
    @engine.emit 'command', @

  toJSON: => {command: @_name, data: {entity: @entity.id, path: @path}}
