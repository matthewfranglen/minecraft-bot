/* jshint esnext: true */
// Wraps behaviour chaining
//
// The aim with this is to be able to describe behaviour at a higher level. The
// chain will continue until it reaches an end point. The end point will then
// call the overall callback which can then decide what to do.

var dig = require("./dig.js");
var search = require("./search.js");
var navigate = require("./navigate.js");

// This digs blocks until the condition is reached or it cannot dig any more
// This must be called with a this value of the bot.
// The block name must be an entry in mcData.blocksByName
// This calls the callback with an object with the following fields:
// status:
//   success: dug all requested blocks
//   partial: dug some requested blocks
//   none: dug no requested blocks
//   missing: no such block
// blocks:
//   The list of block points.
//   This is always present, but only has values for success and partial statuses.
exports.digUntil = function (name, condition, callback) {
  console.log("Mining " + name + " until condition reached");

  var bot = this;
  var findBlock = search.findBlock.bind(bot);
  var walkTo = navigate.walkTo.bind(bot);
  var digBlock = dig.digBlock.bind(bot);

  var blocks = [];

  var rePerform = function () {
    if (! condition()) {
      complete();
      return;
    }

    perform(1, 10);
  };

  var perform = function (count, limit) {
    console.log("Starting loop " + count + ", " + limit);

    var findCallback = function (result) {
      console.log("Find callback " + result.status + ", " + result.blocks);
      if (result.status === 'success') {
        digFirstAccessiblePoint(result.blocks, result.blocks.length - 1, function (point) {
          if (count > limit) {
            complete();
            return;
          }
          if (! point) {
            perform(count + 1, limit);
            return;
          }

          blocks.push(point);
        });
      }
      else if (result.status === 'partial') {
        digFirstAccessiblePoint(result.blocks, 0, function (point) {
          if (! point) {
            complete();
            return;
          }

          blocks.push(point);
        });
      }
      else {
        complete();
      }
    };

    var digFirstAccessiblePoint = function (points, index, callback) {
      console.log('walk and dig ' + points.length + ", " + index);
      if (index >= points.length) {
        callback();
        return;
      }

      walkTo(points[index], function (result) {
        console.log('walk callback ' + result);
        if (result.status === 'timeout' || result.status === 'tooFar') {
          callback();
          return;
        }

        digBlock(points[index], function (result) {
          console.log('dig callback ' + result.status);
          if (result.status === 'success') {
            callback(points[index]);
            return;
          }

          digFirstAccessiblePoint(points, index + 1, callback);
        });
      });
    };

    findBlock(name, findCallback, count);
  };

  var complete = function (success) {
    if (success) {
      callback({ 'status': 'success', 'blocks': blocks });
    }
    else if (blocks) {
      callback({ 'status': 'partial', 'blocks': blocks });
    }
    else {
      callback({ 'status': 'none', 'blocks': blocks });
    }
  };

  perform(1, 10);
};
