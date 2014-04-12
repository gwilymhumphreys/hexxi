Engine = require '../engine/engine'
System = require './system'
CONTEXTS = ['attack', 'select', 'selected']

module.exports = class InputSystem extends System
  _name: 'input'

  constructor: (@context_names=CONTEXTS) ->

  init: =>
    super
    @contexts = []
    @addContext(context_name) for context_name in @context_names

  setContext: (context_name, args...) =>
    @current_context?.deactivate()
    @current_context = @contexts[context_name]
    @current_context.activate(args...)

  addContext: (name) =>
    Context = require("../input/#{name}")
    @contexts[name] = new Context()

#  onEntityCreated: (entity) =>
#    return unless entity.hasComponent('selectable')
#    super
#    console.log 'asd'
#    entity.on 'selectable/select', @onEntitySelected
#
#  onEntitySelected: (entity) =>
#    console.log 'asdasdas', entity
#    @current_context = @contexts['selected']
#    @current_context.activate(entity)
