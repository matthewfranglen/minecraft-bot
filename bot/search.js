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
// This returns a promise which is completed with the following values:
// status:
//   success: found all requested blocks
//   partial: found some requested blocks
// blocks:
//   The list of block points.
//   This is always present, but only has values for success and partial statuses.
//
// If the search was unsuccessful the error will be:
//   none: found no requested blocks
//   missing: no such block
exports.findBlock = function (name, count) {
  var bot = this;
  bot.chat('Looking for ' + name);

  var promise = new Promise(function (resolve, reject) {
    var block = mcData.blocksByName[name];

    if (! block) {
      reject('missing');
      return;
    }

    var points = bot.findBlockSync({
      point: bot.entity.position,
      matching: block.id,
      count: count || 1
    });

    if (points.length >= count) {
      resolve({ 'status': 'success', 'blocks': points.map(p => p.position) });
    }
    else if (points.length) {
      resolve({ 'status': 'partial', 'blocks': points.map(p => p.position) });
    }
    else {
      reject('none');
    }
  });

  return promise;
};
