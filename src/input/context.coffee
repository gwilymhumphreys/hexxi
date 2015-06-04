_ = require 'underscore'
Engine = require '../lib/engine'

module.exports = class Context

  constructor: (options) ->
    _.extend(@, options)
    @entities = []
    @sub_contexts = []
    Engine.on 'entity/created', @onEntityCreated
    Engine.on 'entity/destroyed', @onEntityDestroyed

  onEntityCreated: (entity) =>
  onEntityDestroyed: (entity) => #todo: remove entity

  addSubContext: (context) =>
    Ctx = require("./#{context}")
    @sub_contexts.push(new Ctx)

  bindEvents: =>
    for entity in Engine.entities
      entity.on 'click', @onEntityClick

  onEntityClick: =>
    return unless @active
