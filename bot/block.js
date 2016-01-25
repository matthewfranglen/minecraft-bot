/* jshint esnext: true */
// Wraps finding blocks and digging them

var mcData = require("minecraft-data")("1.8.8");
var mineflayer = require('mineflayer');
var blockFinder = require('mineflayer-blockfinder')(mineflayer);

exports.install = function (bot) {
  blockFinder(bot);
};

exports.findBlock = function (bot, name, callback, errorCallback) {
  var block = mcData.blocksByName[name];
  console.log("Searching for block " + name);

  if (! block) {
    errorCallback("No block with name " + name);
    return;
  }

  var points = bot.findBlockSync({
    point: bot.entity.position,
    matching: block.id
  });
  callback(points);
};

exports.digBlock = function (bot, name, callback, errorCallback) {
  console.log("Digging block " + name);

  var dig = function(points) {
    if (points.length) {
      exports.dig(bot, points[0].position, callback, errorCallback);
    }
    else {
      errorCallback("No " + name + " blocks found");
    }
  };

  exports.findBlock(bot, name, dig, errorCallback);
};

exports.dig = function (bot, point, callback, errorCallback) {
  var block = bot.blockAt(point);

  if (! block) {
    errorCallback("No block at offset " + point);
    return;
  }
  if (! bot.canDigBlock(block)) {
    errorCallback("Cannot dig " + block);
    return;
  }

  console.log("Digging block at " + point);
  bot.dig(block, callback, function (error) {
    if (error) {
      errorCallback(error);
    }
    else {
      callback();
    }
  });
};
