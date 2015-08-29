// Generated by CoffeeScript 1.9.3
(function() {
  var Entity, User,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Entity = require('./entity');

  module.exports = User = (function(superClass) {
    extend(User, superClass);

    User.prototype._name = 'user';

    function User() {
      User.__super__.constructor.apply(this, arguments);
      this.addComponent('user');
    }

    return User;

  })(Entity);

}).call(this);