// Generated by CoffeeScript 1.9.3
(function() {
  var Entity, Team,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Entity = require('./entity');

  module.exports = Team = (function(superClass) {
    extend(Team, superClass);

    Team.prototype._name = 'team';

    function Team() {
      Team.__super__.constructor.apply(this, arguments);
      this.addComponent('team');
    }

    return Team;

  })(Entity);

}).call(this);
