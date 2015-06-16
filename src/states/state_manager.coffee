_ = require 'lodash'

module.exports = class StateManager
  constructor: (options) ->
    @states = {}
    @configure(options) if options

  configure: (options) =>
    if options?.states
      for state_name, state of options.states
        @add(state_name, state)

  add: (state_name, state) => @states[state_name] = state

  start: (state_name) =>
    if @current_state_name is state_name
      return console.log "Hexxi.StateManager.Start: #{state_name} is the currrent state"
    if @_pending_state_name is state_name
      return console.log "Hexxi.StateManager.Start: #{state_name} is already pending"
    return console.error "Hexxi.StateManager.Start: #{state_name} state does not exist (configure with options.states)" unless @states[state_name]
    @_pending_state_name = state_name

  preUpdate: =>
    return unless @_pending_state_name
    @current_state?.shutdown()
    @_setCurrentState(@_pending_state_name)

  _setCurrentState: (state_name) =>
    @current_state_name = state_name
    @_pending_state_name = null
    @current_state = new @states[state_name]()
    @current_state.init()
    @current_state.preload()
    @current_state.create()
