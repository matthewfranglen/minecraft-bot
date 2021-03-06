/* jshint esnext: true */

import fs from 'fs';
import os from 'os';
import path from 'path';
import repl from 'repl';

export default function (bot, mineflayer) {

  // create repl interface
  var historyFile = path.join(os.tmpDir(), 'bot_repl_history.json');
  var r = repl.start('> ');
  r.context.bot = bot;
  r.context.mineflayer = mineflayer;
  r.on('exit', function onExitSaveHistory() {
    // ensure the history are available during the next sessions again
    console.log('quitting.');
    bot.quit();
    fs.writeFile(historyFile, JSON.stringify(r.rli.history), function(err) {
      process.exit();
    });
  });

  // load repl history
  fs.readFile(historyFile, function onLoadReadHistory(err, data) {
    if (!err && data) {
      r.rli.history = JSON.parse(data);
    }
  });
}
