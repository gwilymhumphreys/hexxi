Component = require './component'

module.exports = class Relations extends Component
  _name: 'relations'

  constructor: ->
    super
    @children = []

  setParent: (entity) ->
    @parent = entity
    @emit 'parent/changed', @entity
    return @entity

  addChild: (entity) =>
    entity.relations.setParent(@)
    @children.push(entity)
    @emit 'child/added', @entity
    return @entity
