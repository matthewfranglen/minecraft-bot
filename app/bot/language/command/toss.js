var base = require('./base.js');

var TossCommand = function () {
  base.AbstractCommand.call(this);
};
TossCommand.prototype = Object.create(base.AbstractCommand.prototype);

TossCommand.prototype.invoke = function (bot) {
  return bot.toss();
};

exports.TossCommandFactory = function () {
  return base.SimpleCommandFactory('toss', TossCommand);
};
