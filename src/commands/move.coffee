_ = require 'underscore'
Command = require './command'
Engine = require '../engine/engine'
MoveAction = require '../actions/move'

module.exports = class MoveCommand extends Command
  _name: 'move'

  execute: =>
    @move_action = new MoveAction({entity: @entity, path: @path})
    Engine.getSystem('action_queue').push(@move_action)

    @goal = @path[@path.length-1]

    @entity.hex_position.q = @goal.q
    @entity.hex_position.r = @goal.r

    console.log @entity

  toJSON: => {command: @_name, data: {entity: @entity.id, path: @path}}
