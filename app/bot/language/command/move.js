var base = require('./base.js');

var MoveCommand = function (direction, distance) {
  this.direction = direction;
  this.distance = parseInt(distance) || 1;
};
MoveCommand.prototype = Object.create(base.AbstractCommand.prototype);

MoveCommand.prototype.invoke = function (bot) {
  return bot.move.offset(this.direction, [this.distance + 1, 0, 0]);
};

exports.MoveCommandFactory = function () {
  var pattern = /^move ([^ ]+)(?: (\d+))?$/;
  return function (username, command) {
    var match = command.match(pattern);

    if (match) {
      return new MoveCommand(match[0], match[1]);
    }
  };
};
