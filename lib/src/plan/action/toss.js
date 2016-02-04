/* jshint esnext: true */

export default function (bot, item, offset) {
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
}
