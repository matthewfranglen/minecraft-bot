/* jshint esnext: true */

export default function (bot, item) {
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
}
