/* jshint esnext: true */

var minecraftData = require('minecraft-data')('1.8.8');

var blocks = {
  constant: {},
  name: minecraftData.blocksByName
};

var toConstant = function (name) {
  return name.toUpperCase();
};

for (var name in minecraftData.blocksByName) {
  blocks.constant[toConstant(name)] = minecraftData.blocksByName[name];
}

export default blocks;
