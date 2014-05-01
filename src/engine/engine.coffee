_ = require 'underscore'
EventEmitter = require '../lib/event_emitter'

Entity = require '../entities/entity'

globals = window or global

BUILTIN_PATHS =
#  actions: 'client/src/actions/'
#  entities: 'client/src/entities/'
#  input: 'client/src/input/'
  components: 'client/src/hexxi/src/components/'
  commands: 'client/src/hexxi/src/commands/'
  systems: 'client/src/hexxi/src/systems/'

class Engine extends EventEmitter

  constructor: ->
    super
    window.Engine = @ # TODO: testing
    @started = true #TODO: testing
    @paused = true
    @modules = []
    @entities = []
    @systems = []
    @commands_by_name = {}
    @components_by_name = {}
    @systems_by_name = {}
    @appendPaths(BUILTIN_PATHS)

  configure: (@options={}) =>
    if @options.paths
      @appendPaths(@options.paths)

    @loadModules()
    @createSystems()

    @init()

  init: =>
    for system in @systems
      system.init(@)
    @update()
    @bindEvents()

  bindEvents: =>
    @element = @getSystem('renderer').view
    #TODO: Not sure if this is the best way to handle left / right clicks
    @element.addEventListener 'click', @onClick, false
    @element.addEventListener 'contextmenu', @onRightClick, false

  onRightClick: (event) =>
    event.preventDefault()
    @emit 'rightclick', event

  onClick: (event) =>
    # Might be needed in some browsers, have not tested. Chrome doesn't seem to trigger click event on right clicks
    return unless event.which is 1
    event.preventDefault()
    @emit 'click', event

  createSystems: =>
    @addSystem(new System(@options.systems[System._name])) for System in @modules.systems

  loadModules: =>
    registered_modules = globals.require.list()
    for key, paths of @paths
      modules = @modules[key] = []
      for base_path in paths
        modules.push(require(path)) for path in registered_modules when path.match("^#{base_path}")

    (@commands_by_name[Command::_name] = Command) for Command in @modules.commands
    (@components_by_name[Component::_name] = Component) for Component in @modules.components when Component::_name

  appendPaths: (path_obj) =>
    @paths or= []
    for key, paths of path_obj
      return console.error "Hexxi::configure - given key is not used by Hexxi, maybe a typo?: #{key}" unless BUILTIN_PATHS[key]
      paths = [paths] unless _.isArray(paths)
      @paths[key] or= []
      @paths[key].push(path) for path in paths when path not in @paths[key]

  #TODO: optimise these
  entityById: (id) => _.find(@entities, (entity) -> entity.id is id)
  entitiesByComponent: (component_name) => _.filter(@entities, (entity) -> entity.hasComponent(component_name))
  activeComponents: (component_name) => entity[component_name] for entity in @entitiesByComponent(component_name)

  initSystem: (system) =>
    system = @getSystem(system) if _.isString(system)
    system.init(@)

  addSystem: (system) =>
    @systems.push(system)
    @systems_by_name[system._name] = system

  getSystem: (system_name) => @systems_by_name[system_name]

  getCommand: (name) => @commands_by_name[name]

  getComponent: (name) => @components_by_name[name]

  isEntity: (entity) -> entity instanceof Entity

  ensureEntity: (entity) =>
    return @entityById(entity) if _.isNumber(entity)
    return entity

  addEntity: (entity) =>
    @entities.push(entity)
    @emit 'entity/created', entity

  removeEntity: (entity) =>
    @emit 'entity/destroyed', entity
    @entities = (e for e in @entities when e isnt entity)

  start: =>
    @paused = false

  stop: =>
    @paused = true

  update: =>
    window.requestAnimationFrame(@update)
    return if @paused

    for system in @systems
      system.update()

module.exports = new Engine()
