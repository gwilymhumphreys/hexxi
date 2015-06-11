_ = require 'lodash'
EventEmitter = require '../lib/event_emitter'

module.exports = class Animation extends EventEmitter

  constructor: (options) ->
    _.extend(@, options)
    @engine or= require '../lib/engine'

  update: ->
