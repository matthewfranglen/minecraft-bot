/* jshint esnext: true */
// Wraps walking around

var mineflayer = require('mineflayer');
var navigatePlugin = require('mineflayer-navigate')(mineflayer);

exports.install = function (bot) {
  navigatePlugin(bot);
};

// This walks to the point provided.
// This must be called with a this value of the bot.
// The point must be a vec3 or an array of x, y, z
// This calls the callback with a string indicating status:
//   arrived: walked to within 1 square of the point
//   obstructed: walked but coult not reach point
//   interrupted: walking was interrupted
//   timeout: path search timed out
//   tooFar: distance to point too far
exports.walkTo = function (point, callback) {
  console.log("walking to " + point);
  var bot = this;

  var search = bot.navigate.findPathSync(point, { endRadius: 1 });
  if (search.length <= 1) {
    callback('success');
  }
  else if (search.status === 'success' || search.status === 'noPath') {
    bot.navigate.walk(search.path, callback);
  }
  else {
    callback(search.status);
  }
};
