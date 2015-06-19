Component = require './component'

module.exports = class Relations extends Component
  _name: 'relations'

  constructor: ->
    super
    @children = []
    if @parent
      @setParent(@parent)
    else
      @parent = null

  setParent: (parent) =>
    return console.trace "RelationsComponent: Attempting to set an entity's parent to itself", @entity if @entity.equals(parent)

    if @previous_parent = @parent
      @previous_parent.relations.children = _.without(@previous_parent.relations.children, @entity)

    if parent
      @parent = parent
      parent.relations.children.push(@entity)
    else
      @parent = null

    @entity.emit 'parent/changed', @entity

  revertParent: => @setParent(@previous_parent)
  addChild: (child) => child.setParent(@entity)
  removeChild: (child) => child.setParent(null)
  toJSON: => {@parent, @previous_parent, children: (e.id for e in @children)}
