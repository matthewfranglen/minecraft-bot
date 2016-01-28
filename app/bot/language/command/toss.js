var base = require('./base.js');

exports.TossCommandFactory = base.SimpleCommandFactory('stop', TossCommand);

var TossCommand = function () {};
TossCommand.prototype = Object.create(base.AbstractCommand.prototype);

TossCommand.prototype.invoke = function (bot) {
  return bot.toss();
};
