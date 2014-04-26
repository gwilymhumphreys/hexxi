_ = require 'underscore'
EventEmitter = require '../lib/event_emitter'

Entity = require '../entities/entity'

globals = window or global

BUILTIN_PATHS =
#  actions: 'client/src/actions/'
#  components: 'client/src/components/'
#  entities: 'client/src/entities/'
#  input: 'client/src/input/'
  commands: 'client/src/hexxi/src/commands/'
  systems: 'client/src/hexxi/src/systems/'

class Engine extends EventEmitter

  constructor: ->
    super
    @paused = true
    @modules = []
    @entities = []
    @systems = []
    @commands_by_name = {}
    @systems_by_name = {}
    @appendPaths(BUILTIN_PATHS)

  configure: (@options={}) =>
    console.trace 'configure'
    if @options.paths
      @appendPaths(@options.paths)

    @loadModules()
    @createSystems()

    @init()

  init: =>
    for system in @systems
      system.init(@)
    @update()

  createSystems: =>
    @addSystem(new System(@options.systems[System._name])) for System in @modules.systems
    (@commands_by_name[Command::_name] = Command) for Command in @modules.commands

  loadModules: =>
    registered_modules = globals.require.list()
    for key, paths of @paths
      modules = @modules[key] = []
      for base_path in paths
        modules.push(require(path)) for path in registered_modules when path.match("^#{base_path}")

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
  components: (component_name) => entity[component_name] for entity in @entitiesByComponent(component_name)

  initSystem: (system) =>
    system = @getSystem(system) if _.isString(system)
    system.init(@)

  addSystem: (system) =>
    @systems.push(system)
    @systems_by_name[system._name] = system

  getSystem: (system_name) => @systems_by_name[system_name]

  getCommand: (name) => @commands_by_name[name]

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
