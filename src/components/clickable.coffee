Component = require './component'

module.exports = class Clickable extends Component
  _name: 'clickable'

  init: =>
    @selected = false
    @entity.display_object.setInteractive(true)
    @entity.display_object.click = @onClick

  onClick: (event) =>
#    console.log @entity, event
    @entity.emit 'click', event
