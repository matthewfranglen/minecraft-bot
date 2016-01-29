/* jshint esnext: true */

var fs = require('fs');
var os = require('os');
var mineflayer = require('mineflayer');

var repl = require('./bot/REPL.js');
var bot = require('./bot/bot.js');
var settings = require('./knowledge/identity.json');

var primaryBot = bot.createBot(settings.username);
repl.enableRepl(primaryBot, mineflayer);
primaryBot.bot.on('chat', function (username, message) {
  var parts = message.split(' ');

  if (parts[0] === 'create') {
    for (i = 1; i < parts.length; i++) {
      createBot(parts[i]);
    }
  }
});

var createBot = function (name) {
  primaryBot.bot.chat('Creating bot ' + name);
  bot.createBot(name);
};
