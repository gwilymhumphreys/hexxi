PIXI = require 'pixi'
Engine = require '../engine/engine'
System = require './system'

module.exports = class Renderer extends System
  _name: 'renderer'

  constructor: ->
    @stage = new PIXI.Stage(0x66FF99)
    @renderer = PIXI.autoDetectRenderer(800, 600)
    @view = @renderer.view
    document.body.appendChild(@view)

  onEntityCreated: (entity) =>
    return unless entity.hasComponent('view')
    super
    @setStage(entity)
    @createDisplayObject(entity)
    @addToStage(entity)
    entity.on 'parent/changed', @onParentChanged

  onEntityDestroyed: (entity) =>
    super
    entity.off 'parent/changed', @onParentChanged

  onParentChanged: (entity) => @setStage(entity)

  update: =>
    for entity in Engine.entitiesByComponent('view')
      entity.view.update?()
      entity.view.display_object.position.x = entity.position.x + (entity.view.offset?.x or 0)
      entity.view.display_object.position.y = entity.position.y + (entity.view.offset?.y or 0)
    @renderer.render(@stage)

  createDisplayObject: (entity) => entity.view.createDisplayObject()

  setStage: (entity) =>
    removed = @removeFromStage(entity)
    entity.view.stage = @getStage(entity)
    @addToStage(entity) if removed

  getStage: (entity) => entity.relations?.parent?.view?.display_object or @stage

  addToStage: (entity) =>
    return unless stage = entity.view.stage
    return if stage.children.indexOf(entity.view.display_object) >= 0
    stage.addChild(entity.view.display_object)
    window.stage = stage
#    stage.children.sort (c) -> c.z_index or 0
    entity.emit('show', entity.view.display_object)

  removeFromStage: (entity) =>
    return false unless (stage = entity.view.stage) and stage.children.indexOf(entity.view.display_object) >= 0
    stage.removeChild(entity.view.display_object)
    entity.emit('hide', entity.view.display_object)
    return true

  setTexture: (entity, texture) =>
    entity.view.texture = texture
    entity.view.pixi_texture = PIXI.Texture.fromImage(texture)
    entity.view.display_object.setTexture(entity.view.pixi_texture)
