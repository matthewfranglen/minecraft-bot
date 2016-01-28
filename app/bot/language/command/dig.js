/* jshint esnext: true */
var base = require('./base.js');

var shapes = {};

// the square is fixed depth because it is created in front of the player
// the square varies in x because it is created around the player
// the square increases in y because it is created from the feet upwards
// this creates an array of arrays where each one represents the offset of that point of the square
shapes.square = [-1, 0, 1].map(x => [0, 1, 2].map(y => [1, x, y])).reduce((a, v) => a.concat(v), []);

exports.DigCommandFactory = function () {
  var pattern = /^dig ([^ ]+)(?: ([^ ]+))?$/;
  return function (username, command) {
    var match = command.match(pattern);

    if (match) {
      return new DigCommand(match[0], match[1]);
    }
  };
};

var DigCommand = function (direction, shape) {
  this.direction = direction;
  this.shape = shape || 'point';
};
DigCommand.prototype = Object.create(base.AbstractCommand.prototype);

DigCommand.prototype.invoke = function (bot) {
  switch(this.shape) {
    case 'point':
      return dig(bot, direction);
    case 'square':
      return digShape(bot, direction, shapes.square);
  }
  return Promise.reject("Unknown shape " + this.shape);
};

var dig = function (bot, direction) {
  return bot.dig.offset(direction, [1, 0, 1]);
};

var digShape = function (bot, direction, shape) {
  return bot.dig.shape(direction, shape);
};
