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

    var parts = message.split(' ', 2);
    if (isNotForMe(bot, parts[0])) {
      return;
    }

    var command = parser.parse(username, parts[1]);
    if (! command) {
      bot.bot.chat("Unknown command " + command);
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

var isNotForMe = function (bot, messageParts) {
  try {
    var pattern = new RegExp(messageParts[0]);
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
    bot.bot.chat(reason);
    return callback();
  };
  command.invoke(bot).then(callback, notifyAndCallback);

  if (command.shouldAddToHistory()) {
    bot.command.history.push(command);
  }
};
