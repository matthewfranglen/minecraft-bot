/* jshint esnext: true */

var fs = require('fs');
var os = require('os');
var mineflayer = require('mineflayer');

var repl = require('./bot/REPL.js');
var simple = require('./bot/simple.js');
var navigatePlugin = require('mineflayer-navigate')(mineflayer);

var settings = require('./knowledge/identity.json');

var createBot = function (name) {
  // create and connect the bot
  var bot = mineflayer.createBot({
      host: '192.168.1.50',
      port: 25565,
      username: name
  });

  bot.on('end', function () {
    console.log('I have been disconnected');
  });

  bot.on('kicked', function (reason, loggedIn) {
    console.log('I was kicked for ' + reason);
  });

  navigatePlugin(bot);
  simple.install(bot);

  return bot;
};

var primaryBot = createBot(settings.username);
repl.enableRepl(primaryBot, mineflayer);
primaryBot.on('chat', function (username, message) {
  var parts = message.split(' ');

  if (parts[0] === 'create') {
    primaryBot.chat('Creating bot ' + parts[1]);
    createBot(parts[1]);
  }
});
