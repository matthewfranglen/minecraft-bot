/* jshint esnext: true */

import mineflayer from 'mineflayer';
import dbLib from './src/state/database';
import replLib from './src/repl';

var init = function () {
  dbLib.init(dbLib.DEFAULT_SETTINGS);
};

var create = function (name) {
  return mineflayer.createBot({
    host: '192.168.1.50',
    port: 25565,
    username: name
  });
};

var repl = function (bot) {
  replLib(bot, mineflayer);
};

export default {
  init: init,
  create: create,
  repl: repl
};
