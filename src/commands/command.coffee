_ = require 'underscore'
Engine = require '../lib/engine'

module.exports = class Command

  constructor: (@data, @options={}) ->
    @set(@data)

  set: (data) =>
    data.entity = Engine.ensureEntity(data.entity) if data.entity
    data.target = Engine.ensureEntity(data.target) if data.target
    _.extend(@, data)

  toJSON: => {command: @_name, data: @data}
