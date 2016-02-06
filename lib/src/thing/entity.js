/* jshint esnext: true */

var minecraftData = require('minecraft-data')('1.8.8');

var entities = {
  constant: {},
  name: minecraftData.entitiesByName
};

var toConstant = function (name) {
  return name.replace(/[A-Z]/g, '_$&').replace(/^_/, '').toUpperCase();
};

for (var name in minecraftData.entitiesByName) {
  entities.constant[toConstant(name)] = minecraftData.entitiesByName[name];
}

export default entities;
