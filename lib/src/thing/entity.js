/* jshint esnext: true */

var minecraftData = require('minecraft-data')('1.8.8');

var nameToConstant = function (name) {
  return name.replace(/[A-Z]/g, '_$&').replace(/^_/, '').toUpperCase();
};

var entities = {};
for (var name in minecraftData.entitiesByName) {
  entities[nameToConstant(name)] = minecraftData.entitiesByName[name];
}

export default entities;
