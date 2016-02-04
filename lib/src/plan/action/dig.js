/* jshint esnext: true */

const DIG_RANGE = 5;

import offsetToPoint from '../../thing/point';

export default function (bot, offset) {
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
    console.log('calling dig');

    bot.dig(block);
  });

  return promise;
}
