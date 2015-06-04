_ = require 'underscore'
EventEmitter = require '../lib/event_emitter'
entity_count = 0

module.exports = class Entity extends EventEmitter

  constructor: (options={}) ->
    @options = options
    super
    @id = options.id or ++entity_count
    @components = {}
    @children = []
    @engine or= require '../lib/engine'

  toString: => "#{@name} (#{@id})"
  equals: (entity) => @id is entity.id

  addComponent: (component_name, component_path, options) =>

    # Single arg
    if arguments.length is 1
      Component = @_loadComponent(component_name)

    # Name and options
    else if _.isObject(component_path)
      options = component_path
      Component = @_loadComponent(component_name)

    # Name, path and maybe options
    else
      Component = @_loadComponent(component_path)

    options = _.defaults(options or {}, @options[component_name] or= {})
    component = new Component(@, options)
    @addCreatedComponent(component_name, component)

  addCreatedComponent: (component_name, component) =>
    if arguments.length is 1
      component = component_name
      component_name = component._name

    @components[component_name] = component
    @[component_name] = component

  getComponent: (name) => @components[name]

  hasComponent: (component_name) => !!@[component_name]

  _loadComponent: (component_name) ->
    @engine.getComponent(component_name)
