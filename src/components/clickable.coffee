Component = require './component'

module.exports = class Clickable extends Component
  _name: 'clickable'

  constructor: ->
    super
    @requires('view')
    if @entity.view.display_object
      @onDisplayObjectCreated()
    else
      @entity.once 'view/display_object_created', @onDisplayObjectCreated

  onDisplayObjectCreated: =>
    @selected = false
    @entity.view.display_object.interactive = true
    @entity.view.display_object.click = @onClick

  onClick: (event) =>
    @entity.emit 'click', event
