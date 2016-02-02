/* jshint esnext: true */
// Wraps digging blocks

var worldLib = require('./world.js');

const DIG_RANGE = 5;

var useBestEquipment = function (bot, point) {
  var block = bot.blockAt(point);
  var tool = getFastestToolForBlock(bot, block);

  if ((! tool) && block.harvestTools) {
    return Promise.reject("No suitable tool");
  }
  if (block.digTime(tool) < block.digTime()) {
    return equipTool(bot, tool);
  }
  if (bot.entity.heldItem) {
    return unequipTool(bot);
  }
  return Promise.resolve();
};

var equipTool = function (bot, tool) {
  if (tool === bot.entity.heldItem) {
    return Promise.resolve();
  }

  return new Promise(function (resolve, reject) {
    bot.equip(tool, "hand", function (error) {
      if (error) {
        reject(error);
      }
      else {
        resolve();
      }
    });
  });
};

var unequipTool = function (bot) {
  return new Promise(function (resolve, reject) {
    bot.unequip("hand", function (error) {
      if (error) {
        reject(error);
      }
      else {
        resolve();
      }
    });
  });
};

var getFastestToolForBlock = function (bot, block) {
  var tools;

  if (! block.harvestTools) {
    tools = bot.inventory.slots;
  }
  else {
    var canHarvest = function (item) {
      return item && block.harvestTools[item.type];
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

  var tool = tools.reduce(fastest, undefined);

  if (tool && tool[1]) {
    return tool[1].type;
  }
  return undefined;
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
var dig = function (bot, point) {
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

var digPoint = function (bot, point) {
  return useBestEquipment(bot, point).then(function () {
    return dig(bot, point);
  });
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
