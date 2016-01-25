/* jshint esnext: true */
// Wraps walking around

var mineflayer = require('mineflayer');
var navigatePlugin = require('mineflayer-navigate')(mineflayer);

exports.install = function (bot) {
  navigatePlugin(bot);
};

exports.walkTo = function (bot, point, callback, errorCallback) {
  bot.navigate.once('pathFound', function (path) {
    console.log('navigate: found path. I can get there in ' + path.length + ' moves.');
    bot.navigate.walk(path);
  });
  bot.navigate.once('cannotFind', function (path) {
    console.log('navigate: found partial path. I can get there in ' + path.length + ' moves.');

    if (path.length < 2) {
      callback();
    }
    else {
      bot.navigate.walk(path);
    }
  });
  bot.navigate.once('arrived', function () {
    callback();
  });
  bot.navigate.once('stop', function() {
    errorCallback("Cannot complete path");
  });

  bot.navigate.to(point);
};
