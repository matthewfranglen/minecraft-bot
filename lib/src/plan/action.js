/* jshint esnext: true */

const DIG_RANGE = 5;

var offsetToPoint = function (bot, offset) {
  return bot.entity.position.offset(offset);
};

var use = function (bot, item) {

};

var toss = function (bot, item, offset) {
  var perform = function (resolve) {
    bot.tossStack(item, function () {
      resolve('success');
    });
  };

  if (offset) {
    return look(offset).then(function () {
      return new Promise(perform);
    });
  }
  return new Promise(perform);
};

var equip = function (bot, item) {
  var perform = function (resolve, reject) {
    return function (error) {
      if (error) {
        reject(error);
      }
      else {
        resolve();
      }
    };
  };

  if (item) {
    return new Promise(function (resolve, reject) {
      bot.equip(item, "hand", perform(resolve, reject));
    });
  }
  return new Promise(function (resolve, reject) {
    bot.unequip("hand", perform(resolve, reject));
  });
};

var look = function (bot, offset) {
  return new Promise(function (resolve, reject) {
    bot.lookAt(offsetToPoint(bot, offset), false, resolve);
  });
};

var move = function (bot, offset) {
  return new Promise(function (resolve, reject) {
    bot.navigate.walk([offsetToPoint(bot, offset)], function (reason) {
      if (reason === 'arrived') {
        resolve();
      }
      else {
        reject(reason); // interrupted / obstructed
      }
    });
  });
};

var dig = function (bot, offset) {
  var block = bot.blockAt(offsetToPoint(bot, offset));

  var clearListeners = function (bot) {
    bot.removeAllListeners('diggingCompleted');
    bot.removeAllListeners('diggingAborted');
  };

  var promise = new Promise(function (resolve, reject) {
    if (! block) {
      reject('missing');
      return;
    }
    if (bot.entity.position.distanceTo(offset) >= DIG_RANGE) {
      reject('range');
      return;
    }
    if (! bot.canDigBlock(block)) {
      reject('tool');
      return;
    }

    bot.once('diggingCompleted', function () {
      clearListeners();
      resolve('success');
    });
    bot.once('diggingAborted', function () {
      clearListeners();
      reject('interrupted');
    });

    bot.dig(block);
  });

  return promise;
};

var say = function (bot, message) {
  bot.chat(message);

  return Promise.resolve();
};

export default {
  use: use,
  toss: toss,
  equip: equip,
  look: look,
  move: move,
  dig: dig,
  say: say
};
