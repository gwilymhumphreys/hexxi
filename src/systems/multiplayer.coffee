Engine = require '../engine/engine'
System = require './system'
cloak = require 'cloak'

module.exports = class MultiplayerSystem extends System
  _name: 'multiplayer'

  init: =>
    super
    @primus = new Primus(@url)
    @socket = @primus.channel('clients')
    console.log @socket.id
    Engine.getSystem('users').setLocalUserId(@socket.id)
    @socket.on 'command', @onCommand
    @socket.on 'team', @onAssignTeam
    @id = @socket.id

  onAssignTeam: (data) =>
    console.log 'got team', data
    Engine.getSystem('teams').setLocalTeam(data.team_id)

  onCommand: (data) =>
    console.log 'id', @socket.id
    console.log('server said: ' + data)
    return if data.user_id is @id
    console.error 'Command not found: ', data.command unless Command = Engine.getCommand(data.command)
    command = new Command(data.data, {remote: true})
    Engine.getSystem('command_queue').push(command)

  sendCommand: (command) =>
    @socket.send('command', command.toJSON())
