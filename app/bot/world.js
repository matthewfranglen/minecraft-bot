/* jshint esnext: true */

// This handles conversion from directions and offsets to points.
// Points are absolute x, y, z locations.

// Points are often represented as a node-vec3 class.
// This is described as follows:
// x - south
// y - up
// z - west
// https://github.com/PrismarineJS/mineflayer/blob/master/doc/api.md#mineflayervec3

// So that means the directions, represented as arrays, are:
// north: [-N,  0,  0]
// south: [ N,  0,  0]
// east:  [ 0,  0, -N]
// west:  [ 0,  0,  N]
// up:    [ 0,  N,  0]
// down:  [ 0, -N,  0]

// These map the offset in a given direction to the offset in absolute terms.
// The offset in a given direction is defined as [major, minor, teritary]
// The major component always moves forward in the direction.
// The minor ant teriary components are thus two directions on the same plane.
//
// So the transformation is as follows:
//
//  * [3, 2, 1] north -> [-3,  1, -2] (north east)
//  * [3, 2, 1] south -> [ 3,  1,  2] (south west)
//  * [3, 2, 1] east  -> [ 2,  1, -3] (south east)
//  * [3, 2, 1] west  -> [-2,  1,  3] (north west)
//
// At the moment for horizontal movement the minor is the other horizontal direction.
// While vertical movement always has a north-south minor and an east-west teritary.
//
//  * [3, 2, 1] up   -> [2,  3, 1]
//  * [3, 2, 1] down -> [2, -3, 1]

var directionMatricies = {
  north: [[-1,  0,  0],
          [ 0,  0,  1],
          [ 0, -1,  0]],
  south: [[ 1,  0,  0],
          [ 0,  0,  1],
          [ 0,  1,  0]],
  east:  [[ 0,  1,  0],
          [ 0,  0,  1],
          [-1,  0,  0]],
  west:  [[ 0, -1,  0],
          [ 0,  0,  1],
          [ 1,  0,  0]],
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
