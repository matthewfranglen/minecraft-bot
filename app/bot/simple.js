/* jshint esnext: true */

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
    canDigAt: function (x, y, z) {
      return canDigAt(bot, x, y, z);
    },
    digAt: function (x, y, z, callback) {
      return digAt(bot, x, y, z, callback);
    },
    digAll: function (blocks, callback) {
      digAll(bot, blocks, callback);
    },
    tossAll: function (callback) {
      tossAll(bot, callback);
    }
  };

  bot.on('chat', function (username, message) {
    if (message === 'come') {
      bot.navigate.to(bot.players[username].entity.position);
    }
    else if (message === 'toss') {
      tossAll(bot, function () {});
    }
  });

  var checkEquipment = function () {
    if (bot.targetDigBlock && ! bot.entity.heldItem) {
      console.log('I am stopping digging');
      bot.stopDigging();
    }
  };

  bot.on('entityEquipmentChange', function (entity) {
    console.log('Someone has changed their equipment');
    checkEquipment();
  });
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

canDigAt = function (bot, x, y, z) {
  if (! bot.entity.heldItem) {
    return false;
  }
  var block = blockAt(bot, x, y, z);

  return block.canHarvest(bot.entity.heldItem.type) && bot.canDigBlock(block);
};

moveTo = function (bot, x, y, z, callback) {
  if (callback) {
    bot.navigate.once('arrived', callback);
  }
  bot.navigate.to(pointAt(bot, x, y, z));
};

digAt = function (bot, x, y, z, callback) {
  if (canDigAt(bot, x, y, z)) {
    bot.dig(blockAt(bot, x, y, z), callback);
  }
  else {
    callback();
  }
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

tossAll = function (bot, callback) {
  remaining = bot.inventory.slots.filter(v => v);
  tossAllLoop(bot, remaining, callback);
};

tossAllLoop = function (bot, remaining, callback) {
  current = remaining.pop();
  if (current) {
    var loop = function () {
      tossAllLoop(bot, remaining, callback);
    };
    bot.tossStack(current, loop);
  }
  else {
    callback();
  }
};
