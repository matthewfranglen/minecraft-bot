var commands = {
  come: require('./command/base.js'),
  dig: require('./command/dig.js'),
  look: require('./command/look.js'),
  move: require('./command/move.js'),
  quit: require('./command/quit.js'),
  repeat: require('./command/repeat.js'),
  stop: require('./command/stop.js'),
  toss: require('./command/toss.js')
};

var commandFactories = [
  commands.quit.QuitCommandFactory,
  commands.stop.StopCommandFactory,
  commands.repeat.RepeatCommandFactory,

  commands.come.ComeCommandFactory,
  commands.dig.DigCommandFactory,
  commands.look.LookCommandFactory,
  commands.move.MoveCommandFactory,
  commands.toss.TossCommandFactory
];

exports.parse = function (expression) {
  for (var factory in commandFactories) {
    var command = factory(expression);

    if (command) {
      return command;
    }
  }
};
