// REPL example bot for mineflayer
//
// Connects to server but doesn't have any built in logic. The terminal where
// it was started is now a REPL (Read-Eval-Print-Loop). Anything typed will be
// interpreted as javascript printed using util.inspect. Don't forget to try
// tab completion. These variables are exposed as local:
//
// var mineflayer = require('mineflayer');
// var bot = mineflayer.createBot({ username: 'REPL' });
//
// Examples:
//
// Navigate to named player (requires optional mineflayer-navigate):
// bot.navigate.to(bot.players.vogonistic.entity.position)

var fs = require('fs');
var os = require('os');
var repl = require('./bot/REPL.js');

var settings = require('./knowledge/identity.json');

// create and connect the bot
var mineflayer = require('mineflayer');
var bot = mineflayer.createBot({
    host: '192.168.1.50',
    port: 25565,
    username: settings.username,
    password: settings.password
});

repl.enableRepl(bot, mineflayer);
