var base = require('./base.js');

var TossCommand = function () {};
TossCommand.prototype = Object.create(base.AbstractCommand.prototype);

TossCommand.prototype.invoke = function (bot) {
  return bot.toss();
};

exports.TossCommandFactory = base.SimpleCommandFactory('stop', TossCommand);
