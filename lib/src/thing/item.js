/* jshint esnext: true */

var minecraftData = require('minecraft-data')('1.8.8');

var items = {};
for (var name in minecraftData.itemsByName) {
  items[name.toUpperCase()] = minecraftData.itemsByName[name];
}

export default items;
