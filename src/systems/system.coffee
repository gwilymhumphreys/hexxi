_ = require 'lodash'

module.exports = class System

  constructor: (@options={}) ->
    (@[key] = value) for key, value of @options
    @engine or= require '../engine'

  init: =>
    @entities = []
    for entity in @engine.entities
      @onEntityCreated(entity)
    @engine.on 'entity/created', @onEntityCreated
    @engine.on 'entity/destroyed', @onEntityDestroyed

  update: ->
  onEntityCreated: (entity) => #@entities.push(entity)
  onEntityDestroyed: (entity) => #todo: remove entity
  entityById: (id) => _.find(@entities, (e) -> e.id is id)
