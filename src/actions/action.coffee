_ = require 'underscore'

module.exports = class Action

  constructor: (options) ->
    _.extend(@, options)

  update: ->
