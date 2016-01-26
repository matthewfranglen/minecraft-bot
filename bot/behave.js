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
//
// This returns a promise which is completed with the following values:
// status:
//   success: dug all requested blocks
//   partial: dug some requested blocks
// blocks:
//   The list of block points.
//
// If the search and dig was unsuccessful the error will be:
//   none: dug no requested blocks
//   missing: no such block
exports.digUntil = function (name, condition) {
  console.log("Mining " + name + " until condition reached");

  var bot = this;
  var blocks = [];

  var methods = {
    findBlock: search.findBlock.bind(bot),
    walkTo: navigate.walkTo.bind(bot),
    digBlock: dig.digBlock.bind(bot),
    pushBlock: blocks.push.bind(blocks)
  };

  var promise = new Promise(function (resolve, reject) {
    var success = function () {
      resolve({ 'status': 'success', 'blocks': blocks });
    };
    var failure = function () {
      if (blocks) {
        resolve({ 'status': 'partial', 'blocks': blocks });
      }
      else {
        reject('none');
      }
    };

    iterator(name, condition, methods).then(success, failure);
  });

  return promise;
};

var iterate = function (name, methods) {
  return methods.findBlock(name, 10).then(function (search) {
    var lastPromise = Promise.resolve(undefined);

    search.blocks.forEach(function (point) {
      var walkAndDig = function () {
        var promise = methods.walkTo(point).then(methods.digBlock);
        promise.then(methods.appendBlock);

        return promise;
      };

      lastPromise = lastPromise.then(walkAndDig, walkAndDig);
    });

    return lastPromise;
  });
};

var iterator = function (name, condition, methods) {
  var promise = iterate(name, methods);

  return promise.then(function () {
    if (condition()) {
      return iterator(name, condition, methods);
    }
    return true;
  }, function (error) {
    console.log("Failed to dig " + name + ": " + error);

    return false;
  });
};
