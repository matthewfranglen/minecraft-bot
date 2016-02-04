/* jshint esnext: true */

var offsetToPoint = function (bot, offset) {
  return bot.entity.position.offset(offset);
};

export default {
  offsetToPoint: offsetToPoint
};
