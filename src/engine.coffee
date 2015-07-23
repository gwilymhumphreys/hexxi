_ = require 'lodash'
EventEmitter = require './lib/event_emitter'
StateManager = require './states/state_manager'
Entity = require './entities/entity'

globals = window or global

BUILTIN_PATHS =

  animations:
    animation: require './animations/animation'
    hex_path: require './animations/hex_path'
    linear: require './animations/linear'

  entities:
    board: require './entities/board'
    entity: require './entities/entity'
    grid_tile: require './entities/grid_tile'
    team: require './entities/team'
    unit: require './entities/unit'
    user: require './entities/user'

  input:
    context: require './input/context'
    select: require './input/select'
    selected: require './input/selected'

  commands:
    move: require './commands/move'

  components:
    animations: require './components/animations'
    clickable: require './components/clickable'
    component: require './components/component'
    hex_grid: require './components/hex_grid'
    hex_position: require './components/hex_position'
    highlight: require './components/highlight'
    hover_effects: require './components/hover_effects'
    pathable: require './components/pathable'
    position: require './components/position'
    relations: require './components/relations'
    selectable: require './components/selectable'
    team: require './components/team'
    team_membership: require './components/team_membership'
    tile: require './components/tile'
    user: require './components/user'

    circle: require './components/views/circle'
    sprite: require './components/views/sprite'
    text: require './components/views/text'
    view: require './components/views/view'

  systems:
    animations: require './systems/animations'
    command_queue: require './systems/command_queue'
    hex_grid: require './systems/hex_grid'
    highlights: require './systems/highlights'
    hover_effects: require './systems/hover_effects'
    input: require './systems/input'
    multiplayer: require './systems/multiplayer'
    pathing: require './systems/pathing'
    relations: require './systems/relations'
    renderer: require './systems/renderer'
    selectables: require './systems/selectables'
    system: require './systems/system'
    teams: require './systems/teams'
    users: require './systems/users'

MODULE_CATEGORIES = _.keys(BUILTIN_PATHS)

DEFAULT_OPTIONS =
  states: {}

class Engine extends EventEmitter

  constructor: ->
    super
    window.Engine = @ # TODO: testing
    @started = true #TODO: testing
    @paused = true
    @modules = {}
    @entities = []
    @systems = []
    @commands_by_name = {}
    @components_by_name = {}
    @systems_by_name = {}
    @appendPaths(BUILTIN_PATHS)
    @state = new StateManager()

  configure: (options={}) =>
    @options = _.defaults(options, DEFAULT_OPTIONS)

    if @options.states
      @state.configure(@options.states)
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
    for category in MODULE_CATEGORIES
      @modules[category] = []
      for name, path of @paths[category]
        if _.isString(path)
          module = require(path)
        else
          module = path
        if module::_name and duplicate = _.find(@modules[category], (m) -> m::_name is module::_name)
          console.log "Hexxi.Engine warning: A #{category} module with the name #{module::_name} already exists:", module, duplicate
        @modules[category].push(module)

    (@commands_by_name[Command::_name] = Command) for Command in @modules.commands
    (@components_by_name[Component::_name] = Component) for Component in @modules.components when Component::_name

  appendPaths: (path_obj) =>
    @paths or= []
    for key, paths of path_obj
      return console.error "Hexxi::configure - given key is not used by Hexxi, maybe a typo?: #{key}" unless BUILTIN_PATHS[key]
      @paths[key] or= {}
      _.extend(@paths[key], paths)

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
  getInputContext: (name) => _.find(@modules.input, (c) -> c::_name is name)

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

    @state.preUpdate()
    for system in @systems when system.preUpdate
      system.preUpdate()

    for system in @systems
      system.update()

  reset: =>
    for entity in @entities
      entity.destroy()

module.exports = new Engine()
