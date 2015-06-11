_ = require 'lodash'

module.exports = class Component

  constructor: (@entity, options) ->
    _.extend(@, options)

  requires: (components) =>
    components = [components] unless _.isArray(components)
    for component in components
      unless @entity.hasComponent(component)
        throw new Error("Missing component #{component} from entity: #{@entity._name}")
