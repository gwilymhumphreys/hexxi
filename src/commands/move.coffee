_ = require 'lodash'
Command = require './command'
MoveAction = require '../actions/move'

module.exports = class MoveCommand extends Command
  _name: 'move'

  execute: =>
    @entity.getComponent('hex_position').hexPathMove(@path)
    @engine.emit 'command', @

  toJSON: => {command: @_name, data: {entity: @entity.id, path: @path}}
