var base = require('./base.js');

var LookCommand = function (direction) {
  base.AbstractCommand.call(this);

  this.direction = direction;
};
LookCommand.prototype = Object.create(base.AbstractCommand.prototype);

LookCommand.prototype.invoke = function (bot) {
  return bot.look(this.direction);
};

exports.LookCommandFactory = function () {
  var pattern = /^look ([^ ]+)$/;
  return function (username, command) {
    var match = command.match(pattern);

    if (match) {
      return new LookCommand(match[1]);
    }
  };
};
