_ = require 'lodash'
Command = require './command'
MoveAction = require '../actions/move'

module.exports = class MoveCommand extends Command
  _name: 'move'

  execute: =>
    @move_action = new MoveAction({entity: @entity, path: @path})
    @engine.getSystem('action_queue').push(@move_action)

    @goal = @path[0]
    @entity.hex_position.q = @goal.q
    @entity.hex_position.r = @goal.r

    @engine.emit 'command', @

  toJSON: => {command: @_name, data: {entity: @entity.id, path: @path}}
