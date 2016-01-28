var base = require('./base.js');

exports.RepeatCommandFactory = function () {
  var pattern = /^repeat the last (\d+) commands(?: (\d+) times)?$/;
  return function (username, command) {
    var match = command.match(pattern);

    if (match) {
      return new RepeatCommand(match[0], match[1]);
    }
  };
};

var RepeatCommand = function (commands, repetitions) {
  this.commands = commands;
  this.repetitions = parseInt(repetitions) || 1;
};
RepeatCommand.prototype = Object.create(base.AbstractCommand.prototype);

RepeatCommand.prototype.shouldAddToHistory = function () {
  return false;
};

RepeatCommand.prototype.invoke = function (bot) {
  if (this.repetitions > bot.command.history.length) {
    return Promise.reject("Not enough commands in the history");
  }

  var repeatedCommands = bot.command.history.slice(-1 * this.repetitions);

  for (i = 0; i < this.repetitions; i++) {
    bot.command.queue = bot.command.queue.concat(repeatedCommands);
  }

  return Promise.resolve();
};
