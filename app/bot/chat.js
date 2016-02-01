/* jshint esnext: true */

var parser = require('./language/parser.js');

exports.enableChatCommands = function (bot) {
  bot.command = {
    history: [],
    queue: [],
    busy: false
  };

  var clearBusyFlag = function () {
    bot.command.busy = false;
  };

  bot.bot.on('chat', function (username, message) {
    if (username === bot.username) {
      return;
    }

    var botIdentifier = message.split(' ', 1);
    if (isNotForMe(bot, botIdentifier[0])) {
      return;
    }

    var expression = message.substring(botIdentifier[0].length + 1);
    var command = parser.parse(username, expression);
    if (! command) {
      bot.bot.chat("Unknown command " + expression);
      return;
    }

    if (command.isImmediate()) {
      bot.command.busy = true;
      invoke(bot, command, clearBusyFlag);
    }
    else {
      bot.command.queue.push(command);

      if (! bot.command.busy) {
        invokeQueuedCommand(bot);
      }
    }
  });
};

var isNotForMe = function (bot, usernamePattern) {
  try {
    var pattern = new RegExp(usernamePattern);
    return ! bot.bot.username.match(pattern);
  }
  catch (exception) {
    return true;
  }
};

var invokeQueuedCommand = function (bot) {
  bot.command.busy = true;

  var command = bot.command.queue.shift();
  if (command === undefined) {
    bot.command.busy = false;
    return;
  }

  invoke(bot, command, function () {
    invokeQueuedCommand(bot);
  });
};

var invoke = function (bot, command, callback) {
  var notifyAndCallback = function (reason) {
    bot.bot.chat("Had problems: " + reason);
    console.log("Had problems: " + reason + "\n" + reason.stack);
    return callback();
  };
  command.invoke(bot).then(callback, notifyAndCallback);

  if (command.shouldAddToHistory()) {
    bot.command.history.push(command);
  }
};
