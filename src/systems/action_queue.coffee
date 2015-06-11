_ = require 'lodash'
System = require './system'

#LIFO queue for actions to take
module.exports = class ActionQueue extends System
  _name: 'action_queue'

  constructor: ->
    super
    @actions = []

  unshift: (action) -> @actions.unshift(action)
  push: (action) -> @actions.push(action)
  pop: (action) -> @actions.pop(action)
  pause: (action) -> @actions.pause(action)

  update: =>
#    console.log '@current_action', @current_action
#    @current_action = null if @current_action?.complete
#    return unless @current_action or @actions.length
#    if @current_action or= @pop()
#      @current_action.update()

    @actions = _.without(@actions, (a) -> a.complete)
    for action in @actions
      action.update()
