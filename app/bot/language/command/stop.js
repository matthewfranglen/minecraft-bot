var base = require('./base.js');

var StopCommand = function () {};
StopCommand.prototype = Object.create(base.AbstractCommand.prototype);

StopCommand.prototype.isImmediate = function () {
  return true;
};

StopCommand.prototype.shouldAddToHistory = function () {
  return false;
};

StopCommand.prototype.invoke = function (bot) {
  return bot.stop();
};

exports.StopCommandFactory = base.SimpleCommandFactory('stop', StopCommand);
