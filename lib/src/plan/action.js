/* jshint esnext: true */

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

};

var say = function (bot, message) {

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
