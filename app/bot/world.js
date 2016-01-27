/* jshint esnext: true */

var directionMatricies = {
  north: [[ 0,  1,  0],
          [ 0,  0,  1],
          [ 1,  0,  0]],
  south: [[ 0, -1,  0],
          [ 0,  0,  1],
          [-1,  0,  0]],
  east:  [[-1,  0,  0],
          [ 0,  0,  1],
          [ 0, -1,  0]],
  west:  [[ 1,  0,  0],
          [ 0,  0,  1],
          [ 0,  1,  0]],
  up:    [[ 0,  1,  0],
          [ 1,  0,  0],
          [ 0,  0,  1]],
  down:  [[ 0,  1,  0],
          [-1,  0,  0],
          [ 0,  0,  1]]
};

exports.isInvalidDirection = function (direction) {
  return ! (direction in directionMatricies);
};

exports.offsetToPoint = function (bot, direction, offset) {
  return bot.entity.position.offset.apply(bot.entity.position, exports.offsetToCardinal(direction, offset));
};

exports.offsetToCardinal = function (direction, offset) {
  var matrix = directionMatricies[direction];

  return matrix.map(v => v.reduce((a, v, i) => (offset[i] * v) + a, 0));
};
