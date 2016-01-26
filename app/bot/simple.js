
exports.install = function (bot) {
  bot.simple = {
    pointAt: function (x, y, z) {
      return pointAt(bot, x, y, z);
    },
    lookAt: function (x, y, z) {
      return lookAt(bot, x, y, z);
    },
    blockAt: function (x, y, z) {
      return blockAt(bot, x, y, z);
    },
    moveTo: function (x, y, z, callback) {
      return moveTo(bot, x, y, z, callback);
    },
    digAt: function (x, y, z, callback) {
      return digAt(bot, x, y, z, callback);
    },
    digAll: function (blocks, callback) {
      digAll(bot, blocks, callback);
    }
  };
};

pointAt = function (bot, x, y, z) {
  return bot.entity.position.offset(x, y, z);
};

lookAt = function (bot, x, y, z) {
  return bot.lookAt(pointAt(bot, x, y, z));
};

blockAt = function (bot, x, y, z) {
  return bot.blockAt(pointAt(bot, x, y, z));
};

moveTo = function (bot, x, y, z, callback) {
  if (callback) {
    bot.navigate.once('arrived', callback);
  }
  bot.navigate.to(pointAt(bot, x, y, z));
};

digAt = function (bot, x, y, z, callback) {
  bot.dig(blockAt(bot, x, y, z), callback);
};

// blocks = [[1, 2, 0], [1, 2, 1], [1, 1, 0], [1, 1, 1], [1, 0, 0], [1, 0, 1]];

digAll = function (bot, blocks, callback) {
  remaining = blocks.slice();
  digAllLoop(bot, remaining, callback);
};

digAllLoop = function (bot, remaining, callback) {
  current = remaining.pop();
  if (current) {
    var digAgain = function () {
      digAllLoop(bot, remaining, callback);
    };
    digAt(bot, current[0], current[1], current[2], digAgain);
  }
  else {
    callback();
  }
};
