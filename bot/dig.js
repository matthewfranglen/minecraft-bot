/* jshint esnext: true */
// Wraps digging blocks

const DIG_RANGE = 5;


// This digs the point provided
// This must be called with a this value of the bot.
// This calls the callback with an object with the following fields:
// status:
//   success: dug requested block
//   range: out of range of the block
//   tool: equipment not suitable
//   missing: no block at point
//   interrupted: digging interrupted
exports.digBlock = function (point, callback) {
  var bot = this;
  var block = bot.blockAt(point);

  if (! block) {
    callback({ 'status': 'missing' });
  }
  if (bot.entity.position.distanceTo(point) >= DIG_RANGE) {
    callback({ 'status': 'range' });
  }
  if (! bot.canDigBlock(block)) {
    callback({ 'status': 'tool' });
  }

  bot.once('diggingCompleted', function () {
    callback({ 'status': 'success' });
  });
  bot.once('diggingAborted', function () {
    callback({ 'status': 'interrupted' });
  });
  bot.dig(block);
};
