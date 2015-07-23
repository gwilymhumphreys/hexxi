_ = require 'lodash'
System = require './system'

module.exports = class Relations extends System
  _name: 'relations'

  init: =>
    super
    @balls = []
    @engine.on 'enter_tile', @onEnterTile

  # Keep children in sync with parents
  onEnterTile: (info) =>
    {entity, position} = info
    if entity.relations?.children?.length
      for child in entity.relations.children
        child.hex_position.set(entity.hex_position)
