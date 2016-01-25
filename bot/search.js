/* jshint esnext: true */
// Wraps finding blocks

var mcData = require("minecraft-data")("1.8.8");
var mineflayer = require('mineflayer');
var blockFinder = require('mineflayer-blockfinder')(mineflayer);

exports.install = function (bot) {
  blockFinder(bot);
};

// This finds points with the block provided.
// This must be called with a this value of the bot.
// The block name must be an entry in mcData.blocksByName
// This calls the callback with an object with the following fields:
// status:
//   success: found all requested blocks
//   partial: found some requested blocks
//   none: found no requested blocks
//   missing: no such block
// blocks:
//   The list of block points.
//   This is always present, but only has values for success and partial statuses.
exports.findBlock = function (name, callback, count) {
  var bot = this;
  var block = mcData.blocksByName[name];

  if (! block) {
    callback({ status: 'missing', blocks: [] });
    return;
  }

  var points = bot.findBlockSync({
    point: bot.entity.position,
    matching: block.id,
    count: count || 1
  });
  if (points.length >= count) {
    callback({ 'status': 'success', 'blocks': points.map(p => p.position) });
  }
  else if (points.length) {
    callback({ 'status': 'partial', 'blocks': points.map(p => p.position) });
  }
  else {
    callback({ 'status': 'none', 'blocks': [] });
  }
};
