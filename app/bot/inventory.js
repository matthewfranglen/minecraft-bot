/* jshint esnext: true */

exports.tossAll = function () {
  var bot = this;

  var tossOne = function (items) {
    var item = items.pop();
    if (! item) {
      return;
    }
    return tossStack(bot, item).then(function () {
      tossOne(items);
    });
  };

  return tossOne(bot.inventory.slots.filter(v => v));
};

var tossStack = function (bot, item) {
  return new Promise(function (resolve, reject) {
    if (! item) {
      reject('missing');
      return;
    }

    bot.tossStack(item, function () {
      resolve('success');
    });
  });
};
