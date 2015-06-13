_ = require 'lodash'
tweene = require 'tween.js'

MIN_SPEED = 0.5
HIT_THRESHOLD = 1

module.exports = class AnimationUtils

  @reachedTarget: (entity, target) =>
    Math.abs(entity.position.x - target.position.x) < HIT_THRESHOLD and Math.abs(entity.position.y - target.position.y) < HIT_THRESHOLD

  @updatePosition: (entity, target, speed) =>
    dx = (target.position.x - entity.position.x) * speed
    dy = (target.position.y - entity.position.y) * speed
    dx = MIN_SPEED if dx > 0 and dx < MIN_SPEED
    dx = -MIN_SPEED if dx < 0 and dx > -MIN_SPEED
    dy = MIN_SPEED if dy > 0 and dy < MIN_SPEED
    dy = -MIN_SPEED if dy < 0 and dy > -MIN_SPEED
    entity.position.x += dx
    entity.position.y += dy

  @toTarget: (engine, hex_position) =>
    return hex_position if hex_position.position
    pixel_coords = engine.getSystem('hex_grid').coordsToPixel(hex_position)
    return {
      position: pixel_coords
      hex_position: hex_position
    }
