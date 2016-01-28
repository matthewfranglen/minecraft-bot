var base = require('./base.js');

var QuitCommand = function () {};
QuitCommand.prototype = Object.create(base.AbstractCommand.prototype);

QuitCommand.prototype.isImmediate = function () {
  return true;
};

QuitCommand.prototype.shouldAddToHistory = function () {
  return false;
};

QuitCommand.prototype.invoke = function (bot) {
  return bot.quit();
};

exports.QuitCommandFactory = base.SimpleCommandFactory('quit', QuitCommand);
