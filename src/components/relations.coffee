Component = require './component'

module.exports = class Relations extends Component
  _name: 'relations'

  constructor: ->
    super
    @children = []
    console.log 'making rels', @parent
    if @parent
      @setParent(@parent)

  setParent: (parent) =>
    return console.trace "RelationsComponent: Attempting to set an entity's parent to itself", @entity if @entity.equals(parent)
    @previous_parent = @parent

    if parent
      @parent = parent
      parent.relations.children.push(@entity)

    else
      @parent = null
      if @previous_parent
        @previous_parent.relations.children = _.without(@previous_parent.relations.children, @entity)

    @entity.emit 'parent/changed', @entity

  revertParent: => @setParent(@previous_parent)
  addChild: (child) => child.setParent(@entity)
  removeChild: (child) => child.setParent(null)
