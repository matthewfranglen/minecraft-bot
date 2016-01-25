/* jshint esnext: true */
// Wraps behaviour chaining
//
// The aim with this is to be able to describe behaviour at a higher level. The
// chain will continue until it reaches an end point. The end point will then
// call the overall callback which can then decide what to do.

var block = require("./block.js");
var navigate = require("./navigate.js");

exports.digUntil = function (bot, name, condition, callback) {
  console.log("Mining " + name + " until condition reached");

  var walkCallback = function () {
    digBlock(bot, name, digCallback, callback);
  };

  var digCallback = function () {
    if (condition()) {
      perform();
    }
    else {
      callback();
    }
  };

  var perform = function () {
    walkToBlock(bot, name, walkCallback, callback);
  };

  perform();
};

var walkToBlock = function (bot, name, callback, errorCallback) {
  var pathFound = function (points) {
    console.log("Found " + name + " at " + points.map(p => p.position));
    navigate.walkTo(bot, points[0].position, callback, callback);
  };

  block.findBlock(bot, name, pathFound, errorCallback);
};

var digBlock = function (bot, name, callback, errorCallback) {
  block.digBlock(bot, name, callback, errorCallback);
};
