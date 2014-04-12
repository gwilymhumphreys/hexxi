
module.exports = class EventEmitter

  constructor: ->
    @events = {}

  emit: (event, args...) ->
    return false unless @events[event]
    listener args... for listener in @events[event]
    return true

  addListener: (event, listener) ->
    throw new Error "Undefined listener for #{event}" unless listener
    @emit 'newListener', event, listener
    (@events[event] ?= []).push listener
    return @

  once: (event, listener) ->
    fn = =>
      @removeListener event, fn
      listener arguments...
    @on event, fn
    return @

  removeListener: (event, listener) ->
    return @ unless @events[event]
    @events[event] = (l for l in @events[event] when l isnt listener)
    return @

  removeAllListeners: (event) ->
    delete @events[event]
    return @

  on: @::addListener
  off: @::removeListener
