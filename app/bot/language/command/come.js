var base = require('./base.js');

exports.ComeCommandFactory = function () {
  return function (username, command) {
    if (command === 'come') {
      return new ComeCommand(username);
    }
  };
};

var ComeCommand = function (username) {
  this.username = username;
};
ComeCommand.prototype = Object.create(base.AbstractCommand.prototype);

ComeCommand.prototype.invoke = function (bot) {
  var playerPosition = bot.bot.players[this.username].entity.position;
  return bot.move.point(playerPosition);
};