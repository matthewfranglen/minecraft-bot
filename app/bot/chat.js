/* jshint esnext: true */

exports.enableChatCommands = function (bot) {
  bot.chat = {
    history: [],
    commands: [],
    busy: false,
    clearBusyFlag: function () {
      bot.chat.busy = false;
    }
  };

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

    if (isSpecialAction(command)) {
      bot.chat.busy = true;
      invoke(bot, command, bot.chat.clearBusyCommand, bot.chat.clearBusyCommand);
    }
    else {
      bot.chat.commands.push(command);

      if (! bot.chat.busy) {
        invokeQueuedCommand(bot);
      }
    }
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

var isSpecialAction = function (command) {
  return command.action !== 'stop' && command.action !== 'quit';
};

var invokeQueuedCommand = function (bot) {
  if (! bot.chat.commands) {
    bot.chat.busy = false;
    return;
  }
  bot.chat.busy = true;

  var command = bot.chat.commands.pop();
  invoke(bot, command, function () { invokeQueuedCommand(bot); });
};

var invoke = function (bot, command, callback) {
  commands[command.action](bot, command).then(callback, callback);
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
        return bot.dig.offset(direction, [1, 0, 1]);
      case 'square':
        return bot.dig.shape(direction, shapes.square);
      default:
        bot.bot.chat("Unrecognized shape " + shape);
        break;
    }
    return Promise.resolve();
  },
  move: function (bot, command) {
    var direction = command.args[0],
      distance = parseInt(command.args[1]) || 1;

    return bot.move.offset(direction, [distance + 1, 0, 0]);
  },
  come: function (bot, command) {
    return bot.move.point(bot.bot.players[command.from].entity.position);
  },
  look: function (bot, command) {
    return bot.look(command.args[0]);
  },
  toss: function (bot) {
    return bot.toss();
  },
  stop: function (bot) {
    return bot.stop();
  },
  quit: function (bot) {
    return bot.quit();
  }
};
