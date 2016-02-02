/* jshint esnext: true */

exports.tossAll = function () {
  var bot = this;
  var items = bot.inventory.slots.filter(v => v);

  if (! items) {
    return Promise.reject('no items to toss');
  }

  var tossOne = function (items) {
    var item = items.pop();
    if (! item) {
      return Promise.resolve();
    }

    return tossStack(bot, item).then(function () {
      tossOne(items);
    });
  };

  return tossOne(items);
};

var tossStack = function (bot, item) {
  return new Promise(function (resolve, reject) {
    bot.tossStack(item, function () {
      resolve('success');
    });
  });
};
