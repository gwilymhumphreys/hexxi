Component = require './component'

module.exports = class Position extends Component
  _name: 'position'

  set: (x, y) =>
    {x, y} = x if arguments.length is 1
    @x = x
    @y = y
