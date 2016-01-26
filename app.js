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

var search = require('./bot/search.js');
var navigate = require('./bot/navigate.js');
var behave = require('./bot/behave.js');

var start = function () {
  var count = 0;
  var condition = function () {
    count++;
    console.log("Checking condition " + count + " < 10");

    return count < 10;
  };

  var digUntil = behave.digUntil.bind(bot);
  digUntil("log", condition).then(function (result) {
    console.log("Digging of logs was successful");
    console.log("Dug " + result.blocks.length + " logs");
    bot.quit("quitting");
  },
  function (result) {
    console.log("Digging of logs was unsuccessful: " + result);
    bot.quit("quitting");
  });
};

bot.on('end', function () {
  console.log('I have been disconnected');
});
bot.on('kicked', function (reason, loggedIn) {
  console.log('I was kicked for ' + reason);
});

bot.once('spawn', function() {
  console.log(bot.username + ' logged in.');
  console.log(bot.entity.position);

  search.install(bot);
  navigate.install(bot);

  setTimeout(start, 1000);
});

// var repl = require('./bot/REPL.js');
// repl.enableRepl(bot, mineflayer);
