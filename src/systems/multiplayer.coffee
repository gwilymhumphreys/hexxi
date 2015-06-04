System = require './system'

module.exports = class MultiplayerSystem extends System
  _name: 'multiplayer'

  init: =>
    @enabled = false; return #TODO: mp disabled
    super
    @primus = new Primus(@url)
    @socket = @primus.channel('clients')
    console.log @socket.id
    @engine.getSystem('users').setLocalUserId(@socket.id)
    @socket.on 'command', @onCommand
    @socket.on 'team', @onAssignTeam
    @socket.on 'game_start', @onGameStart
    @id = @socket.id

  onGameStart: (data) =>
    console.log 'GAME STARTING!'
    @engine.started = true
    @engine.getSystem('teams').activate(data.team_id)

  onAssignTeam: (data) =>
    console.log 'got team', data
    @engine.getSystem('teams').setLocalTeam(data.team_id)

  onCommand: (data) =>
    console.log 'server said: ', data
    return if data.user_id is @id
    console.error 'Command not found: ', data.command unless Command = @engine.getCommand(data.command)
    command = new Command(data.data, {remote: true})
    @engine.getSystem('command_queue').push(command)

  sendCommand: (command) =>
    return unless @enabled
    @socket.send('command', command.toJSON())
