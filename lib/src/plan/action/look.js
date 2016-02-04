/* jshint esnext: true */

import offsetToPoint from '../../thing/point';

export default function (bot, offset) {
  return new Promise(function (resolve, reject) {
    bot.lookAt(offsetToPoint(bot, offset), false, resolve);
  });
}
