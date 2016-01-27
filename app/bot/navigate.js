/* jshint esnext: true */
// Wraps walking around

var mineflayer = require('mineflayer');
var navigatePlugin = require('mineflayer-navigate')(mineflayer);
var worldLib = require('./world.js');

exports.install = function (bot) {
  navigatePlugin(bot);
};

// This walks to the point provided.
// This must be called with a this value of the bot.
// The point must be a vec3 or an array of x, y, z
// This returns a promise which is completed with the following values:
//   arrived: walked to within 1 square of the point
//   obstructed: walked but coult not reach point
//   interrupted: walking was interrupted
//
// If the walk was unsuccessful the error will be:
//   timeout: path search timed out
//   tooFar: distance to point too far
var walkToPoint = function (bot, point) {
  bot.chat("Walking from " + bot.entity.position + " to " + point);
  bot.navigate.stop();

  var promise = new Promise(function (resolve, reject) {
    clearListeners(bot);

    bot.navigate.once('arrived', function () {
      resolve('arrived');
    });
    bot.navigate.once('interrupted', function () {
      resolve('interrupted');
    });
    bot.navigate.once('obstructed', function () {
      resolve('obstructed');
    });
    bot.navigate.once('cannotFind', function (closestPath) {
      reject('cannotFind');
      return;
    });

    bot.navigate.to(point, { endRadius: 1, tooFarThreshold: 25 });
  });

  return promise;
};

exports.walkToPoint = function (point) {
  var bot = this;

  return walkToPoint(bot, point);
};

exports.walkToOffset = function (direction, offset) {
  if (worldLib.isInvalidDirection(direction)) {
    return Promise.reject("Unrecognized direction " + direction);
  }
  var bot = this;

  return walkToPoint(bot, worldLib.offsetToPoint(bot, direction, offset));
};

var clearListeners = function (bot) {
  bot.navigate.removeAllListeners('arrived');
  bot.navigate.removeAllListeners('interrupted');
  bot.navigate.removeAllListeners('obstructed');
  bot.navigate.removeAllListeners('cannotFind');
};