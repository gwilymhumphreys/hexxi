_ = require 'lodash'

module.exports = class Command

  constructor: (@data, @options={}) ->
    @engine = @options.engine or require '../engine'
    @set(@data)

  set: (data) =>
    data.entity = @engine.ensureEntity(data.entity) if data.entity
    data.target = @engine.ensureEntity(data.target) if data.target
    _.extend(@, data)

  toJSON: => {command: @_name, data: @data}
