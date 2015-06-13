System = require './system'
MultiplayerSystem = null

#LIFO queue for commands to evaluate
module.exports = class CommandQueue extends System
  _name: 'command_queue'

  constructor: ->
    super
    @items = []

  unshift: (item) -> @items.unshift(item)
  push: (item) -> @items.push(item)
  pop: (item) -> @items.pop(item)
  pause: (item) -> @items.pause(item)

  update: =>
    MultiplayerSystem or= @engine.getSystem('multiplayer')
    #TODO: 1 per frame or all at once?
    if @current_command = @pop()
      MultiplayerSystem.sendCommand(@current_command) unless @current_command.options.remote
      @current_command.execute()
