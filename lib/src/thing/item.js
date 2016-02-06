/* jshint esnext: true */

var minecraftData = require('minecraft-data')('1.8.8');

var items = {
  constant: {},
  name: minecraftData.itemsByName
};

var toConstant = function (name) {
  return name.toUpperCase();
};

for (var name in minecraftData.itemsByName) {
  items.constant[toConstant(name)] = minecraftData.itemsByName[name];
}

export default items;
