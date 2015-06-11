_ = require 'underscore'
EventEmitter = require '../lib/event_emitter'

module.exports = class Action extends EventEmitter

  constructor: (options) ->
    _.extend(@, options)
    @engine or= require '../lib/engine'

  update: ->
