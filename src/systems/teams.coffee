Engine = require '../engine/engine'
System = require './system'

module.exports = class Teams extends System
  _name: 'teams'

  onEntityCreated: (entity) =>
    return unless entity.hasComponent('team')
    super

  isAlly: (entity) => entity.team_membership?.team_id? and Engine.active_team.id is entity.team_membership.team_id
  isEnemy: (entity) => entity.team_membership?.team_id? and Engine.active_team.id isnt entity.team_membership.team_id
