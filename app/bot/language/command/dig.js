var base = require('./base.js');

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
