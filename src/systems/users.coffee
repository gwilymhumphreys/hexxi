_ = require 'underscore'
System = require './system'
User = require '../entities/user'

module.exports = class Users extends System
  _name: 'users'

  init: =>
    @default_user or= new User({id: 1, is_local: true})

  onEntityCreated: (entity) =>
    return unless entity.hasComponent('user')
    super

  localUser: => _.find(@entities, (u) => u.user.is_local)

  setLocalUserId: (id) =>
    @localUser.id = id
