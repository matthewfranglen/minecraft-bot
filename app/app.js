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
    primaryBot.bot.chat('Creating bot ' + parts[1]);
    bot.createBot(parts[1]);
  }
});
