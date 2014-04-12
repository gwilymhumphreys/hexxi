Engine = require '../engine/engine'
System = require './system'

module.exports = class Teams extends System
  _name: 'teams'

  onEntityCreated: (entity) =>
    return unless entity.hasComponent('team')
    super

  isAlly: (entity) => entity.player?.team_id? and Engine.active_team.id is entity.player.team_id
  isEnemy: (entity) => entity.player?.team_id? and Engine.active_team.id isnt entity.player.team_id
