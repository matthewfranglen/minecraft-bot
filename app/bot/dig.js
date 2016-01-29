/* jshint esnext: true */
// Wraps digging blocks

var worldLib = require('./world.js');

const DIG_RANGE = 5;

var useBestEquipment = function (bot, point) {
  var block = bot.blockAt(point);

  var tools;
  if (! block.harvestTools) {
    tools = bot.inventory.slots;
  }
  else {
    var canHarvest = function (item) {
      return block.harvestTools.indexOf(item) >= 0;
    };

    tools = bot.inventory.slots.filter(canHarvest);
  }

  var fastest = function (best, tool) {
    var current = [block.digTime(tool), tool];

    if (best && best[0] <= current) {
      return best;
    }
    return current;
  };

  var tool = tools.reduce(fastest)[1];
  var equip = function (tool) {
    return function (resolve, reject) {
      bot.equip(tool, "hand", function (error) {
        if (error) {
          reject(error);
        }
        else {
          resolve();
        }
      });
    };
  };

  if (block.digTime(tool) < block.digTime() && tool != bot.entity.heldItem) {
    return new Promise(equip(tool));
  }
  else if (bot.entity.heldItem) {
    return new Promise(equip(undefined));
  }
};

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
var digPoint = function (bot, point) {
  console.log("Digging the point: " + point);

  useBestEquipment(bot, point);
  var block = bot.blockAt(point);

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

exports.digPoint = function (point) {
  var bot = this;

  return digPoint(bot, point);
};

exports.digOffset = function (direction, offset) {
  if (worldLib.isInvalidDirection(direction)) {
    return Promise.reject("Unrecognized direction " + direction);
  }
  var bot = this;

  return digPoint(bot, worldLib.offsetToPoint(bot, direction, offset));
};

exports.digShape = function (direction, shape) {
  if (worldLib.isInvalidDirection(direction)) {
    return Promise.reject("Unrecognized direction " + direction);
  }
  var bot = this;
  var dig = function (point) {
    return digPoint(bot, point);
  };

  return shapeTracer(bot, direction, shape, dig);
};

var shapeTracer = function (bot, direction, shape, f) {
  var trace = function (shape) {
    var offset = shape.pop();
    if (! offset) {
      return;
    }

    var point = worldLib.offsetToPoint(bot, direction, offset);
    var recur = function () {
      return trace(shape);
    };
    return f(point).then(recur, recur);
  };

  return trace(shape.slice());
};
