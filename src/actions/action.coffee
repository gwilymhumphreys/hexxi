_ = require 'underscore'

module.exports = class Action

  constructor: (options) ->
    _.extend(@, options)
    @engine or= require '../lib/engine'

  update: ->
