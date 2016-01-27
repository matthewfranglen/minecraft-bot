/* jshint esnext: true */
// Wraps digging blocks

var worldLib = require('./world.js');

const DIG_RANGE = 5;


// This digs the point provided
// This must be called with a this value of the bot.
//
// This returns a promise which is completed with the following values:
//   success: dug requested block
//
// If the dig was unsuccessful the error will be:
//   range: out of range of the block
//   tool: equipment not suitable
//   missing: no block at point
//   interrupted: digging interrupted
exports.digPoint = function (point) {
  console.log("Digging the point: " + point);
  var bot = this;
  var block = bot.blockAt(point);
  bot.chat('Digging at ' + point);

  var promise = new Promise(function (resolve, reject) {
    if (! block) {
      reject('missing');
      return;
    }
    if (bot.entity.position.distanceTo(point) >= DIG_RANGE) {
      reject('range');
      return;
    }
    if (! bot.canDigBlock(block)) {
      reject('tool');
      return;
    }

    bot.once('diggingCompleted', function () {
      resolve('success');
    });
    bot.once('diggingAborted', function () {
      reject('interrupted');
    });
    bot.dig(block);
  });

  return promise;
};

exports.digOffset = function (direction, offset) {
  if (worldLib.isInvalidDirection(direction)) {
    return Promise.reject("Unrecognized direction " + direction);
  }
  var bot = this;

  return exports.dig(worldLib.offsetToPoint(bot, direction, offset));
};

exports.digShape = function (direction, shape) {
  if (isInvalidDirection(direction)) {
    return Promise.reject("Unrecognized direction " + direction);
  }
  var bot = this;

  return shapeTracer(bot, direction, shape, dig);
};

var shapeTracer = function (bot, direction, shape, f) {
  var trace = function (shape) {
    var offset = shape.pop();
    if (! offset) {
      return;
    }

    var point = offsetToPoint(bot, direction, offset);
    var recur = function () {
      return trace(shape);
    };
    return f(point).then(recur, recur);
  };

  return trace(shape.slice());
};
