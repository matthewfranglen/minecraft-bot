/* jshint esnext: true */

import point from '../../thing/point';

export default function (bot, offset) {
  return new Promise(function (resolve, reject) {
    console.log(bot.lookAt);
    bot.lookAt(point.offsetToPoint(bot, offset), false, resolve);
  });
}
