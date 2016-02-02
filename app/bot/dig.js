/* jshint esnext: true */
// Wraps digging blocks

var worldLib = require('./world.js');

const DIG_RANGE = 5;

var useBestEquipment = function (bot, point) {
  var block = bot.blockAt(point);
  var tool = getFastestToolForBlock(bot, block);

  console.log("I consider " + tool.name + " to be fastest for " + block.name);

  if ((! tool) && block.harvestTools) {
    return Promise.reject("No suitable tool");
  }
  if (block.digTime(tool.type) < block.digTime()) {
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
  var inventory = bot.inventory.slots.filter(v => v);
  var tools;

  if (! block.harvestTools) {
    tools = inventory;
  }
  else {
    var canHarvest = function (item) {
      return block.harvestTools[item.type];
    };

    tools = inventory.filter(canHarvest);
  }

  if (! tools) {
    return undefined;
  }

  var toSpeedToolArray = function (tool) {
    return [block.digTime(tool.type), tool];
  };
  var fastest = function (best, current) {
    if (best[0] <= current[0]) {
      return best;
    }
    return current;
  };

  var tool = tools.map(toSpeedToolArray).reduce(fastest);

  return tool[1];
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
