/* jshint esnext: true */

var mineflayer = require('mineflayer');

var worldLib = require('./world.js');
var chatLib = require('./chat.js');
var digLib = require('./dig.js');
var navigateLib = require('./navigate.js');
var inventoryLib = require('./inventory.js');
var navigatePlugin = require('mineflayer-navigate')(mineflayer);

exports.createBot = function (name) {
  var bot = mineflayer.createBot({
      host: '192.168.1.50',
      port: 25565,
      username: name
  });

  navigatePlugin(bot);
  handleEvents(bot);

  var botWrapper = {
    bot: bot,

    dig: {
      point: digLib.digPoint.bind(bot),
      offset: digLib.digOffset.bind(bot),
      shape: digLib.digShape.bind(bot)
    },

    move: {
      point: navigateLib.walkToPoint.bind(bot),
      offset: navigateLib.walkToOffset.bind(bot)
    },

    look: lookAt.bind(bot),
    toss: inventoryLib.tossAll.bind(bot),
    stop: stop.bind(bot),
    quit: bot.quit.bind(bot)
  };
  chatLib.enableChatCommands(botWrapper);

  return botWrapper;
};

var handleEvents = function (bot) {
  var onEnd = function () {
    console.log('I have been disconnected');
  };

  var onLogin = function () {
    console.log(bot.username + " logged in");
  };

  var onKick = function (reason, loggedIn) {
    console.log('I was kicked for ' + reason);
  };

  var onChat = function (username, message) {
    console.log(username+' says: '+message);
  };

  bot.on('chat', onChat);
  bot.on('login', onLogin);
  bot.on('end', onEnd);
  bot.on('kicked', onKick);
};

var lookAt = function (direction) {
  var bot = this;

  if (worldLib.isInvalidDirection(direction)) {
    return Promise.reject("Unrecognized direction " + direction);
  }

  switch (direction) {
    case 'north':
    case 'south':
    case 'east':
    case 'west':
      bot.lookAt(worldLib.offsetToPoint(bot, direction, [1, 0, 1.5]));
      break;
    case 'up':
    case 'down':
      bot.lookAt(worldLib.offsetToPoint(bot, direction, [3, 0, 0]));
      break;
  }
};

var stop = function () {
  var bot = this;

  if (bot.targetDigBlock) {
    bot.stopDigging();
  }
  bot.navigate.stop();
};
