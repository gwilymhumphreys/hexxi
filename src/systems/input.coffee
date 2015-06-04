System = require './system'
CONTEXTS = ['attack', 'select', 'selected']

module.exports = class InputSystem extends System
  _name: 'input'

  constructor: (options, @context_names=CONTEXTS) -> super(options)

  init: =>
    super
    @contexts = []
    @addContext(context_name) for context_name in @context_names

  setContext: (context_name, args...) =>
    @current_context?.deactivate()
    @current_context = @contexts[context_name]
    @current_context.activate(args...)

  addContext: (name) =>
    Context = @engine.getInputContext(name)
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
