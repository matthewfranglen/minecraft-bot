var base = require('./base.js');

var QuitCommand = function () {
  base.AbstractCommand.call(this);
};
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

exports.QuitCommandFactory = function () {
  return base.SimpleCommandFactory('quit', QuitCommand);
};
