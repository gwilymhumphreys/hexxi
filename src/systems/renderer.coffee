_ = require 'lodash'
PIXI = require 'pixi.js'
System = require './system'
View = require '../components/views/view'

module.exports = class Renderer extends System
  _name: 'renderer'

  constructor: ->
    super
    @stage = new PIXI.Container()
    window.stage = @stage
    @renderer = PIXI.autoDetectRenderer(800, 600)
    @renderer.backgroundColor = 0xFFFFFF
    @view = @renderer.view
    document.body.appendChild(@view)

  onEntityCreated: (entity) =>
    return unless @entityViews(entity).length
    super
    @createDisplayObjects(entity)
    @setStage(entity)
    entity.on 'parent/changed', @onParentChanged

  onEntityDestroyed: (entity) =>
    super
    entity.off 'parent/changed', @onParentChanged

  onParentChanged: (entity) => @setStage(entity)

  update: =>
    for entity in @engine.entitiesByComponent('view')
      for view in @entityViews(entity)
        view.update?()
        view.display_object.position.x = entity.position.x + (view.offset?.x or 0)
        view.display_object.position.y = entity.position.y + (view.offset?.y or 0)
    @renderer.render(@stage)

  createDisplayObjects: (entity) =>
    for view in @entityViews(entity)
      view.createDisplayObject()

  setStage: (entity) =>
    for view in @entityViews(entity)
      @removeFromStage(view)
      view.stage = @getStage(entity, view)
      @addToStage(view)

  getStage: (entity, view) =>
    if view?.parent
      if _.isString(view.parent)
        stage_view = entity.getComponent(view.parent)
      else
        stage_view = view.parent
      unless @isView(stage_view)
        console.log 'Hexxi.Renderer: Invalid parent view for', view
      unless stage = stage_view.display_object
        console.log 'Hexxi.Renderer: display_object missing from parent view for', view, 'parent', stage_view
    else
      stage = entity.relations?.parent?.view?.display_object or @stage
    return stage

  addToStage: (view) =>
    return unless stage = view.stage
    return if stage.children.indexOf(view.display_object) >= 0
    stage.addChild(view.display_object)
    stage.children.sort (a, b) -> (a.z_index or 0) - (b.z_index or 0)

  removeFromStage: (view) =>
    return false unless (stage = view.stage) and stage.children.indexOf(view.display_object) >= 0
    stage.removeChild(view.display_object)
    return true

  setTexture: (entity, texture) =>
    entity.view.texture = texture
    entity.view.pixi_texture = PIXI.Texture.fromImage(texture)
    entity.view.display_object.texture = entity.view.pixi_texture

  entityViews: (entity) => (component for name, component of entity.components when @isView(component))
  isView: (component) => component._view or component instanceof View

