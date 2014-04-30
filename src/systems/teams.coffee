_ = require 'underscore'
Engine = require '../engine/engine'
System = require './system'

module.exports = class TeamsSystem extends System
  _name: 'teams'

  init: =>
    super
    window.teams = @

  onEntityCreated: (entity) =>
    return unless entity.hasComponent('team')
    @entities.push(entity)
    @createTurnOrder()

  next: => @activate(@nextTeam())

  startingTeam: => @ordered_teams[0]

  setLocalTeam: (team_id) =>
    user_id = Engine.getSystem('users').localUser()?.id
#    team = _.find(@entities, (e) -> e.id is team_id)
    console.log 'You are player', team_id
    team = @entities[--team_id]
    team.user_id = user_id

  nextTeam: =>
    return unless @ordered_teams
    next_index = if @activeTeam() then @activeTeam()?.team.turn_index + 1 else 0
    next_index = 0 if not next_index or next_index >= @ordered_teams.length
    return @ordered_teams[next_index]

  activate: (team) =>
    console.log 'activating team', team
    unless team.id
      team = @entityById(team)
    console.error 'TeamsSystem: Attempting to activate an entity without a team component', entity unless team.hasComponent('team')
    @activeTeam()?.team.active = false
    @active_team = team
    console.log 'Activated team', team.id

  createTurnOrder: =>
#    @ordered_teams = _.shuffle(@entities)
    @ordered_teams = @entities
    i = 0
    for t in @ordered_teams
      t.team.turn_index = i++

  activeTeam: => @active_team
  activeUserId: => @active_team?.user_id
  localIsActive: => @localTeam()?.id is @activeTeam()?.id
  localTeam: => _.find(@entities, (t) -> t.user_id is Engine.getSystem('users').localUser()?.id)
  isAlly: (entity) =>
#    console.log 'ally', @localTeam()?.id, entity.team_membership?.team_id
    @localTeam()?.id is entity.team_membership?.team_id
  isEnemy: (entity) =>
#    console.log 'enemy', @localTeam()?.id, entity.team_membership?.team_id
    @localTeam()?.id isnt entity.team_membership?.team_id
