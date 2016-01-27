/* jshint esnext: true */

exports.enableChatCommands = function (bot) {
  bot.bot.on('chat', function (username, message) {
    if (username === bot.username) {
      return;
    }

    var parts = message.split(' ');
    if (isNotForMe(bot, parts)) {
      return;
    }

    var command = {
      from: username,
      action: parts[1],
      args: parts.slice(2)
    };
    if (! (command.action in commands) ) {
      bot.bot.chat("Unknown command " + command.action);
      return;
    }

    commands[command.action](bot, command);
  });
};

var isNotForMe = function (bot, messageParts) {
  try {
    var pattern = new RegExp(messageParts[0]);
    return ! bot.bot.username.match(pattern);
  }
  catch (exception) {
    return true;
  }
};

var shapes = {};

// the square is fixed depth because it is created in front of the player
// the square varies in x because it is created around the player
// the square increases in y because it is created from the feet upwards
// this creates an array of arrays where each one represents the offset of that point of the square
shapes.square = [-1, 0, 1].map(x => [0, 1, 2].map(y => [1, x, y])).reduce((a, v) => a.concat(v), []);

var commands = {
  dig: function (bot, command) {
    var direction = command.args[0],
      shape = command.args[1];

    switch(shape) {
      case 'point':
        bot.dig.offset(direction, [1, 0, 1]);
        break;
      case 'square':
        bot.dig.shape(direction, shapes.square);
        break;
      default:
        bot.bot.chat("Unrecognized shape " + shape);
        break;
    }
  },
  move: function (bot, command) {
    var direction = command.args[0],
      distance = parseInt(command.args[1]) || 1;

    bot.move.offset(direction, [distance + 1, 0, 0]);
  },
  come: function (bot, command) {
    bot.move.point(bot.bot.players[command.from].entity.position);
  },
  look: function (bot, command) {
    bot.look(command.args[0]);
  },
  toss: function (bot) {
    bot.toss();
  },
  quit: function (bot) {
    bot.quit();
  }
};
