_ = require 'underscore'
Engine = require '../lib/engine'

module.exports = class System

  constructor: (@options={}) ->
    (@[key] = value) for key, value of @options

  init: =>
    @entities = []
    for entity in Engine.entities
      @onEntityCreated(entity)
    Engine.on 'entity/created', @onEntityCreated
    Engine.on 'entity/destroyed', @onEntityDestroyed

  update: ->
  onEntityCreated: (entity) => #@entities.push(entity)
  onEntityDestroyed: (entity) => #todo: remove entity
  entityById: (id) => _.find(@entities, (e) -> e.id is id)
