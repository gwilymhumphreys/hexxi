_ = require 'lodash'

module.exports = class Context

  constructor: (options) ->
    _.extend(@, options)
    @entities = []
    @sub_contexts = []
    @engine or= require '../lib/engine'
    @engine.on 'entity/created', @onEntityCreated
    @engine.on 'entity/destroyed', @onEntityDestroyed

  onEntityCreated: (entity) =>
  onEntityDestroyed: (entity) => #todo: remove entity

  addSubContext: (context) =>
    Ctx = require("./#{context}")
    @sub_contexts.push(new Ctx)

  bindEvents: =>
    for entity in @engine.entities
      entity.on 'click', @onEntityClick

  onEntityClick: =>
    return unless @active
