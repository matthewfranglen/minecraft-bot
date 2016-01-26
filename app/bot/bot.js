/* jshint esnext: true */

var digLib = require('./dig.js');
var navigateLib = require('./navigate.js');

exports.createBot = function (name) {
  var bot = mineflayer.createBot({
      host: '192.168.1.50',
      port: 25565,
      username: name
  });

  bot.on('end', onEnd);
  bot.on('kicked', onKick);

  navigatePlugin(bot);
  simple.install(bot);

  var dig = digLib.dig.bind(bot);
  var walk = navigateLib.walkTo.bind(bot);

  return {
    bot: bot,

    dig: {
      point: dig,
      offset: function (direction, offset) {
        return dig(offsetToPoint(bot, direction, offset));
      },
      shape: function (direction, shape) {
        return shapeTracer(bot, direction, shape, dig);
      }
    },

    move: {
      point: walk,
      offset: function (direction, offset) {
        return walk(offsetToPoint(bot, direction, offset));
      }
    }
  };
};

var directionMatricies = {
  north: [[ 0,  0,  1],
          [ 1,  0,  0],
          [ 0,  1,  0]],
  south: [[ 0,  0, -1],
          [-1,  0,  0],
          [ 0,  1,  0]],
  east:  [[-1,  0,  0],
          [ 0,  0, -1],
          [ 0,  1,  0]],
  west:  [[ 1,  0,  0],
          [ 0,  0,  1],
          [ 0,  1,  0]],
  up:    [[ 0,  1,  0],
          [ 0,  0,  1],
          [ 1,  0,  0]],
  down:  [[ 0, -1,  0],
          [ 0,  0,  1],
          [ 1,  0,  0]]
};

var offsetToPoint = function (bot, direction, offset) {
  return bot.entity.position.offset(offsetToCardinal(direction, offset));
};

var offsetToCardinal = function (direction, offset) {
  var matrix = directionMatricies[direction];

  return matrix.map(v => v.reduce((a, v, i) => (offset[i] * v) + a, 0));
};

var shapeTracer = function (bot, direction, shape, f) {
  var trace = function (shape) {
    var offset = shape.pop();
    if (! offset) {
      return;
    }

    var point = offsetToPoint(bot, direction, offset);
    return f(point).then(function () {
      return trace(shape);
    });
  };

  return trace(shape.slice());
};

var onEnd = function () {
  console.log('I have been disconnected');
};

var onKick = function (reason, loggedIn) {
  console.log('I was kicked for ' + reason);
};
