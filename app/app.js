/* jshint esnext: true */

var fs = require('fs');
var os = require('os');
var mineflayer = require('mineflayer');

var settings = require('./knowledge/identity.json');

// create and connect the bot
var bot = mineflayer.createBot({
    host: '192.168.1.50',
    port: 25565,
    username: settings.username,
    password: settings.password
});

bot.on('end', function () {
  console.log('I have been disconnected');
});

bot.on('kicked', function (reason, loggedIn) {
  console.log('I was kicked for ' + reason);
});

var repl = require('./bot/REPL.js');
var simple = require('./bot/simple.js');

simple.install(bot);
repl.enableRepl(bot, mineflayer);
