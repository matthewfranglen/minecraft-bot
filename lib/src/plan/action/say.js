/* jshint esnext: true */

export default function (bot, message) {
  bot.chat(message);

  return Promise.resolve();
}
