/* jshint esnext: true */

import offsetToPoint from '../../thing/point';

export default function (bot, offset) {
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
}
