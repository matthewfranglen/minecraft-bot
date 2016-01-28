var base = require('./base.js');

var RepeatCommand = function (commands, repetitions) {
  base.AbstractCommand.call(this);

  this.commands = commands;
  this.repetitions = parseInt(repetitions) || 1;
};
RepeatCommand.prototype = Object.create(base.AbstractCommand.prototype);

RepeatCommand.prototype.shouldAddToHistory = function () {
  return false;
};

RepeatCommand.prototype.invoke = function (bot) {
  if (this.commands > bot.command.history.length) {
    return Promise.reject("Not enough commands in the history");
  }

  var repeatedCommands = bot.command.history.slice(-1 * this.commands);

  for (i = 0; i < this.repetitions; i++) {
    bot.command.queue = bot.command.queue.concat(repeatedCommands);
  }

  return Promise.resolve();
};

exports.RepeatCommandFactory = function () {
  var pattern = /^repeat the last (\d+) commands(?: (\d+) times)?$/;
  return function (username, command) {
    var match = command.match(pattern);

    if (match) {
      return new RepeatCommand(match[1], match[2]);
    }
  };
};
