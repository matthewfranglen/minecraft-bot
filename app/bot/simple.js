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

  blocks = [[1, 2, -1], [1, 2, 0], [1, 2, 1], [1, 1, -1], [1, 1, 0], [1, 1, 1], [1, 0, -1], [1, 0, 0], [1, 0, 1]];

  var directions = {
    north: {
      walk: [0, 0, 1],
      blocks: []
    },
    east: {
      walk: [-1, 0, 0],
      blocks: []
    },
    south: {
      walk: [0, 0, -1],
      blocks: []
    },
    west: {
      walk: [1, 0, 0],
      blocks: []
    }
  };

  var repeat = function (f, count) {
    if (count > 0) {
      f(function () { repeat(f, count - 1); });
    }
  };

  // x, y, z: x and z are horizontal and y is vertical
  // x is left and right and z is forward and backward
  // north: z + 1
  // east: x - 1
  // south: z - 1
  // west: x + 1
  // This makes up 3x3 square templates in each direction for mining.
  // A given direction is fixed in the major direction, varies from -1 to 1 in the minor direction, and varies from 0 to 2 in yshapes.
  for (y = 0; y < 3; y++) {
    for (minor = -1; minor <= 1; minor++) {
      directions.north.blocks.push([minor, y, 1]);
      directions.east.blocks.push([-1, y, minor]);
      directions.south.blocks.push([minor, y, -1]);
      directions.west.blocks.push([1, y, minor]);
    }
  }

  var commandPattern = new RegExp('^([^ ]+) ([^ ]+)(?: (.+))?$');
  var NAME_INDEX = 1;
  var COMMAND_INDEX = 2;
  var ARGUMENTS_INDEX = 3;

  var commands = {
    come: function (cmd) {
      bot.chat("Coming...");
      bot.navigate.to(bot.players[cmd.from].entity.position);
    },
    toss: function () {
      bot.chat("Tossing...");
      tossAll(bot, function () {});
    },
    dig: function (cmd) {
      var direction = cmd.args[0];
      var count = cmd.args[1] || 1;

      if (! (direction in directions)) {
        bot.chat("Unknown direction " + direction);
        return;
      }
      bot.chat("Digging...");

      var current = directions[direction];
      var digBlocks = function (callback) {
        digAll(bot, current.blocks, function () { walkForward(callback); });
      };
      var walkForward = function (callback) {
        moveTo(bot, current.walk[0], current.walk[1], current.walk[2], callback);
      };

      repeat(digBlocks, count);
    },
    look: function (cmd) {
      var direction = cmd.args[0];
      if (! (direction in directions)) {
        bot.chat("Unknown direction " + direction);
        return;
      }
      bot.chat("Looking...");

      var current = directions[direction];
      lookAt(bot, current.walk[0], current.walk[1] + 1.5, current.walk[2]);
    }
  };
  bot.on('chat', function (username, message) {
    if (username === bot.username) {
      return;
    }

    var match = message.match(commandPattern);
    var args;
    if (! match) {
      return;
    }
    if (match[ARGUMENTS_INDEX]) {
      args = match[ARGUMENTS_INDEX].split(' ');
    }
    else {
      args = [];
    }

    var cmd = {
      from: username,
      to: match[NAME_INDEX],
      command: match[COMMAND_INDEX],
      args: args
    };

    if (cmd.to === bot.username) {
      if (cmd.command in commands) {
        commands[cmd.command](cmd);
      }
      else {
        bot.chat("Unknown command " + cmd.command);
      }
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
