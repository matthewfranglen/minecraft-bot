/* jshint esnext: true */

var minecraftData = require('minecraft-data')('1.8.8');

var blocks = {};
for (var name in minecraftData.blocksByName) {
    blocks[name.toUpperCase()] = minecraftData.blocksByName[name];
}

export default blocks;
