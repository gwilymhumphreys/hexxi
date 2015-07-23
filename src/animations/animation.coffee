_ = require 'lodash'
EventEmitter = require '../lib/event_emitter'

module.exports = class Animation extends EventEmitter

  constructor: (options) ->
    super
    _.extend(@, options)
    @engine or= require '../engine'

  update: ->
