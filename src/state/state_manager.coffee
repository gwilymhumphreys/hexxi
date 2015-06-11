_ = require 'lodash'

module.exports = class StateManager
  constructor: (options) ->
    @states = _.clone(options.states)

  start: (state_name) =>
    if @current_state_name is state_name
      return console.log "Hexxi.StateManager.Start: #{state_name} is the currrent state"
    if @_pending_state_name is state_name
      return console.log "Hexxi.StateManager.Start: #{state_name} is already pending"
    return console.error "Hexxi.StateManager.Start: #{state_name} state does not exist (configure with options.states)" unless @states[state_name]
    @_pending_state_name = state_name

  preUpdate: =>
    return unless @_pending_state_name
    @current_state.shutdown()
    @setCurrentState(@_pending_state_name)

  setCurrentState: (state_name) =>
    @current_state_name = state_name
    @_pending_state_name = null
    @current_state = @states[state_name]
    @current_state.init()
    @current_state.preload()
    @current_state.create()
