var commands = {
  come: require('./command/base.js'),
  dig: require('./commands/dig.js'),
  look: require('./commands/look.js'),
  move: require('./commands/move.js'),
  quit: require('./commands/quit.js'),
  repeat: require('./commands/repeat.js'),
  stop: require('./commands/stop.js'),
  toss: require('./commands/toss.js')
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
