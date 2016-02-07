/* jshint esnext: true */

var offsetToPoint = function (bot, offset) {
  if (offset.length) {
    return bot.entity.position.offset(offset[0], offset[1], offset[2]);
  }
  else {
    return bot.entity.position.offset(offset.x, offset.y, offset.z);
  }
};

export default {
  offsetToPoint: offsetToPoint
};
